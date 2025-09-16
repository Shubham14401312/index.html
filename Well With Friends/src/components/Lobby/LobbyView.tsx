import React, { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff, Mic, MicOff, Settings, Users, Play, Pause } from 'lucide-react';
import { User, MatchPreferences } from '../../types';

interface LobbyViewProps {
  user: User;
  preferences: MatchPreferences;
  localStream: MediaStream | null;
  onStartSearch: () => void;
  onUpdatePreferences: (prefs: MatchPreferences) => void;
  activeUsers: number;
}

const LobbyView: React.FC<LobbyViewProps> = ({
  user,
  preferences,
  localStream,
  onStartSearch,
  onUpdatePreferences,
  activeUsers
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
      setIsReady(true);
    }
  }, [localStream]);

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  return (
    <div className="min-h-screen pt-16 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">Camera Preview</h2>
              
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden mb-4">
                {isReady ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform scale-x-[-1]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-white/60 text-center">
                      <Camera size={48} className="mx-auto mb-4" />
                      <p>Setting up camera...</p>
                    </div>
                  </div>
                )}
                
                {!isVideoEnabled && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                    <CameraOff size={48} className="text-white/60" />
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex justify-center space-x-4 mb-6">
                <button
                  onClick={toggleVideo}
                  className={`p-3 rounded-full transition-colors duration-200 ${
                    isVideoEnabled 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  } text-white`}
                  aria-label={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
                >
                  {isVideoEnabled ? <Camera size={24} /> : <CameraOff size={24} />}
                </button>
                
                <button
                  onClick={toggleAudio}
                  className={`p-3 rounded-full transition-colors duration-200 ${
                    isAudioEnabled 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  } text-white`}
                  aria-label={isAudioEnabled ? 'Turn off microphone' : 'Turn on microphone'}
                >
                  {isAudioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
                </button>

                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-3 rounded-full bg-gray-600 hover:bg-gray-700 text-white transition-colors duration-200"
                  aria-label="Settings"
                >
                  <Settings size={24} />
                </button>
              </div>

              {/* Start Button */}
              <div className="text-center">
                <button
                  onClick={onStartSearch}
                  disabled={!isReady}
                  className="group relative inline-flex items-center justify-center px-12 py-4 text-xl font-bold text-white bg-gradient-to-r from-blue-600 to-red-600 rounded-full hover:from-blue-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Play size={24} className="mr-3" />
                  Start Connecting
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-red-400 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 -z-10" />
                </button>
                
                <p className="text-white/60 text-sm mt-4">
                  {activeUsers.toLocaleString()} people are online and ready to chat
                </p>
              </div>
            </div>
          </div>

          {/* Profile & Preferences */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Your Profile</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/60">Name:</span>
                  <span className="text-white font-medium">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Age:</span>
                  <span className="text-white font-medium">{user.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Country:</span>
                  <span className="text-white font-medium">{user.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Gender:</span>
                  <span className="text-white font-medium capitalize">{user.gender}</span>
                </div>
                <div>
                  <span className="text-white/60 block mb-2">Interests:</span>
                  <div className="flex flex-wrap gap-2">
                    {user.interests.slice(0, 4).map((interest) => (
                      <span
                        key={interest}
                        className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                    {user.interests.length > 4 && (
                      <span className="px-2 py-1 bg-gray-600/20 text-gray-300 text-xs rounded-full">
                        +{user.interests.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Stats */}
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Users size={20} className="mr-2" />
                Live Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Online Now:</span>
                  <span className="text-green-400 font-bold text-lg">
                    {activeUsers.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Active Conversations:</span>
                  <span className="text-blue-400 font-medium">
                    {Math.floor(activeUsers * 0.6).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Avg Wait Time:</span>
                  <span className="text-yellow-400 font-medium">~8 seconds</span>
                </div>
              </div>
            </div>

            {/* Quick Settings */}
            {showSettings && (
              <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/10 animate-fadeIn">
                <h3 className="text-xl font-bold text-white mb-4">Quick Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 mb-2 text-sm">Preferred Gender</label>
                    <select
                      value={preferences.gender}
                      onChange={(e) => onUpdatePreferences({
                        ...preferences,
                        gender: e.target.value as any
                      })}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="any" className="bg-slate-800">Any</option>
                      <option value="male" className="bg-slate-800">Male</option>
                      <option value="female" className="bg-slate-800">Female</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white/80 mb-2 text-sm">
                      Age Range: {preferences.ageRange[0]} - {preferences.ageRange[1]}
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="13"
                        max="100"
                        value={preferences.ageRange[0]}
                        onChange={(e) => onUpdatePreferences({
                          ...preferences,
                          ageRange: [parseInt(e.target.value), preferences.ageRange[1]]
                        })}
                        className="w-full accent-blue-500"
                      />
                      <input
                        type="range"
                        min="13"
                        max="100"
                        value={preferences.ageRange[1]}
                        onChange={(e) => onUpdatePreferences({
                          ...preferences,
                          ageRange: [preferences.ageRange[0], parseInt(e.target.value)]
                        })}
                        className="w-full accent-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LobbyView;