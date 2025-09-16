export interface User {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  country: string;
  interests: string[];
  profilePicture?: string;
  isOnline: boolean;
  lastSeen: Date;
  reportCount: number;
  isBanned: boolean;
  language: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'system' | 'emoji';
}

export interface MatchPreferences {
  ageRange: [number, number];
  country: string;
  interests: string[];
  gender: 'male' | 'female' | 'other' | 'any';
}

export interface CallSession {
  id: string;
  participants: string[];
  startTime: Date;
  endTime?: Date;
  duration?: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  reportedIssues: string[];
}

export interface AppState {
  currentView: 'landing' | 'onboarding' | 'lobby' | 'searching' | 'chat' | 'admin';
  user: User | null;
  currentPartner: User | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isConnected: boolean;
  messages: ChatMessage[];
  matchPreferences: MatchPreferences;
  isLoading: boolean;
  error: string | null;
  callSession: CallSession | null;
  activeUsers: number;
  userStats: {
    totalConnections: number;
    avgCallDuration: number;
    favoriteCountries: string[];
  };
}

export interface WebRTCConfig {
  iceServers: RTCIceServer[];
  iceCandidatePoolSize?: number;
}

export interface SocketEvents {
  'user-join': (userData: User) => void;
  'user-leave': (userId: string) => void;
  'match-found': (partner: User) => void;
  'match-declined': () => void;
  'call-offer': (offer: RTCSessionDescriptionInit, fromUser: User) => void;
  'call-answer': (answer: RTCSessionDescriptionInit) => void;
  'ice-candidate': (candidate: RTCIceCandidateInit) => void;
  'call-ended': () => void;
  'chat-message': (message: ChatMessage) => void;
  'user-report': (reportData: any) => void;
  'admin-action': (action: string, data: any) => void;
}