import React, { useState, useEffect } from 'react';
import { Camera, Globe, Shield, Zap, Users, Heart, Star } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  activeUsers: number;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, activeUsers }) => {
  const [currentFeature, setCurrentFeature] = useState(0);
  
  const features = [
    { icon: Camera, title: "HD Video Chat", desc: "Crystal clear video quality" },
    { icon: Globe, title: "Global Connections", desc: "Meet people worldwide" },
    { icon: Shield, title: "Safe & Secure", desc: "Protected conversations" },
    { icon: Zap, title: "Instant Matching", desc: "Connect in seconds" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4">
      <div className="max-w-6xl mx-auto text-center">
        {/* Hero Section */}
        <div className="mb-16 animate-fadeIn">
          <div className="mb-8 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-6xl animate-bounce">
              👋
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight">
            Connect With
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-red-500 bg-clip-text text-transparent animate-pulse">
              Amazing People
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            Experience meaningful conversations through secure video chat. 
            Meet new friends from around the world in a safe, moderated environment.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12 text-white/90">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
              <Users className="mr-2 text-blue-400" size={20} />
              <span className="font-semibold">{activeUsers.toLocaleString()}</span>
              <span className="ml-1 text-sm">online now</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
              <Heart className="mr-2 text-red-400" size={20} />
              <span className="font-semibold">1M+</span>
              <span className="ml-1 text-sm">connections made</span>
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
              <Star className="mr-2 text-yellow-400" size={20} />
              <span className="font-semibold">4.8/5</span>
              <span className="ml-1 text-sm">user rating</span>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={onGetStarted}
            className="group relative inline-flex items-center justify-center px-12 py-4 text-xl font-bold text-white bg-gradient-to-r from-blue-600 to-red-600 rounded-full hover:from-blue-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
          >
            <Camera className="mr-3" size={24} />
            Start Video Chat
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-red-400 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10" />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 ${
                currentFeature === index ? 'ring-2 ring-blue-400' : ''
              }`}
            >
              <feature.icon 
                size={48} 
                className={`mx-auto mb-4 transition-colors duration-300 ${
                  currentFeature === index ? 'text-blue-400' : 'text-white/60 group-hover:text-white'
                }`} 
              />
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-white/60 group-hover:text-white/80 transition-colors duration-300">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Safety Notice */}
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl p-8 border border-green-400/20">
          <div className="flex items-center justify-center mb-4">
            <Shield className="text-green-400 mr-3" size={32} />
            <h3 className="text-2xl font-bold text-white">Your Safety Matters</h3>
          </div>
          <p className="text-white/80 text-lg leading-relaxed max-w-4xl mx-auto">
            Our platform includes advanced moderation, reporting tools, and AI-powered safety features 
            to ensure respectful conversations. We're committed to creating a positive environment for everyone.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;