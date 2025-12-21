
export enum UserRole {
  REGULAR = 'REGULAR',
  ADMIN = 'ADMIN',
  DEV = 'DEV'
}

export interface Party {
  id: string; // The 2-digit party code (e.g., "12")
  name: string;
}

export interface User {
  id: string;
  name: string;
  password?: string; // Stored for regular users
  adminCode?: string; // The full Hamstarxxx for admins
  role: UserRole;
  partyId: string;
  profileLink?: string;
}

export interface Folder {
  id: string;
  name: string;
  icon: string;
  partyId: string;
}

export interface Card {
  id: string;
  userId: string;
  folderId: string;
  partyId: string;
  displayName: string;
  externalLink: string;
  timestamp: number;
  x?: number;
  y?: number;
}

export interface InstructionBox {
  id: string;
  folderId: string;
  partyId: string;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Follow {
  id: string;
  followerId: string;
  targetCardId: string;
  partyId: string;
  timestamp: number;
}

export enum NotificationType {
  FOLLOW = 'FOLLOW',
  FOLLOW_BACK = 'FOLLOW_BACK'
}

export interface AppNotification {
  id: string;
  recipientId: string;
  senderId: string;
  senderName: string;
  type: NotificationType;
  relatedCardId: string;
  partyId: string;
  timestamp: number;
  read: boolean;
}
