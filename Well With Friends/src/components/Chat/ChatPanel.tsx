import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Smile, Image, Heart } from 'lucide-react';
import { ChatMessage, User } from '../../types';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  partner: User | null;
  onClose: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  partner,
  onClose
}) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const emojis = [
    '😊', '😂', '❤️', '👍', '👋', '🔥', '💯', '🎉',
    '😍', '🤔', '😎', '🙌', '👏', '🌟', '💪', '🤝'
  ];

  const quickMessages = [
    "Hello! 👋",
    "How are you?",
    "Where are you from?",
    "Nice to meet you!",
    "What are your hobbies?",
    "Have a great day!"
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      setShowEmojiPicker(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const addEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji);
    inputRef.current?.focus();
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  };

  return (
    <div className="w-80 bg-black/80 backdrop-blur-sm border-l border-white/20 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {partner?.name?.charAt(0) || '?'}
            </span>
          </div>
          <div>
            <h3 className="text-white font-medium">
              {partner?.name || 'Unknown'}
            </h3>
            <p className="text-white/60 text-xs">
              {partner?.country || 'Unknown location'}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <Heart size={48} className="mx-auto text-white/30 mb-4" />
            <p className="text-white/60">Start a conversation!</p>
            <p className="text-white/40 text-sm mt-2">
              Send a message to break the ice
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl ${
                  msg.senderId === 'me'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 text-white'
                } ${msg.type === 'system' ? 'bg-yellow-600/20 text-yellow-200 text-center w-full' : ''}`}
              >
                <p className="text-sm">{msg.message}</p>
                <p className={`text-xs mt-1 ${
                  msg.senderId === 'me' ? 'text-blue-200' : 'text-white/60'
                } ${msg.type === 'system' ? 'text-yellow-300' : ''}`}>
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Messages */}
      <div className="p-2 border-t border-white/10">
        <div className="flex flex-wrap gap-1">
          {quickMessages.slice(0, 3).map((quickMsg, index) => (
            <button
              key={index}
              onClick={() => onSendMessage(quickMsg)}
              className="text-xs bg-white/10 hover:bg-white/20 text-white/80 px-2 py-1 rounded-full transition-colors duration-200"
            >
              {quickMsg}
            </button>
          ))}
        </div>
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="p-4 bg-black/90 border-t border-white/20">
          <div className="grid grid-cols-8 gap-2">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => addEmoji(emoji)}
                className="text-lg hover:bg-white/20 rounded p-1 transition-colors duration-200"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-white/20">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
              maxLength={500}
            />
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
            >
              <Smile size={18} />
            </button>
          </div>
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-full transition-colors duration-200"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-white/40">
            {message.length}/500
          </span>
          <span className="text-xs text-white/40">
            Enter to send, Shift+Enter for new line
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;