
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

// --- System & Dev Initialization ---

export const ensureDevUser = async () => {
  try {
    const { data: party, error: pError } = await supabase.from('parties').select('id').eq('id', SYSTEM_PARTY_ID).single();
    if (!party && (!pError || pError.code === 'PGRST116')) {
      await supabase.from('parties').insert([{ id: SYSTEM_PARTY_ID, name: 'System Core' }]);
    }

    const devId = 'dev-master-root';
    const { data: user, error: uError } = await supabase.from('users').select('id').eq('id', devId).single();
    
    const devData: User = {
      id: devId,
      name: 'Dev',
      role: UserRole.DEV,
      partyId: SYSTEM_PARTY_ID
    };

    if (!user && (!uError || uError.code === 'PGRST116')) {
      await supabase.from('users').insert([devData]);
    }
    
    return devData;
  } catch (err) {
    console.error("Critical: Failed to initialize Dev Node", err);
    throw err;
  }
};

// --- Dev Tools (Authority Logic) ---

export const resetAllData = async () => {
  console.log("[Wipe] Initiating global system reset...");
  try {
    // We use .neq('id', '00000000-0000-0000-0000-000000000000') or .neq('id', '_') 
    // to satisfy the requirement of having a WHERE clause for deletions on RLS-enabled tables.
    const tables = ['notifications', 'follows', 'cards', 'instructions', 'folders'];
    
    for (const table of tables) {
      // Using neq on a value that doesn't exist to effectively "select all" while providing a filter
      const { error } = await supabase.from(table).delete().neq('id', '_root_protected_');
      if (error) console.warn(`[Wipe] Warning on ${table}:`, error.message);
    }

    // Purge users except root
    await supabase.from('users').delete().neq('id', 'dev-master-root');

    // Purge parties except system
    await supabase.from('parties').delete().neq('id', SYSTEM_PARTY_ID);
    
    console.log("[Wipe] Global Reset Complete.");
    return true;
  } catch (err: any) {
    console.error("[Wipe] Reset Error:", err);
    throw new Error(err.message || "Wipe failed. Ensure you ran the RLS SQL script in Supabase.");
  }
};

export const deleteParty = async (id: string) => {
  console.log(`[Terminate] Community ID: ${id}`);
  try {
    // Sequence is critical to prevent Foreign Key constraint errors
    await supabase.from('notifications').delete().eq('partyId', id);
    await supabase.from('follows').delete().eq('partyId', id);
    await supabase.from('cards').delete().eq('partyId', id);
    await supabase.from('instructions').delete().eq('partyId', id);
    await supabase.from('folders').delete().eq('partyId', id);
    await supabase.from('users').delete().eq('partyId', id);
    
    const { error } = await supabase.from('parties').delete().eq('id', id);
    if (error) throw error;
    
    return true;
  } catch (err: any) {
    console.error(`[Terminate] Error:`, err);
    throw new Error(err.message || "Termination blocked by database constraints.");
  }
};

