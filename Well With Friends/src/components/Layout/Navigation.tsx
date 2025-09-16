import React from 'react';
import { Users, Settings, Shield, Activity } from 'lucide-react';

interface NavigationProps {
  activeUsers: number;
  onAdminClick: () => void;
  onSettingsClick: () => void;
  onStatsClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  activeUsers,
  onAdminClick,
  onSettingsClick,
  onStatsClick
}) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Well With Friends
            </div>
            <div className="ml-4 flex items-center text-sm text-white/60">
              <Users size={16} className="mr-1" />
              <span>{activeUsers.toLocaleString()} online</span>
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onStatsClick}
              className="flex items-center px-3 py-2 text-white/70 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-lg"
              aria-label="View Statistics"
            >
              <Activity size={18} className="mr-2" />
              <span className="hidden sm:inline">Stats</span>
            </button>
            
            <button
              onClick={onSettingsClick}
              className="flex items-center px-3 py-2 text-white/70 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-lg"
              aria-label="Settings"
            >
              <Settings size={18} className="mr-2" />
              <span className="hidden sm:inline">Settings</span>
            </button>
            
            <button
              onClick={onAdminClick}
              className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium"
              aria-label="Admin Panel"
            >
              <Shield size={18} className="mr-2" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;