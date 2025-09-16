export const APP_CONFIG = {
  name: 'Well With Friends',
  version: '2.0.0',
  description: 'Connect with amazing people through secure video chat',
  maxCallDuration: 3600, // 1 hour in seconds
  maxMessageLength: 500,
  supportedLanguages: [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' }
  ],
  countries: [
    'USA', 'Canada', 'UK', 'Germany', 'France', 'Spain', 'Italy', 'India',
    'Japan', 'Australia', 'Brazil', 'Mexico', 'South Korea', 'Netherlands',
    'Sweden', 'Norway', 'Denmark', 'Finland', 'Switzerland', 'Austria',
    'Belgium', 'Portugal', 'Ireland', 'New Zealand', 'Singapore', 'Thailand',
    'Malaysia', 'Philippines', 'Indonesia', 'Vietnam', 'Poland', 'Czech Republic',
    'Hungary', 'Romania', 'Greece', 'Turkey', 'Israel', 'UAE', 'Saudi Arabia',
    'Egypt', 'South Africa', 'Nigeria', 'Kenya', 'Morocco', 'Argentina',
    'Chile', 'Colombia', 'Peru', 'Venezuela', 'Ecuador'
  ],
  interests: [
    'Movies', 'Music', 'Travel', 'Sports', 'Gaming', 'Books', 'Art', 'Technology',
    'Cooking', 'Photography', 'Dancing', 'Languages', 'Fashion', 'Science',
    'Nature', 'Fitness', 'History', 'Comedy', 'Education', 'Business',
    'Anime', 'Manga', 'Comics', 'Podcasts', 'Streaming', 'YouTube',
    'Social Media', 'Blogging', 'Writing', 'Poetry', 'Theater', 'Cinema',
    'Concerts', 'Festivals', 'Parties', 'Nightlife', 'Bars', 'Restaurants',
    'Coffee', 'Tea', 'Wine', 'Beer', 'Cocktails', 'Food', 'Baking',
    'Gardening', 'Pets', 'Animals', 'Environment', 'Sustainability',
    'Politics', 'Current Events', 'News', 'Philosophy', 'Psychology',
    'Spirituality', 'Meditation', 'Yoga', 'Health', 'Wellness',
    'Beauty', 'Makeup', 'Skincare', 'Hair', 'Nails', 'Tattoos',
    'Piercings', 'Jewelry', 'Accessories', 'Shopping', 'Thrifting'
  ],
  reportReasons: [
    'Inappropriate behavior',
    'Harassment or bullying',
    'Spam or advertising',
    'Fake profile or catfishing',
    'Underage user',
    'Nudity or sexual content',
    'Violence or threats',
    'Hate speech or discrimination',
    'Technical issues',
    'Other'
  ]
};

export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  
  // User Management
  USER_JOIN: 'user-join',
  USER_LEAVE: 'user-leave',
  USER_UPDATE: 'user-update',
  
  // Matching
  SEARCH_PARTNER: 'search-partner',
  MATCH_FOUND: 'match-found',
  MATCH_DECLINED: 'match-declined',
  SEARCH_CANCELLED: 'search-cancelled',
  
  // WebRTC Signaling
  CALL_OFFER: 'call-offer',
  CALL_ANSWER: 'call-answer',
  ICE_CANDIDATE: 'ice-candidate',
  CALL_ENDED: 'call-ended',
  
  // Chat
  CHAT_MESSAGE: 'chat-message',
  TYPING_START: 'typing-start',
  TYPING_STOP: 'typing-stop',
  
  // Moderation
  REPORT_USER: 'report-user',
  USER_BANNED: 'user-banned',
  USER_WARNED: 'user-warned',
  
  // Admin
  ADMIN_LOGIN: 'admin-login',
  ADMIN_ACTION: 'admin-action',
  ADMIN_STATS: 'admin-stats'
};

export const WebRTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' }
  ],
  iceCandidatePoolSize: 10,
  bundlePolicy: 'max-bundle',
  rtcpMuxPolicy: 'require'
};

export const MEDIA_CONSTRAINTS: MediaStreamConstraints = {
  video: {
    width: { min: 640, ideal: 1280, max: 1920 },
    height: { min: 480, ideal: 720, max: 1080 },
    frameRate: { min: 15, ideal: 30, max: 60 },
    facingMode: 'user'
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    sampleRate: 48000
  }
};

export const UI_CONSTANTS = {
  ANIMATION_DURATION: 300,
  TOAST_DURATION: 5000,
  SEARCH_TIMEOUT: 30000,
  RECONNECT_INTERVAL: 5000,
  TYPING_TIMEOUT: 1000,
  HEARTBEAT_INTERVAL: 30000
};