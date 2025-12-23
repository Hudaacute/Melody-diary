
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Save, X, Camera, Link, Check } from 'lucide-react';

interface ProfileModalProps {
  profile: UserProfile;
  onSave: (updates: Partial<UserProfile>) => void;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ profile, onSave, onClose }) => {
  const [username, setUsername] = useState(profile.username);
  const [pfp, setPfp] = useState(profile.pfp);
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    onSave({ username, pfp });
    onClose();
  };

  const copyInviteLink = () => {
    // Generates a link like: https://yourapp.com/?key=2010
    const inviteUrl = `${window.location.origin}${window.location.pathname}?key=2010`;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-pink-100/50 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[50px] p-8 soft-3d-shadow border-4 border-white flex flex-col items-center space-y-6">
        <div className="relative group cursor-pointer" onClick={() => {
          const url = prompt("Enter a cute profile pic URL:", pfp);
          if (url) setPfp(url);
        }}>
          <img src={pfp} className="w-32 h-32 rounded-full border-4 border-pink-200 object-cover shadow-lg" />
          <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="text-white" />
          </div>
        </div>

        <div className="w-full space-y-4">
          <div>
            <label className="text-xs font-bold text-pink-300 uppercase ml-4">Sweet Name</label>
            <input 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-pink-50 border-none rounded-2xl p-4 text-pink-700 font-bold focus:ring-4 focus:ring-pink-100"
            />
          </div>
          
          <div className="pt-2">
            <button 
              onClick={copyInviteLink}
              className={`w-full flex items-center justify-center space-x-2 p-4 rounded-2xl border-2 border-dashed transition-all ${copied ? 'border-green-300 bg-green-50 text-green-600' : 'border-pink-200 bg-pink-50 text-pink-500 hover:bg-pink-100'}`}
            >
              {copied ? <Check size={18} /> : <Link size={18} />}
              <span className="text-sm font-bold">{copied ? 'Invite Link Copied!' : 'Copy Private Invite Link'}</span>
            </button>
            <p className="text-[10px] text-pink-300 text-center mt-2 italic">Share this link with friends to give them access! 🎀</p>
          </div>
        </div>

        <div className="flex w-full gap-3 mt-4">
          <button onClick={onClose} className="flex-1 py-4 bg-gray-50 text-gray-400 font-bold rounded-2xl hover:bg-gray-100 transition-all flex items-center justify-center space-x-2">
            <X size={18} /> <span>Cancel</span>
          </button>
          <button onClick={handleSave} className="flex-2 melody-gradient text-white py-4 px-8 font-bold rounded-2xl hover:scale-105 transition-all flex items-center justify-center space-x-2 shadow-lg">
            <Save size={18} /> <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
