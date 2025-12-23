
import React, { useState, useEffect } from 'react';
import { Heart, Lock, Sparkles } from 'lucide-react';

interface AccessWallProps {
  onAuthorized: () => void;
  secretKey: string;
}

export const AccessWall: React.FC<AccessWallProps> = ({ onAuthorized, secretKey }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const checkAccess = (val: string) => {
    if (val.trim().toLowerCase() === secretKey.toLowerCase()) {
      localStorage.setItem('melody_access_granted', 'true');
      onAuthorized();
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
    }
  };

  useEffect(() => {
    // Check URL for ?key=...
    const params = new URLSearchParams(window.location.search);
    const urlKey = params.get('key');
    if (urlKey && urlKey.toLowerCase() === secretKey.toLowerCase()) {
      checkAccess(urlKey);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-[200] bg-[#fff5f7] flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <Heart 
            key={i} 
            className="absolute text-pink-200 opacity-50 sticker-float" 
            style={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              width: `${20 + Math.random() * 40}px`
            }} 
          />
        ))}
      </div>

      <div className="relative z-10 space-y-8 animate-in zoom-in-95 duration-500">
        <div className="w-32 h-32 melody-gradient rounded-full flex items-center justify-center soft-3d-shadow mx-auto mb-4 border-4 border-white">
          <Lock className="text-white" size={48} />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-pink-500 tracking-tight">Secret Melody Diary</h1>
          <p className="text-pink-300 font-medium italic">This is a private world for besties only! ✨</p>
        </div>

        <div className={`relative max-w-sm mx-auto transition-transform ${error ? 'animate-bounce' : ''}`}>
          <div className="bg-white p-6 rounded-[40px] soft-3d-shadow border-4 border-pink-100 flex flex-col items-center space-y-4">
            <input
              type="password"
              placeholder="Enter Secret Code..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && checkAccess(input)}
              className="w-full bg-pink-50 border-none rounded-2xl p-4 text-center text-pink-700 font-bold focus:ring-4 focus:ring-pink-100 placeholder-pink-200"
            />
            <button 
              onClick={() => checkAccess(input)}
              className="w-full melody-gradient text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles size={20} />
              <span>Enter Wonderland</span>
            </button>
          </div>
          {error && <p className="absolute -bottom-8 left-0 right-0 text-red-400 text-sm font-bold">Wrong secret code! 🎀 Try again!</p>}
        </div>
      </div>
    </div>
  );
};
