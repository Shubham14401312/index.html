import { useEffect, useRef, useCallback, useState } from 'react';
import { User, ChatMessage } from '../types';

const useSocket = (serverUrl: string = 'ws://localhost:3001') => {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    try {
      // For demo purposes, we'll simulate socket connection
      // In a real app, this would be: socketRef.current = new WebSocket(serverUrl);
      console.log('Connecting to socket server...');
      
      // Simulate connection after delay
      setTimeout(() => {
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
        console.log('Socket connected successfully');
      }, 1000);
      
    } catch (err) {
      console.error('Socket connection error:', err);
      setError('Failed to connect to server');
      setIsConnected(false);
      attemptReconnect();
    }
  }, [serverUrl]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    setIsConnected(false);
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
  }, []);

  const attemptReconnect = useCallback(() => {
    if (reconnectAttemptsRef.current < maxReconnectAttempts) {
      const delay = Math.pow(2, reconnectAttemptsRef.current) * 1000; // Exponential backoff
      
      reconnectTimeoutRef.current = setTimeout(() => {
        reconnectAttemptsRef.current++;
        console.log(`Reconnection attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts}`);
        connect();
      }, delay);
    } else {
      setError('Max reconnection attempts reached');
    }
  }, [connect]);

  const emit = useCallback((event: string, data?: any) => {
    if (isConnected) {
      console.log(`Emitting event: ${event}`, data);
      // In a real implementation, this would send data through the socket
      // socketRef.current?.send(JSON.stringify({ event, data }));
    } else {
      console.warn('Socket not connected. Cannot emit event:', event);
    }
  }, [isConnected]);

  const on = useCallback((event: string, callback: (data: any) => void) => {
    // In a real implementation, this would set up event listeners
    console.log(`Setting up listener for event: ${event}`);
    
    // For demo purposes, we'll simulate some events
    if (event === 'match-found') {
      // Simulate finding a match after some time
      setTimeout(() => {
        const mockPartner: User = {
          id: 'partner-1',
          name: 'Demo User',
          age: 25,
          gender: 'other',
          country: 'Virtual Land',
          interests: ['Technology', 'Movies', 'Travel'],
          isOnline: true,
          lastSeen: new Date(),
          reportCount: 0,
          isBanned: false,
          language: 'en',
          verificationStatus: 'verified'
        };
        callback(mockPartner);
      }, 3000);
    }
  }, []);

  const off = useCallback((event: string) => {
    console.log(`Removing listener for event: ${event}`);
    // In a real implementation, this would remove event listeners
  }, []);

  // Mock functions for demo purposes
  const joinRoom = useCallback((roomId: string) => {
    emit('join-room', { roomId });
  }, [emit]);

  const searchForPartner = useCallback((preferences: any) => {
    emit('search-partner', preferences);
  }, [emit]);

  const sendMessage = useCallback((message: string, partnerId: string) => {
    const chatMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'me',
      message,
      timestamp: new Date(),
      type: 'text'
    };
    emit('chat-message', { message: chatMessage, partnerId });
    return chatMessage;
  }, [emit]);

  const reportUser = useCallback((userId: string, reason: string) => {
    emit('report-user', { userId, reason });
  }, [emit]);

  const endCall = useCallback(() => {
    emit('end-call');
  }, [emit]);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    error,
    connect,
    disconnect,
    emit,
    on,
    off,
    joinRoom,
    searchForPartner,
    sendMessage,
    reportUser,
    endCall
  };
};

export default useSocket;