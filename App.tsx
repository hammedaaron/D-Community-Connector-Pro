
import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { User, UserRole, Folder, Card, Follow, AppNotification, NotificationType, Party, InstructionBox } from './types';
import { getSession, saveSession, findParty, getPartyData, markRead, deleteCard as dbDeleteCard, upsertCard, upsertFollow, addNotification, SYSTEM_PARTY_ID } from './db';
import { supabase } from './supabase';
import Layout from './components/Layout';
import CardGrid from './components/CardGrid';
import AuthorityTable from './components/AuthorityTable';
import CreateProfileModal from './components/CreateProfileModal';
import EditProfileModal from './components/EditProfileModal';
import Gate from './components/Gate';
import Toast from './components/Toast';
import DevWorkflow from './components/DevWorkflow';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  activeParty: Party | null;
  isAdmin: boolean;
  isDev: boolean;
  logout: () => void;
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  cards: Card[];
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
  follows: Follow[];
  toggleFollow: (cardId: string) => void;
  notifications: AppNotification[];
  instructions: InstructionBox[];
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
  showToast: (message: any, type?: 'success' | 'error') => void;
  isWorkflowMode: boolean;
  setIsWorkflowMode: (val: boolean) => void;
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
  const [instructions, setInstructions] = useState<InstructionBox[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isPoweredUp, setIsPoweredUp] = useState(false);
  const [isWorkflowMode, setIsWorkflowMode] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const showToast = useCallback((message: any, type: 'success' | 'error' = 'success') => {
    let finalMsg = "Notice";
    if (typeof message === 'string') {
      finalMsg = message;
    } else if (message?.message) {
      finalMsg = String(message.message);
    } else if (message && typeof message === 'object') {
      try {
        finalMsg = JSON.stringify(message);
      } catch {
        finalMsg = "An error occurred";
      }
    } else if (message) {
      finalMsg = String(message);
    }
    setToast({ message: finalMsg, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const syncData = useCallback(async () => {
    const pid = currentUser?.partyId || SYSTEM_PARTY_ID;
    try {
      const party = await findParty(pid);
      if (party) {
        setActiveParty(party);
        if (currentUser?.role !== UserRole.DEV) {
          const nameSlug = party.name.replace(/\s+/g, '-');
          const expectedHash = `#/party/${party.id}/${nameSlug}`;
          if (window.location.hash !== expectedHash) {
            window.location.hash = expectedHash;
          }
        }
      }
      const data = await getPartyData(pid);
      setFolders(data.folders);
      setCards(data.cards);
      setFollows(data.follows);
      setNotifications(data.notifications);
      setInstructions(data.instructions);
    } catch (err: any) {
      console.error("Sync Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    const channel = supabase.channel(`global_sync`)
      .on('postgres_changes', { event: '*', schema: 'public' }, syncData)
      .subscribe();
    syncData();
    return () => { supabase.removeChannel(channel); };
  }, [currentUser, syncData]);

  useEffect(() => {
    if (currentUser) {
      saveSession(currentUser);
      if (currentUser.role === UserRole.DEV) setTheme('dark');
    }
  }, [currentUser]);

  useEffect(() => {
    if (folders.length > 0 && !selectedFolderId && currentUser?.role !== UserRole.DEV) {
      setSelectedFolderId(folders[0].id);
    }
  }, [folders, selectedFolderId, currentUser]);

  const toggleFollow = useCallback(async (cardId: string) => {
    if (!currentUser || !activeParty) return;
    const isAlreadyFollowed = follows.some(f => f.followerId === currentUser.id && f.targetCardId === cardId);
    const targetCard = cards.find(c => c.id === cardId);
    if (!targetCard) return;
    try {
      const newFollow: Follow = { id: Math.random().toString(36).substr(2, 9), followerId: currentUser.id, targetCardId: cardId, partyId: activeParty.id, timestamp: Date.now() };
      await upsertFollow(newFollow, !isAlreadyFollowed);
      if (!isAlreadyFollowed && targetCard.userId !== currentUser.id) {
        const senderCard = cards.find(c => c.userId === currentUser.id && c.partyId === activeParty.id);
        const myCardIds = cards.filter(c => c.userId === currentUser.id).map(c => c.id);
        const isFollowBack = follows.some(f => f.followerId === targetCard.userId && myCardIds.includes(f.targetCardId));
        await addNotification({ recipientId: targetCard.userId, senderId: currentUser.id, senderName: currentUser.name, type: isFollowBack ? NotificationType.FOLLOW_BACK : NotificationType.FOLLOW, relatedCardId: senderCard?.id || '', partyId: activeParty.id });
      }
      syncData();
    } catch (err) { showToast(err, "error"); }
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
    currentUser, setCurrentUser, activeParty, 
    isAdmin: currentUser?.role === UserRole.ADMIN,
    isDev: currentUser?.role === UserRole.DEV,
    logout, folders, setFolders, cards, setCards,
    follows, toggleFollow, notifications, instructions, markNotificationRead,
    selectedFolderId, setSelectedFolderId, deleteCard, updateCard, searchQuery, setSearchQuery,
    theme, setTheme, isPoweredUp, setIsPoweredUp, showToast, isWorkflowMode, setIsWorkflowMode
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
      <Layout onOpenCreateProfile={() => {
        if (!selectedFolderId) {
          showToast("Please select a community folder first.", "error");
          return;
        }
        setIsCreateModalOpen(true);
      }}>
        {selectedFolderId === 'authority-table' && currentUser.role === UserRole.DEV ? (
          <AuthorityTable />
        ) : (isWorkflowMode && currentUser.role === UserRole.DEV) ? (
          <DevWorkflow folderId={selectedFolderId} />
        ) : (
          <CardGrid 
            folderId={selectedFolderId} 
            onEditCard={(card) => setEditingCard(card)}
          />
        )}
      </Layout>

      {isCreateModalOpen && (
        <CreateProfileModal 
          onClose={() => setIsCreateModalOpen(false)} 
          onSubmit={async (name, link) => {
            if (!currentUser || !selectedFolderId) return;
            
            const alreadyHasProfile = cards.some(c => c.userId === currentUser.id && c.folderId === selectedFolderId);
            const isPrivileged = currentUser.role === UserRole.DEV || currentUser.role === UserRole.ADMIN;
            
            if (alreadyHasProfile && !isPrivileged) {
              showToast("Profile exists already.", "error");
              return;
            }

            const folder = folders.find(f => f.id === selectedFolderId);
            const targetPartyId = folder?.partyId === SYSTEM_PARTY_ID ? SYSTEM_PARTY_ID : activeParty?.id || SYSTEM_PARTY_ID;

            // FIX: Removed default x/y so cards flow in grid by default
            const newCard: Card = { 
              id: Math.random().toString(36).substr(2, 9), 
              userId: currentUser.id, 
              folderId: selectedFolderId, 
              partyId: targetPartyId, 
              displayName: name, 
              externalLink: link, 
              timestamp: Date.now()
            };
            
            try {
              await upsertCard(newCard);
              syncData();
              setIsCreateModalOpen(false);
              showToast("Profile added successfully!");
            } catch (err: any) {
              showToast(err, "error");
            }
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
