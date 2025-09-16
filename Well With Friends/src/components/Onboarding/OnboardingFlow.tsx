import React, { useState } from 'react';
import { Camera, User, Globe, Heart, ArrowRight, ArrowLeft } from 'lucide-react';
import { User as UserType, MatchPreferences } from '../../types';

interface OnboardingFlowProps {
  onComplete: (userData: Partial<UserType>, preferences: MatchPreferences) => void;
  onBack: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<Partial<UserType>>({
    name: '',
    age: 18,
    gender: 'other',
    country: '',
    interests: [],
    language: 'en'
  });
  const [preferences, setPreferences] = useState<MatchPreferences>({
    ageRange: [18, 65],
    country: 'any',
    interests: [],
    gender: 'any'
  });
  const [hasCamera, setHasCamera] = useState(false);

  const countries = [
    'USA', 'Canada', 'UK', 'Germany', 'France', 'Spain', 'Italy', 'India', 
    'Japan', 'Australia', 'Brazil', 'Mexico', 'South Korea', 'Netherlands'
  ];

  const interests = [
    'Movies', 'Music', 'Travel', 'Sports', 'Gaming', 'Books', 'Art', 'Technology',
    'Cooking', 'Photography', 'Dancing', 'Languages', 'Fashion', 'Science',
    'Nature', 'Fitness', 'History', 'Comedy', 'Education', 'Business'
  ];

  const languages = [
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
  ];

  const requestCamera = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setHasCamera(true);
      setStep(2);
    } catch (error) {
      alert('Camera access is required to use video chat. Please allow access and try again.');
    }
  };

  const toggleInterest = (interest: string, isPreference = false) => {
    if (isPreference) {
      setPreferences(prev => ({
        ...prev,
        interests: prev.interests.includes(interest)
          ? prev.interests.filter(i => i !== interest)
          : [...prev.interests, interest]
      }));
    } else {
      setUserData(prev => ({
        ...prev,
        interests: prev.interests?.includes(interest)
          ? prev.interests.filter(i => i !== interest)
          : [...(prev.interests || []), interest]
      }));
    }
  };

  const handleComplete = () => {
    if (userData.name && userData.country && userData.interests?.length) {
      onComplete(userData, preferences);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center animate-fadeIn">
            <Camera size={80} className="mx-auto mb-6 text-blue-400" />
            <h2 className="text-3xl font-bold text-white mb-4">Camera Access Required</h2>
            <p className="text-white/80 text-lg mb-8 max-w-md mx-auto">
              To ensure the best video chat experience, we need access to your camera and microphone.
            </p>
            <div className="space-y-4">
              <button
                onClick={requestCamera}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-full transition-colors duration-200"
              >
                Enable Camera & Microphone
              </button>
              <p className="text-white/60 text-sm">
                Your privacy is protected. Video is never recorded or stored.
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="animate-fadeIn">
            <div className="text-center mb-8">
              <User size={60} className="mx-auto mb-4 text-green-400" />
              <h2 className="text-3xl font-bold text-white mb-2">Tell Us About Yourself</h2>
              <p className="text-white/80">This helps us find better matches for you</p>
            </div>
            
            <div className="space-y-6 max-w-md mx-auto">
              <div>
                <label className="block text-white/80 mb-2 font-medium">Name</label>
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your first name"
                  maxLength={20}
                />
              </div>

              <div>
                <label className="block text-white/80 mb-2 font-medium">Age</label>
                <input
                  type="number"
                  min="13"
                  max="100"
                  value={userData.age}
                  onChange={(e) => setUserData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-white/80 mb-2 font-medium">Gender</label>
                <div className="grid grid-cols-3 gap-2">
                  {['male', 'female', 'other'].map((gender) => (
                    <button
                      key={gender}
                      onClick={() => setUserData(prev => ({ ...prev, gender: gender as any }))}
                      className={`py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                        userData.gender === gender
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/80 mb-2 font-medium">Country</label>
                <select
                  value={userData.country}
                  onChange={(e) => setUserData(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select your country</option>
                  {countries.map((country) => (
                    <option key={country} value={country} className="bg-slate-800">
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/80 mb-2 font-medium">Language</label>
                <select
                  value={userData.language}
                  onChange={(e) => setUserData(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-slate-800">
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="animate-fadeIn">
            <div className="text-center mb-8">
              <Heart size={60} className="mx-auto mb-4 text-red-400" />
              <h2 className="text-3xl font-bold text-white mb-2">Your Interests</h2>
              <p className="text-white/80">Select topics you'd like to talk about</p>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {interests.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`py-2 px-4 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                      userData.interests?.includes(interest)
                        ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
              <p className="text-center text-white/60 text-sm">
                Selected {userData.interests?.length || 0} interests (recommended: 3-8)
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="animate-fadeIn">
            <div className="text-center mb-8">
              <Globe size={60} className="mx-auto mb-4 text-purple-400" />
              <h2 className="text-3xl font-bold text-white mb-2">Matching Preferences</h2>
              <p className="text-white/80">Who would you like to meet?</p>
            </div>
            
            <div className="max-w-md mx-auto space-y-6">
              <div>
                <label className="block text-white/80 mb-2 font-medium">Preferred Gender</label>
                <div className="grid grid-cols-2 gap-2">
                  {['any', 'male', 'female'].map((gender) => (
                    <button
                      key={gender}
                      onClick={() => setPreferences(prev => ({ ...prev, gender: gender as any }))}
                      className={`py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                        preferences.gender === gender
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      {gender === 'any' ? 'Any' : gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/80 mb-2 font-medium">
                  Age Range: {preferences.ageRange[0]} - {preferences.ageRange[1]}
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="13"
                    max="100"
                    value={preferences.ageRange[0]}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      ageRange: [parseInt(e.target.value), prev.ageRange[1]]
                    }))}
                    className="w-full accent-purple-600"
                  />
                  <input
                    type="range"
                    min="13"
                    max="100"
                    value={preferences.ageRange[1]}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      ageRange: [prev.ageRange[0], parseInt(e.target.value)]
                    }))}
                    className="w-full accent-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 mb-2 font-medium">Preferred Country</label>
                <select
                  value={preferences.country}
                  onChange={(e) => setPreferences(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="any" className="bg-slate-800">Any Country</option>
                  {countries.map((country) => (
                    <option key={country} value={country} className="bg-slate-800">
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/60 text-sm">Step {step} of 4</span>
              <span className="text-white/60 text-sm">{Math.round((step / 4) * 100)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>

          {renderStep()}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={step === 1 ? onBack : () => setStep(step - 1)}
              className="flex items-center px-4 py-2 text-white/60 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back
            </button>

            {step < 4 && step > 1 && (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!userData.name || !userData.country}
                className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-full transition-colors duration-200"
              >
                Next
                <ArrowRight size={20} className="ml-2" />
              </button>
            )}

            {step === 4 && (
              <button
                onClick={handleComplete}
                className="flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors duration-200"
              >
                Complete Setup
                <ArrowRight size={20} className="ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;