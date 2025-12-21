
import { User, Folder, Card, Follow, AppNotification, UserRole, NotificationType, Party, InstructionBox } from './types';
import { supabase } from './supabase';

const SESSION_KEY = 'connector_pro_v3_session';
export const SYSTEM_PARTY_ID = 'SYSTEM';

export const saveSession = (user: User | null) => {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
};

export const getSession = (): User | null => {
  const data = localStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
};

// --- Party Operations ---

export const getParties = async () => {
  const { data, error } = await supabase.from('parties').select('*').order('name');
  if (error) {
    console.error("Fetch Parties Error:", error.message || error);
    return [];
  }
  return data as Party[];
};

export const findPartyByName = async (name: string): Promise<Party | null> => {
  const searchName = name.trim();
  if (!searchName) return null;
  const { data, error } = await supabase
    .from('parties')
    .select('*')
    .ilike('name', searchName)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data as Party | null;
};

export const findParty = async (partyId: string): Promise<Party | null> => {
  if (partyId === SYSTEM_PARTY_ID) return { id: SYSTEM_PARTY_ID, name: 'System Core' };
  const { data, error } = await supabase
    .from('parties')
    .select('*')
    .eq('id', partyId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data as Party | null;
};

// --- Global Data Fetch ---

export const getPartyData = async (partyId: string) => {
  const [foldersRes, cardsRes, followsRes, notificationsRes, instructionsRes] = await Promise.all([
    supabase.from('folders').select('*').or(`partyId.eq.${partyId},partyId.eq.${SYSTEM_PARTY_ID}`).order('name'),
    supabase.from('cards').select('*').or(`partyId.eq.${partyId},partyId.eq.${SYSTEM_PARTY_ID}`).order('timestamp', { ascending: false }),
    supabase.from('follows').select('*').eq('partyId', partyId),
    supabase.from('notifications').select('*').eq('partyId', partyId).order('timestamp', { ascending: false }),
    supabase.from('instructions').select('*').or(`partyId.eq.${partyId},partyId.eq.${SYSTEM_PARTY_ID}`)
  ]);

  return {
    folders: (foldersRes.data || []) as Folder[],
    cards: (cardsRes.data || []) as Card[],
    follows: (followsRes.data || []) as Follow[],
    notifications: (notificationsRes.data || []) as AppNotification[],
    instructions: (instructionsRes.data || []) as InstructionBox[]
  };
};

export const getAuthorityData = async () => {
  const [parties, users, folders, cards] = await Promise.all([
    supabase.from('parties').select('*'),
    supabase.from('users').select('*'),
    supabase.from('folders').select('*'),
    supabase.from('cards').select('*')
  ]);
  return {
    parties: (parties.data || []) as Party[],
    users: (users.data || []) as User[],
    folders: (folders.data || []) as Folder[],
    cards: (cards.data || []) as Card[]
  };
};

// --- Interaction Operations ---

export const upsertCard = async (card: Card, isUpdate: boolean = false) => {
  if (isUpdate) {
    const { error } = await supabase.from('cards')
      .update({ 
        displayName: card.displayName, 
        externalLink: card.externalLink,
        x: card.x,
        y: card.y
      })
      .eq('id', card.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('cards').insert([card]);
    if (error) throw error;
  }
};

export const deleteCard = async (id: string) => {
  await supabase.from('cards').delete().eq('id', id);
};

// --- Instruction Box Operations ---

export const upsertInstruction = async (box: InstructionBox) => {
  const { error } = await supabase.from('instructions').upsert([box]);
  if (error) throw error;
};

export const deleteInstruction = async (id: string) => {
  const { error } = await supabase.from('instructions').delete().eq('id', id);
  if (error) throw error;
};

// --- Rest of original db.ts contents... ---
export const validateAdminPassword = (password: string) => {
  const regex = /^Hamstar([1-9]{2})([1-9])$/;
  const match = password.trim().match(regex);
  if (!match) return null;
  return { partyId: match[1], adminId: match[2] };
};

export const validateDevPassword = (password: string) => {
  const regex = /^Dev([1-8]{2})$/;
  const match = password.trim().match(regex);
  return !!match;
};

export const registerParty = async (partyName: string, adminPassword: string) => {
  const cleanName = partyName.trim();
  const info = validateAdminPassword(adminPassword);
  if (!info) throw new Error("Invalid password format.");
  const existing = await findPartyByName(cleanName);
  if (existing) throw new Error(`Community name taken.`);
  const existingId = await findParty(info.partyId);
  if (existingId) throw new Error(`Code in use.`);
  const newParty: Party = { id: info.partyId, name: cleanName };
  const newAdmin: User = {
    id: `admin-${info.partyId}-${info.adminId}`,
    name: 'Admin',
    adminCode: adminPassword.trim(),
    role: UserRole.ADMIN,
    partyId: info.partyId
  };
  await supabase.from('parties').insert([newParty]);
  await supabase.from('users').insert([newAdmin]);
  return { party: newParty, admin: newAdmin };
};

export const loginUser = async (username: string, password: string, partyId: string): Promise<User | null> => {
  const { data } = await supabase.from('users').select('*').eq('name', username).eq('partyId', partyId).single();
  if (!data) return null;
  const user = data as User;
  if (user.role === UserRole.ADMIN) return user.adminCode === password ? user : null;
  return user.password === password ? user : null;
};

export const registerUser = async (user: User) => {
  await supabase.from('users').insert([user]);
  return user;
};

export const checkUserExists = async (username: string, partyId: string) => {
  const { data } = await supabase.from('users').select('id').eq('name', username).eq('partyId', partyId).single();
  return !!data;
};

export const addFolder = async (folder: Folder) => {
  await supabase.from('folders').insert([folder]);
};

export const updateFolderName = async (id: string, name: string) => {
  await supabase.from('folders').update({ name }).eq('id', id);
};

export const deleteFolder = async (id: string) => {
  await supabase.from('folders').delete().eq('id', id);
};

export const upsertFollow = async (follow: Follow, shouldAdd: boolean) => {
  if (shouldAdd) {
    await supabase.from('follows').insert([follow]);
  } else {
    await supabase.from('follows').delete().eq('followerId', follow.followerId).eq('targetCardId', follow.targetCardId);
  }
};

export const addNotification = async (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
  const newNotif = { ...notif, id: Math.random().toString(36).substr(2, 9), timestamp: Date.now(), read: false };
  await supabase.from('notifications').insert([newNotif]);
  return newNotif as AppNotification;
};

export const markRead = async (id: string) => {
  await supabase.from('notifications').update({ read: true }).eq('id', id);
};
