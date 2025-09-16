interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp: Date;
  userId?: string;
  sessionId: string;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private sessionId: string;
  private userId?: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeSession();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSession() {
    this.track('session_start', {
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    });
  }

  setUserId(userId: string) {
    this.userId = userId;
    this.track('user_identified', { userId });
  }

  track(event: string, properties?: Record<string, any>) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        sessionDuration: this.getSessionDuration(),
        page: window.location.pathname
      },
      timestamp: new Date(),
      userId: this.userId,
      sessionId: this.sessionId
    };

    this.events.push(analyticsEvent);
    console.log('Analytics Event:', analyticsEvent);

    // In a real app, you would send this to your analytics service
    // this.sendToAnalyticsService(analyticsEvent);
  }

  private getSessionDuration(): number {
    const firstEvent = this.events.find(e => e.event === 'session_start');
    if (!firstEvent) return 0;
    
    return Date.now() - firstEvent.timestamp.getTime();
  }

  // User Journey Events
  trackUserRegistration(method: string) {
    this.track('user_registration', { method });
  }

  trackVideoCallStart(partnerId?: string) {
    this.track('video_call_start', { partnerId, callType: 'peer_to_peer' });
  }

  trackVideoCallEnd(duration: number, reason: string) {
    this.track('video_call_end', { duration, reason });
  }

  trackMessageSent(messageLength: number, hasEmoji: boolean) {
    this.track('message_sent', { messageLength, hasEmoji });
  }

  trackPartnerSearch(preferences: any) {
    this.track('partner_search_start', {
      preferredGender: preferences.gender,
      preferredCountry: preferences.country,
      ageRange: preferences.ageRange,
      interestCount: preferences.interests?.length || 0
    });
  }

  trackPartnerMatch(matchTime: number) {
    this.track('partner_match_found', { matchTime });
  }

  trackUserReport(reason: string) {
    this.track('user_reported', { reason });
  }

  trackFeatureUsage(feature: string, action: string) {
    this.track('feature_usage', { feature, action });
  }

  trackError(error: string, context: string) {
    this.track('error_occurred', { error, context });
  }

  // Performance tracking
  trackPageLoad(loadTime: number) {
    this.track('page_load', { loadTime });
  }

  trackWebRTCConnection(connectionTime: number, quality: string) {
    this.track('webrtc_connection', { connectionTime, quality });
  }

  // Engagement tracking
  trackTimeSpent(section: string, duration: number) {
    this.track('time_spent', { section, duration });
  }

  trackButtonClick(button: string, context: string) {
    this.track('button_click', { button, context });
  }

  // Get analytics data for debugging/admin purposes
  getSessionData() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      eventCount: this.events.length,
      sessionDuration: this.getSessionDuration(),
      events: this.events
    };
  }

  // Export data for analysis
  exportData() {
    const data = {
      session: this.getSessionData(),
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      exportTimestamp: new Date().toISOString()
    };

    return JSON.stringify(data, null, 2);
  }

  // Privacy compliance
  clearData() {
    this.events = [];
    this.userId = undefined;
    this.track('data_cleared');
  }
}

// Create singleton instance
const analytics = new Analytics();

export default analytics;

// Convenience functions for common events
export const trackEvent = (event: string, properties?: Record<string, any>) => {
  analytics.track(event, properties);
};

export const trackUserAction = (action: string, element: string, context?: string) => {
  analytics.track('user_action', { action, element, context });
};

export const trackPageView = (page: string) => {
  analytics.track('page_view', { page });
};

export const trackVideoCall = {
  start: (partnerId?: string) => analytics.trackVideoCallStart(partnerId),
  end: (duration: number, reason: string) => analytics.trackVideoCallEnd(duration, reason)
};

export const trackChat = {
  messageSent: (length: number, hasEmoji: boolean) => analytics.trackMessageSent(length, hasEmoji)
};

export const trackMatching = {
  searchStart: (preferences: any) => analytics.trackPartnerSearch(preferences),
  matchFound: (matchTime: number) => analytics.trackPartnerMatch(matchTime)
};

export { analytics };