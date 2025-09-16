import React, { useRef, useEffect, useState } from 'react';
import { 
  Camera, CameraOff, Mic, MicOff, Phone, SkipForward, 
  Flag, Settings, MessageSquare, MoreVertical, Maximize
} from 'lucide-react';
import { User, ChatMessage } from '../../types';
import ChatPanel from './ChatPanel';

interface VideoChatProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  partner: User | null;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onEndCall: () => void;
  onNextPartner: () => void;
  onReport: (reason: string) => void;
  callDuration: number;
}

const VideoChat: React.FC<VideoChatProps> = ({
  localStream,
  remoteStream,
  partner,
  messages,
  onSendMessage,
  onEndCall,
  onNextPartner,
  onReport,
  callDuration
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'fair' | 'poor'>('good');

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

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

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-blue-400';
      case 'fair': return 'text-yellow-400';
      case 'poor': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const reportReasons = [
    'Inappropriate behavior',
    'Spam or advertising',
    'Harassment',
    'Fake profile',
    'Technical issues',
    'Other'
  ];

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen pt-16'} bg-black`}>
      <div className="relative h-full flex">
        {/* Main Video Area */}
        <div className={`flex-1 relative ${showChat ? 'mr-80' : ''} transition-all duration-300`}>
          {/* Remote Video */}
          <div className="absolute inset-0">
            {remoteStream ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <span className="text-4xl">{partner?.name?.charAt(0) || '?'}</span>
                  </div>
                  <p className="text-white text-lg">
                    {partner ? `Connecting to ${partner.name}...` : 'Waiting for partner...'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Local Video (Picture-in-Picture) */}
          <div className="absolute bottom-4 right-4 w-48 h-36 bg-black rounded-lg overflow-hidden border-2 border-white/20 shadow-lg">
            {isVideoEnabled && localStream ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <CameraOff size={32} className="text-gray-400" />
              </div>
            )}
          </div>

          {/* Top Info Bar */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            <div className="bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-4">
              {partner && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {partner.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{partner.name}</p>
                    <p className="text-white/60 text-xs">{partner.country}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-white text-sm">{formatDuration(callDuration)}</span>
              </div>
              <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                <span className={`text-sm ${getQualityColor(connectionQuality)}`}>
                  ● {connectionQuality}
                </span>
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-black/70 backdrop-blur-sm rounded-full px-6 py-4 flex items-center space-x-4">
              <button
                onClick={toggleVideo}
                className={`p-3 rounded-full transition-colors duration-200 ${
                  isVideoEnabled 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
                aria-label={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
              >
                {isVideoEnabled ? <Camera size={20} /> : <CameraOff size={20} />}
              </button>

              <button
                onClick={toggleAudio}
                className={`p-3 rounded-full transition-colors duration-200 ${
                  isAudioEnabled 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
                aria-label={isAudioEnabled ? 'Turn off microphone' : 'Turn on microphone'}
              >
                {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
              </button>

              <button
                onClick={() => setShowChat(!showChat)}
                className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors duration-200"
                aria-label="Toggle chat"
              >
                <MessageSquare size={20} />
              </button>

              <button
                onClick={onNextPartner}
                className="p-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-full transition-colors duration-200"
                aria-label="Next partner"
              >
                <SkipForward size={20} />
              </button>

              <button
                onClick={onEndCall}
                className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors duration-200"
                aria-label="End call"
              >
                <Phone size={20} />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-colors duration-200"
                  aria-label="More options"
                >
                  <MoreVertical size={20} />
                </button>

                {showSettings && (
                  <div className="absolute bottom-full mb-2 right-0 bg-black/90 backdrop-blur-sm rounded-lg min-w-48 py-2 border border-white/20">
                    <button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="w-full px-4 py-2 text-white hover:bg-white/10 flex items-center"
                    >
                      <Maximize size={16} className="mr-3" />
                      {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                    </button>
                    <div className="border-t border-white/20 my-2" />
                    <div className="px-4 py-2 text-white/60 text-sm">Report User</div>
                    {reportReasons.map((reason) => (
                      <button
                        key={reason}
                        onClick={() => {
                          onReport(reason);
                          setShowSettings(false);
                        }}
                        className="w-full px-4 py-2 text-red-400 hover:bg-red-500/10 text-sm flex items-center"
                      >
                        <Flag size={14} className="mr-3" />
                        {reason}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        {showChat && (
          <ChatPanel
            messages={messages}
            onSendMessage={onSendMessage}
            partner={partner}
            onClose={() => setShowChat(false)}
          />
        )}
      </div>
    </div>
  );
};

export default VideoChat;