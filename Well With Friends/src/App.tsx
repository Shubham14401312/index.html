import React, { useState, useEffect, useCallback } from 'react';
import { User, MatchPreferences, AppState, ChatMessage } from './types';
import { analytics, trackPageView } from './utils/analytics';
import { APP_CONFIG } from './utils/constants';

// Components
import AnimatedBackground from './components/Layout/AnimatedBackground';
import Navigation from './components/Layout/Navigation';
import LandingPage from './components/Landing/LandingPage';
import OnboardingFlow from './components/Onboarding/OnboardingFlow';
import LobbyView from './components/Lobby/LobbyView';
import SearchingView from './components/Search/SearchingView';
import VideoChat from './components/Chat/VideoChat';

// Hooks
import useWebRTC from './hooks/useWebRTC';
import useSocket from './hooks/useSocket';

const App: React.FC = () => {
  // Main app state
  const [appState, setAppState] = useState<AppState>({
    currentView: 'landing',
    user: null,
    currentPartner: null,
    localStream: null,
    remoteStream: null,
    isConnected: false,
    messages: [],
    matchPreferences: {
      ageRange: [18, 65],
      country: 'any',
      interests: [],
      gender: 'any'
    },
    isLoading: false,
    error: null,
    callSession: null,
    activeUsers: 12847, // Mock active users count
    userStats: {
      totalConnections: 0,
      avgCallDuration: 0,
      favoriteCountries: []
    }
  });

  // Additional state for UI
  const [searchTime, setSearchTime] = useState(0);
  const [callDuration, setCallDuration] = useState(0);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState(8);

  // Custom hooks
  const webRTC = useWebRTC();
  const socket = useSocket();

  // Initialize analytics
  useEffect(() => {
    analytics.trackPageLoad(Date.now());
    trackPageView(appState.currentView);
  }, [appState.currentView]);

  // Search timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (appState.currentView === 'searching') {
      interval = setInterval(() => {
        setSearchTime(prev => prev + 1);
      }, 1000);
    } else {
      setSearchTime(0);
    }
    return () => clearInterval(interval);
  }, [appState.currentView]);

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (appState.currentView === 'chat' && appState.currentPartner) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [appState.currentView, appState.currentPartner]);

  // WebRTC integration
  useEffect(() => {
    setAppState(prev => ({
      ...prev,
      localStream: webRTC.localStream,
      remoteStream: webRTC.remoteStream
    }));
  }, [webRTC.localStream, webRTC.remoteStream]);

  // Socket event handlers
  useEffect(() => {
    socket.on('match-found', (partner: User) => {
      console.log('Match found:', partner);
      handleMatchFound(partner);
    });

    socket.on('call-offer', ({ offer, fromUser }: { offer: RTCSessionDescriptionInit, fromUser: User }) => {
      webRTC.createAnswer(offer);
    });

    socket.on('call-answer', ({ answer }: { answer: RTCSessionDescriptionInit }) => {
      webRTC.handleAnswer(answer);
    });

    socket.on('ice-candidate', ({ candidate }: { candidate: RTCIceCandidateInit }) => {
      webRTC.handleIceCandidate(candidate);
    });

    return () => {
      socket.off('match-found');
      socket.off('call-offer');
      socket.off('call-answer');
      socket.off('ice-candidate');
    };
  }, [socket, webRTC]);

  // App navigation handlers
  const handleGetStarted = useCallback(() => {
    analytics.track('get_started_clicked');
    setAppState(prev => ({ ...prev, currentView: 'onboarding' }));
  }, []);

  const handleOnboardingComplete = useCallback(async (userData: Partial<User>, preferences: MatchPreferences) => {
    try {
      const userId = `user_${Date.now()}`;
      const newUser: User = {
        id: userId,
        name: userData.name || 'Anonymous',
        age: userData.age || 18,
        gender: userData.gender || 'other',
        country: userData.country || 'Unknown',
        interests: userData.interests || [],
        isOnline: true,
        lastSeen: new Date(),
        reportCount: 0,
        isBanned: false,
        language: userData.language || 'en',
        verificationStatus: 'verified'
      };

      // Initialize camera
      await webRTC.initializeLocalStream();
      webRTC.setSocketConnection(socket);

      analytics.setUserId(userId);
      analytics.trackUserRegistration('onboarding');

      setAppState(prev => ({
        ...prev,
        currentView: 'lobby',
        user: newUser,
        matchPreferences: preferences
      }));
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setAppState(prev => ({
        ...prev,
        error: 'Failed to access camera. Please allow camera access and try again.'
      }));
    }
  }, [webRTC, socket]);

  const handleStartSearch = useCallback(() => {
    if (!appState.user) return;

    analytics.trackPartnerSearch(appState.matchPreferences);
    
    webRTC.createPeerConnection();
    if (webRTC.localStream) {
      webRTC.addLocalStreamToPeer(webRTC.localStream);
    }

    socket.searchForPartner({
      userId: appState.user.id,
      preferences: appState.matchPreferences
    });

    setAppState(prev => ({ ...prev, currentView: 'searching' }));
  }, [appState.user, appState.matchPreferences, webRTC, socket]);

  const handleMatchFound = useCallback(async (partner: User) => {
    analytics.trackPartnerMatch(searchTime);
    analytics.trackVideoCallStart(partner.id);

    setAppState(prev => ({
      ...prev,
      currentView: 'chat',
      currentPartner: partner,
      messages: [{
        id: 'welcome',
        senderId: 'system',
        message: `Connected with ${partner.name} from ${partner.country}`,
        timestamp: new Date(),
        type: 'system'
      }]
    }));

    // Initiate WebRTC call
    await webRTC.createOffer();
  }, [searchTime, webRTC]);

  const handleSendMessage = useCallback((message: string) => {
    if (!appState.currentPartner) return;

    const chatMessage = socket.sendMessage(message, appState.currentPartner.id);
    analytics.trackMessageSent(message.length, /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu.test(message));

    setAppState(prev => ({
      ...prev,
      messages: [...prev.messages, chatMessage]
    }));
  }, [appState.currentPartner, socket]);

  const handleEndCall = useCallback(() => {
    if (callDuration > 0) {
      analytics.trackVideoCallEnd(callDuration, 'user_ended');
    }
    
    webRTC.endCall();
    socket.endCall();

    setAppState(prev => ({
      ...prev,
      currentView: 'lobby',
      currentPartner: null,
      messages: []
    }));
  }, [callDuration, webRTC, socket]);

  const handleNextPartner = useCallback(() => {
    if (callDuration > 0) {
      analytics.trackVideoCallEnd(callDuration, 'next_partner');
    }

    webRTC.endCall();
    handleStartSearch();
  }, [callDuration, webRTC, handleStartSearch]);

  const handleReport = useCallback((reason: string) => {
    if (!appState.currentPartner) return;
    
    analytics.trackUserReport(reason);
    socket.reportUser(appState.currentPartner.id, reason);
    
    // Show confirmation
    alert('Report submitted successfully. Thank you for helping keep our community safe.');
  }, [appState.currentPartner, socket]);

  const handleCancelSearch = useCallback(() => {
    socket.emit('search-cancelled');
    setAppState(prev => ({ ...prev, currentView: 'lobby' }));
  }, [socket]);

  const handleBackToLanding = useCallback(() => {
    setAppState(prev => ({ ...prev, currentView: 'landing' }));
  }, []);

  const handleUpdatePreferences = useCallback((preferences: MatchPreferences) => {
    setAppState(prev => ({ ...prev, matchPreferences: preferences }));
  }, []);

  // Mock handlers for navigation buttons
  const handleAdminClick = () => {
    analytics.trackFeatureUsage('admin_panel', 'open');
    alert('Admin panel would open here in a full implementation');
  };

  const handleSettingsClick = () => {
    analytics.trackFeatureUsage('settings', 'open');
    alert('Settings panel would open here');
  };

  const handleStatsClick = () => {
    analytics.trackFeatureUsage('stats', 'view');
    const sessionData = analytics.getSessionData();
    console.log('Analytics Session Data:', sessionData);
    alert('Check console for analytics data');
  };

  // Render current view
  const renderCurrentView = () => {
    switch (appState.currentView) {
      case 'landing':
        return (
          <LandingPage 
            onGetStarted={handleGetStarted}
            activeUsers={appState.activeUsers}
          />
        );
        
      case 'onboarding':
        return (
          <OnboardingFlow 
            onComplete={handleOnboardingComplete}
            onBack={handleBackToLanding}
          />
        );
        
      case 'lobby':
        return appState.user ? (
          <LobbyView 
            user={appState.user}
            preferences={appState.matchPreferences}
            localStream={appState.localStream}
            onStartSearch={handleStartSearch}
            onUpdatePreferences={handleUpdatePreferences}
            activeUsers={appState.activeUsers}
          />
        ) : null;
        
      case 'searching':
        return (
          <SearchingView 
            onCancel={handleCancelSearch}
            searchTime={searchTime}
            estimatedWaitTime={estimatedWaitTime}
          />
        );
        
      case 'chat':
        return appState.currentPartner ? (
          <VideoChat 
            localStream={appState.localStream}
            remoteStream={appState.remoteStream}
            partner={appState.currentPartner}
            messages={appState.messages}
            onSendMessage={handleSendMessage}
            onEndCall={handleEndCall}
            onNextPartner={handleNextPartner}
            onReport={handleReport}
            callDuration={callDuration}
          />
        ) : null;
        
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AnimatedBackground />
      
      {appState.currentView !== 'chat' && (
        <Navigation 
          activeUsers={appState.activeUsers}
          onAdminClick={handleAdminClick}
          onSettingsClick={handleSettingsClick}
          onStatsClick={handleStatsClick}
        />
      )}
      
      {renderCurrentView()}
      
      {/* Error Toast */}
      {appState.error && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slideIn">
          <p className="font-medium">{appState.error}</p>
          <button 
            onClick={() => setAppState(prev => ({ ...prev, error: null }))}
            className="ml-4 text-red-200 hover:text-white"
          >
            ×
          </button>
        </div>
      )}
      
      {/* Loading Overlay */}
      {appState.isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white text-lg font-medium">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;