export const deleteUser = async (id: string) => {
  try {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (err: any) {
    console.error(`[User Expel] Error:`, err);
    throw new Error(err.message || "User expulsion failed.");
  }
};

// --- Party Operations ---

export const getParties = async () => {
  try {
    const { data, error } = await supabase.from('parties').select('*').order('name');
    if (error) throw error;
    return (data || []) as Party[];
  } catch (err: any) {
    console.error("Fetch Parties Error:", err.message);
    return [];
  }
};

export const findPartyByName = async (name: string): Promise<Party | null> => {
  const searchName = name.trim();
  if (!searchName) return null;
  try {
    const { data, error } = await supabase
      .from('parties')
      .select('*')
      .ilike('name', searchName)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data as Party | null;
  } catch (err) {
    console.error("Find Party Error:", err);
    return null;
  }
};

export const findParty = async (partyId: string): Promise<Party | null> => {
  if (partyId === SYSTEM_PARTY_ID) return { id: SYSTEM_PARTY_ID, name: 'System Core' };
  try {
    const { data, error } = await supabase
      .from('parties')
      .select('*')
      .eq('id', partyId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data as Party | null;
  } catch (err) {
    console.error("Find Party ID Error:", err);
    return null;
  }
};

// --- Global Data Fetch ---

export const getPartyData = async (partyId: string) => {
  try {
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
  } catch (err) {
    console.error("Fetch Party Data Error:", err);
    return { folders: [], cards: [], follows: [], notifications: [], instructions: [] };
  }
};

export const getAuthorityData = async () => {
  try {
    const [partiesRes, usersRes, foldersRes, cardsRes] = await Promise.all([
      supabase.from('parties').select('*'),
      supabase.from('users').select('*'),
      supabase.from('folders').select('*'),
      supabase.from('cards').select('*')
    ]);
    
    return {
      parties: (partiesRes.data || []) as Party[],
      users: (usersRes.data || []) as User[],
      folders: (foldersRes.data || []) as Folder[],
      cards: (cardsRes.data || []) as Card[]
    };
  } catch (err) {
    console.error("Authority Data Error:", err);
    return { parties: [], users: [], folders: [], cards: [] };
  }
};

// --- Interaction Operations ---

export const upsertCard = async (card: Card, isUpdate: boolean = false) => {
  try {
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
  } catch (err: any) {
    console.error("Upsert Card Error:", err.message);
    throw new Error(err.message || "Failed to save card. Check RLS policies.");
  }
};

export const deleteCard = async (id: string) => {
  try {
    const { error } = await supabase.from('cards').delete().eq('id', id);
    if (error) throw error;
  } catch (err: any) {
    console.error("Delete Card Error:", err.message);
  }
};

// --- Instruction Box Operations ---

export const upsertInstruction = async (box: InstructionBox) => {
  try {
    const { error } = await supabase.from('instructions').upsert([box]);
    if (error) throw error;
  } catch (err: any) {
    console.error("Upsert Instruction Error:", err.message);
  }
};

export const deleteInstruction = async (id: string) => {
  try {
    const { error } = await supabase.from('instructions').delete().eq('id', id);
    if (error) throw error;
  } catch (err: any) {
    console.error("Delete Instruction Error:", err.message);
  }
};

// --- Auth Logic ---

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

  try {
    const { error: pErr } = await supabase.from('parties').insert([newParty]);
    if (pErr) throw pErr;
    const { error: aErr } = await supabase.from('users').insert([newAdmin]);
    if (aErr) throw aErr;
    return { party: newParty, admin: newAdmin };
  } catch (err: any) {
    console.error("Registration Error:", err.message);
    throw new Error(err.message || "Database rejected registration.");
  }
};

export const loginUser = async (username: string, password: string, partyId: string): Promise<User | null> => {
  try {
    const { data } = await supabase.from('users').select('*').eq('name', username).eq('partyId', partyId).single();
    if (!data) return null;
    const user = data as User;
    if (user.role === UserRole.ADMIN) return user.adminCode === password ? user : null;
    return user.password === password ? user : null;
  } catch (err) {
    console.error("Login Error:", err);
    return null;
  }
};

export const registerUser = async (user: User) => {
  try {
    const { error } = await supabase.from('users').insert([user]);
    if (error) throw error;
    return user;
  } catch (err: any) {
    console.error("Register User Error:", err.message);
    throw new Error(err.message || "Registration blocked.");
  }
};

export const checkUserExists = async (username: string, partyId: string) => {
  try {
    const { data } = await supabase.from('users').select('id').eq('name', username).eq('partyId', partyId).single();
    return !!data;
  } catch (err) {
    return false;
  }
};

export const addFolder = async (folder: Folder) => {
  try {
    const { error } = await supabase.from('folders').insert([folder]);
    if (error) throw error;
  } catch (err: any) {
    console.error("Add Folder Error:", err.message);
  }
};

export const updateFolderName = async (id: string, name: string) => {
  try {
    const { error } = await supabase.from('folders').update({ name }).eq('id', id);
    if (error) throw error;
  } catch (err: any) {
    console.error("Update Folder Error:", err.message);
  }
};

export const deleteFolder = async (id: string) => {
  try {
    const { error } = await supabase.from('folders').delete().eq('id', id);
    if (error) throw error;
  } catch (err: any) {
    console.error("Delete Folder Error:", err.message);
  }
};

export const upsertFollow = async (follow: Follow, shouldAdd: boolean) => {
  try {
    if (shouldAdd) {
      const { error } = await supabase.from('follows').insert([follow]);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('follows').delete().eq('followerId', follow.followerId).eq('targetCardId', follow.targetCardId);
      if (error) throw error;
    }
  } catch (err: any) {
    console.error("Upsert Follow Error:", err.message);
  }
};

export const addNotification = async (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
  try {
    const newNotif = { ...notif, id: Math.random().toString(36).substr(2, 9), timestamp: Date.now(), read: false };
    const { error } = await supabase.from('notifications').insert([newNotif]);
    if (error) throw error;
    return newNotif as AppNotification;
  } catch (err: any) {
    console.error("Add Notification Error:", err.message);
    return null;
  }
};

export const markRead = async (id: string) => {
  try {
    const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id);
    if (error) throw error;
  } catch (err: any) {
    console.error("Mark Read Error:", err.message);
  }
};
