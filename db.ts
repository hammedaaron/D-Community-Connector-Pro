
import { User, Folder, Card, Follow, AppNotification, UserRole, NotificationType, Party } from './types';
import { supabase } from './supabase';

const SESSION_KEY = 'connector_pro_v3_session';

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
    console.error("Fetch Parties Error:", error);
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
  const [foldersRes, cardsRes, followsRes, notificationsRes] = await Promise.all([
    supabase.from('folders').select('*').eq('partyId', partyId).order('name'),
    supabase.from('cards').select('*').eq('partyId', partyId).order('timestamp', { ascending: false }),
    supabase.from('follows').select('*').eq('partyId', partyId),
    supabase.from('notifications').select('*').eq('partyId', partyId).order('timestamp', { ascending: false })
  ]);

  return {
    folders: (foldersRes.data || []) as Folder[],
    cards: (cardsRes.data || []) as Card[],
    follows: (followsRes.data || []) as Follow[],
    notifications: (notificationsRes.data || []) as AppNotification[]
  };
};

// --- Auth Operations ---

export const validateAdminPassword = (password: string) => {
  const regex = /^Hamstar([1-9]{2})([1-9])$/;
  const match = password.trim().match(regex);
  if (!match) return null;
  return {
    partyId: match[1],
    adminId: match[2]
  };
};

export const registerParty = async (partyName: string, adminPassword: string) => {
  const cleanName = partyName.trim();
  const info = validateAdminPassword(adminPassword);
  
  if (!info) throw new Error("Invalid password format. Use HamstarXXY (XX=Community ID, Y=Admin ID).");

  const existing = await findPartyByName(cleanName);
  if (existing) throw new Error(`Community name "${cleanName}" is already taken.`);

  const existingId = await findParty(info.partyId);
  if (existingId) throw new Error(`Community Code "${info.partyId}" is already in use.`);

  const newParty: Party = { id: info.partyId, name: cleanName };
  const newAdmin: User = {
    id: `admin-${info.partyId}-${info.adminId}`,
    name: 'Admin',
    adminCode: adminPassword.trim(),
    role: UserRole.ADMIN,
    partyId: info.partyId
  };

  const { error: pError } = await supabase.from('parties').insert([newParty]);
  if (pError) throw pError;

  const { error: uError } = await supabase.from('users').insert([newAdmin]);
  if (uError) throw uError;

  return { party: newParty, admin: newAdmin };
};

export const loginUser = async (username: string, password: string, partyId: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('name', username)
    .eq('partyId', partyId)
    .single();

  if (error || !data) return null;
  
  const user = data as User;
  if (user.role === UserRole.ADMIN) {
    return user.adminCode === password ? user : null;
  }
  return user.password === password ? user : null;
};

export const registerUser = async (user: User) => {
  const { error } = await supabase.from('users').insert([user]);
  if (error) throw error;
  return user;
};

export const checkUserExists = async (username: string, partyId: string) => {
  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('name', username)
    .eq('partyId', partyId)
    .single();
  return !!data;
};

// --- Community Management ---

export const addFolder = async (folder: Folder) => {
  const { error } = await supabase.from('folders').insert([folder]);
  if (error) throw error;
};

export const updateFolderName = async (id: string, name: string) => {
  const { error } = await supabase.from('folders').update({ name }).eq('id', id);
  if (error) throw error;
};

export const deleteFolder = async (id: string) => {
  const { error } = await supabase.from('folders').delete().eq('id', id);
  if (error) throw error;
};

// --- Interaction Operations ---

export const upsertCard = async (card: Card, isUpdate: boolean = false) => {
  if (isUpdate) {
    const { error } = await supabase.from('cards')
      .update({ displayName: card.displayName, externalLink: card.externalLink })
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

export const upsertFollow = async (follow: Follow, shouldAdd: boolean) => {
  if (shouldAdd) {
    const { error } = await supabase.from('follows').insert([follow]);
    if (error) throw error;
  } else {
    const { error } = await supabase.from('follows')
      .delete()
      .eq('followerId', follow.followerId)
      .eq('targetCardId', follow.targetCardId);
    if (error) throw error;
  }
};

export const addNotification = async (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
  const newNotif = {
    ...notif,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: Date.now(),
    read: false
  };
  const { error } = await supabase.from('notifications').insert([newNotif]);
  if (error) throw error;
  return newNotif as AppNotification;
};

export const markRead = async (id: string) => {
  await supabase.from('notifications').update({ read: true }).eq('id', id);
};
