import React, { useState, useEffect } from 'react';
import { Users, Globe, Clock, X } from 'lucide-react';

interface SearchingViewProps {
  onCancel: () => void;
  searchTime: number;
  estimatedWaitTime: number;
}

const SearchingView: React.FC<SearchingViewProps> = ({ 
  onCancel, 
  searchTime, 
  estimatedWaitTime 
}) => {
  const [currentTip, setCurrentTip] = useState(0);
  
  const tips = [
    "😊 A genuine smile makes the best first impression",
    "🌟 Be yourself - authenticity creates better connections",
    "🎯 Ask open-ended questions to keep conversations flowing",
    "📱 Ensure good lighting for the best video quality",
    "🔊 Check that your microphone is working clearly",
    "🌍 Be respectful of cultural differences",
    "💬 Share your interests to find common ground",
    "⏰ Take breaks if you feel overwhelmed"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [tips.length]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-12 border border-white/10">
          {/* Animated Search Indicator */}
          <div className="relative w-48 h-48 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
            <div className="absolute inset-4 rounded-full border-4 border-blue-400/40 animate-ping" />
            <div className="absolute inset-8 rounded-full border-4 border-blue-300/60 animate-pulse" />
            <div className="absolute inset-12 rounded-full border-4 border-blue-200/80 animate-bounce" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-6 animate-pulse">
                <Users size={48} className="text-white" />
              </div>
            </div>
            
            {/* Orbiting Elements */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 animate-spin origin-center" style={{ animationDuration: '3s' }}>
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-spin origin-center" style={{ animationDuration: '4s', animationDirection: 'reverse' }}>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            </div>
          </div>

          {/* Status Text */}
          <h2 className="text-3xl font-bold text-white mb-4">
            Finding Your Perfect Match...
          </h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center space-x-6 text-white/80">
              <div className="flex items-center">
                <Clock size={20} className="mr-2" />
                <span>Searching: {formatTime(searchTime)}</span>
              </div>
              <div className="flex items-center">
                <Globe size={20} className="mr-2" />
                <span>Est. wait: ~{estimatedWaitTime}s</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/10 rounded-full h-2 mb-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                style={{ 
                  width: `${Math.min((searchTime / estimatedWaitTime) * 100, 95)}%` 
                }}
              />
            </div>
          </div>

          {/* Tips Carousel */}
          <div className="bg-white/10 rounded-2xl p-6 mb-8 min-h-[80px] flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">💡 Chat Tip</h3>
              <p 
                className="text-white/90 text-lg transition-all duration-500 animate-fadeIn"
                key={currentTip}
              >
                {tips[currentTip]}
              </p>
            </div>
          </div>

          {/* Connection Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8 text-center">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-400">98%</div>
              <div className="text-white/60 text-sm">Success Rate</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-400">~12s</div>
              <div className="text-white/60 text-sm">Avg. Wait</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-2xl font-bold text-purple-400">24/7</div>
              <div className="text-white/60 text-sm">Available</div>
            </div>
          </div>

          {/* Cancel Button */}
          <button
            onClick={onCancel}
            className="group flex items-center justify-center px-6 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 border border-red-500/30 rounded-full transition-all duration-200 mx-auto"
          >
            <X size={20} className="mr-2" />
            Cancel Search
          </button>

          {/* Reassurance Message */}
          <p className="text-white/50 text-sm mt-6">
            We're scanning thousands of users worldwide to find someone perfect for you.
            <br />
            Quality matches take a moment - it's worth the wait! ✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchingView;