
import React, { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react';
import { User, UserRole, Folder, Card, Follow, AppNotification, NotificationType, Party } from './types';
import { getSession, saveSession, findParty, getPartyData, markRead, deleteCard as dbDeleteCard, upsertCard, upsertFollow, addNotification } from './db';
import { supabase } from './supabase';
import Layout from './components/Layout';
import CardGrid from './components/CardGrid';
import CreateProfileModal from './components/CreateProfileModal';
import EditProfileModal from './components/EditProfileModal';
import Gate from './components/Gate';
import Toast from './components/Toast';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  activeParty: Party | null;
  isAdmin: boolean;
  logout: () => void;
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  cards: Card[];
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
  follows: Follow[];
  toggleFollow: (cardId: string) => void;
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  selectedFolderId: string | null;
  setSelectedFolderId: (id: string | null) => void;
  deleteCard: (id: string) => void;
  updateCard: (id: string, name: string, link: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  isPoweredUp: boolean;
  setIsPoweredUp: (val: boolean) => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => getSession());
  const [activeParty, setActiveParty] = useState<Party | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [follows, setFollows] = useState<Follow[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isPoweredUp, setIsPoweredUp] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const syncData = useCallback(async () => {
    if (!currentUser?.partyId) return;
    
    try {
      const party = await findParty(currentUser.partyId);
      if (party) {
        setActiveParty(party);
        const nameSlug = party.name.replace(/\s+/g, '-');
        const expectedHash = `#/party/${party.id}/${nameSlug}`;
        if (window.location.hash !== expectedHash) {
          window.location.hash = expectedHash;
        }
      }

      const data = await getPartyData(currentUser.partyId);
      setFolders(data.folders);
      setCards(data.cards);
      setFollows(data.follows);
      setNotifications(data.notifications);
    } catch (err) {
      console.error("Cloud Sync Error:", err);
      showToast("Connection issues. Data might be stale.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, showToast]);

  // Set up Real-time subscriptions for multi-device sync
  useEffect(() => {
    if (!currentUser?.partyId) return;

    const channel = supabase
      .channel(`community_sync_${currentUser.partyId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'folders', filter: `partyId=eq.${currentUser.partyId}` }, syncData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cards', filter: `partyId=eq.${currentUser.partyId}` }, syncData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'follows', filter: `partyId=eq.${currentUser.partyId}` }, syncData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `partyId=eq.${currentUser.partyId}` }, syncData)
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') console.log("Real-time Active");
      });

    syncData();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser?.partyId, syncData]);

  useEffect(() => {
    if (currentUser) {
      saveSession(currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    if (folders.length > 0 && !selectedFolderId) {
      setSelectedFolderId(folders[0].id);
    }
  }, [folders, selectedFolderId]);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleFollow = useCallback(async (cardId: string) => {
    if (!currentUser || !activeParty) return;
    
    const isAlreadyFollowed = follows.some(f => 
      f.followerId === currentUser.id && f.targetCardId === cardId
    );
    const targetCard = cards.find(c => c.id === cardId);
    if (!targetCard) return;

    try {
      const newFollow: Follow = {
        id: Math.random().toString(36).substr(2, 9),
        followerId: currentUser.id,
        targetCardId: cardId,
        partyId: activeParty.id,
        timestamp: Date.now()
      };

      await upsertFollow(newFollow, !isAlreadyFollowed);

      if (!isAlreadyFollowed && targetCard.userId !== currentUser.id) {
        const senderCard = cards.find(c => c.userId === currentUser.id && c.partyId === activeParty.id);
        const myCardIds = cards.filter(c => c.userId === currentUser.id).map(c => c.id);
        const isFollowBack = follows.some(f => 
          f.followerId === targetCard.userId && myCardIds.includes(f.targetCardId)
        );

        await addNotification({
          recipientId: targetCard.userId,
          senderId: currentUser.id,
          senderName: currentUser.name,
          type: isFollowBack ? NotificationType.FOLLOW_BACK : NotificationType.FOLLOW,
          relatedCardId: senderCard?.id || '',
          partyId: activeParty.id
        });
      }
      syncData(); // Instant local refresh via sync
    } catch (err) {
      showToast("Action failed. Try again.", "error");
    }
  }, [currentUser, activeParty, follows, cards, syncData, showToast]);

  const markNotificationRead = async (id: string) => {
    await markRead(id);
    syncData();
  };

  const deleteCard = async (id: string) => {
    await dbDeleteCard(id);
    syncData();
    setEditingCard(null);
    showToast("Profile removed.");
  };

  const updateCard = async (id: string, name: string, link: string) => {
    const existingCard = cards.find(c => c.id === id);
    if (!existingCard) return;

    await upsertCard({ ...existingCard, displayName: name, externalLink: link }, true);
    syncData();
    setEditingCard(null);
    showToast("Profile updated.");
  };

  const logout = () => {
    saveSession(null);
    setCurrentUser(null);
    setActiveParty(null);
    setFolders([]);
    setCards([]);
    window.location.hash = '';
  };

  const contextValue: AppContextType = {
    currentUser, setCurrentUser, activeParty, isAdmin: currentUser?.role === UserRole.ADMIN, 
    logout, folders, setFolders, cards, setCards,
    follows, toggleFollow, notifications, markNotificationRead,
    selectedFolderId, setSelectedFolderId, deleteCard, updateCard, searchQuery, setSearchQuery,
    theme, setTheme, isPoweredUp, setIsPoweredUp, showToast
  };

  if (!currentUser) {
    return (
      <AppContext.Provider value={contextValue}>
        <Gate onAuth={(user) => setCurrentUser(user)} />
        {toast && <Toast message={toast.message} type={toast.type} />}
      </AppContext.Provider>
    );
  }

  return (
    <AppContext.Provider value={contextValue}>
      <Layout onOpenCreateProfile={() => setIsCreateModalOpen(true)}>
        <CardGrid 
          folderId={selectedFolderId} 
          onEditCard={(card) => setEditingCard(card)}
        />
      </Layout>

      {isCreateModalOpen && (
        <CreateProfileModal 
          onClose={() => setIsCreateModalOpen(false)} 
          onSubmit={async (name, link) => {
            if (!currentUser || !selectedFolderId || !activeParty) return;
            const newCard: Card = {
              id: Math.random().toString(36).substr(2, 9),
              userId: currentUser.id,
              folderId: selectedFolderId,
              partyId: activeParty.id,
              displayName: name,
              externalLink: link,
              timestamp: Date.now()
            };
            await upsertCard(newCard);
            syncData();
            setIsCreateModalOpen(false);
            showToast("Profile added!");
          }} 
        />
      )}

      {editingCard && (
        <EditProfileModal 
          card={editingCard}
          onClose={() => setEditingCard(null)}
          onUpdate={updateCard}
          onDelete={deleteCard}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </AppContext.Provider>
  );
};

export default App;
