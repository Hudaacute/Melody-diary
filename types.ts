
export type Visibility = 'private' | 'public';

export interface Decoration {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
}

export interface DiaryEntry {
  id: string;
  userId: string;
  userName: string;
  userPfp: string;
  text: string;
  imageUrl?: string;
  visibility: Visibility;
  timestamp: number;
  decorations: Decoration[];
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  pfp: string;
  friends: string[]; // List of user IDs
  pendingRequests: string[];
  lastActive: string;
  isAdmin?: boolean;
}

export interface Group {
  id: string;
  name: string;
  members: string[]; // List of user IDs
  ownerId: string;
  isPublic: boolean;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  groupId: string; // Group this message belongs to
  text: string;
  timestamp: number;
}
