
export type Visibility = 'private' | 'public' | 'group';

export interface Comment {
  id: string;
  userName: string;
  userPfp: string;
  text: string;
  timestamp: number;
}

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
  groupId?: string; // If visibility is 'group', this ID links it
  timestamp: number;
  decorations: Decoration[];
  likes: string[]; // Array of User IDs
  comments: Comment[];
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  pfp: string;
  friends: string[];
  pendingRequests: string[];
  lastActive: string;
  isAdmin?: boolean;
}

export interface Group {
  id: string;
  name: string;
  members: string[];
  ownerId: string;
  isPublic: boolean;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  groupId: string;
  text: string;
  timestamp: number;
}
