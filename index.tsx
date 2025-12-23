
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Heart, Lock, Camera, Trash2, ShieldAlert, X, Link, Image as ImageIcon, Sparkles
} from 'lucide-react';

// Secret Codes
const SECRET_ENTER = "2010";
const SECRET_ADMIN = "1803";

const App = () => {
  const [isLocked, setIsLocked] = useState(localStorage.getItem('melody_unlocked') !== 'true');
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('melody_me');
    return saved ? JSON.parse(saved) : null;
  });
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('melody_posts');
    return saved ? JSON.parse(saved) : [];
  });

  const [passInput, setPassInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [imageInput, setImageInput] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const fileInputRef = useRef(null);

  // Save posts to browser memory
  useEffect(() => {
    localStorage.setItem('melody_posts', JSON.stringify(posts));
  }, [posts]);

  // Hide the loading heart when ready
  useEffect(() => {
    const loader = document.getElementById('loading-screen');
    if (loader) {
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
      }, 800);
    }
  }, []);

  const handleUnlock = () => {
    if (passInput === SECRET_ENTER) {
      localStorage.setItem('melody_unlocked', 'true');
      setIsLocked(false);
    } else {
      alert("Oops! Wrong code! 🍬 Hint: 2010");
    }
  };

  const handleRegister = () => {
    if (!nameInput.trim()) return;
    const newProfile = {
      name: nameInput,
      pfp: `https://api.dicebear.com/7.x/adventurer/svg?seed=${nameInput}`,
      isAdmin: false
    };
    localStorage.setItem('melody_me', JSON.stringify(newProfile));
    setProfile(newProfile);
  };

  const handlePost = () => {
    if (!textInput.trim() && !imageInput) return;
    const newPost = {
      id: Date.now().toString(),
      name: profile.name,
      pfp: profile.pfp,
      text: textInput,
      image: imageInput,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setPosts([newPost, ...posts]);
    setTextInput('');
    setImageInput(null);
  };

  const handleDelete = (id) => {
    if (confirm("Delete this secret? 🎀")) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  const handleAdmin = () => {
    const code = prompt("🎀 Enter Secret Admin Code 🎀");
    if (code === SECRET_ADMIN) {
      const updated = { ...profile, isAdmin: true };
      setProfile(updated);
      localStorage.setItem('melody_me', JSON.stringify(updated));
      alert("You are now a Secret Admin! 👑");
    }
  };

  // 1. Password Screen
  if (isLocked) {
    return (
      <div className="fixed inset-0 bg-[#fff5f7] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 melody-gradient rounded-full flex items-center justify-center mb-8 soft-3d-shadow border-4 border-white">
          <Lock className="text-white" size={36} />
        </div>
        <h1 className="text-4xl font-black text-pink-500 mb-2">My Melody Diary</h1>
        <p className="text-pink-300 mb-10 font-medium">Enter your secret key: ✨</p>
        <div className="bg-white p-8 rounded-[50px] soft-3d-shadow border-4 border-pink-100 w-full max-w-sm">
          <input
            type="password"
            placeholder="Code..."
            value={passInput}
            onChange={(e) => setPassInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
            className="w-full bg-pink-50 rounded-2xl p-4 text-center text-pink-700 font-bold mb-6 border-none outline-none focus:ring-2 focus:ring-pink-200"
          />
          <button onClick={handleUnlock} className="w-full melody-gradient text-white py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition-all">ENTER 🎀</button>
        </div>
      </div>
    );
  }

  // 2. Name Selection Screen
  if (!profile) {
    return (
      <div className="fixed inset-0 bg-[#fff5f7] flex items-center justify-center p-6">
        <div className="bg-white p-12 rounded-[60px] soft-3d-shadow border-4 border-pink-100 w-full max-w-md text-center">
          <h2 className="text-3xl font-black text-pink-500 mb-8 tracking-tight">What's your name? 🐰</h2>
          <input 
            value={nameInput} 
            onChange={e => setNameInput(e.target.value)} 
            placeholder="Your name..." 
            className="w-full bg-pink-50 rounded-2xl p-5 text-pink-700 font-bold mb-8 text-center border-none outline-none"
          />
          <button onClick={handleRegister} className="w-full melody-gradient text-white py-5 rounded-2xl font-black shadow-lg">START DIARY ✨</button>
        </div>
      </div>
    );
  }

  // 3. Main App Screen
  return (
    <div className="min-h-screen pb-24">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b-2 border-pink-50">
        <div className="flex items-center space-x-2">
          <Heart className="text-pink-400 fill-pink-400" size={24} />
          <h1 className="text-xl font-black text-pink-500">My Melody</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={handleAdmin} className={`p-2 rounded-full ${profile.isAdmin ? 'text-pink-600 bg-pink-100' : 'text-pink-200'}`}>
            <ShieldAlert size={24} />
          </button>
          <img 
            onClick={() => setShowProfile(true)} 
            src={profile.pfp} 
            className="w-12 h-12 rounded-full border-2 border-pink-200 cursor-pointer object-cover shadow-sm hover:scale-110 transition-transform" 
          />
        </div>
      </nav>

      <main className="container mx-auto max-w-lg px-4 mt-10 space-y-10">
        
        {/* Post Box */}
        <div className="bg-white p-8 rounded-[50px] soft-3d-shadow border-4 border-pink-100">
          <textarea 
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            placeholder="Write a sweet secret..."
            className="w-full bg-transparent border-none focus:ring-0 text-pink-600 font-medium placeholder-pink-200 resize-none text-lg"
            rows={3}
          />
          {imageInput && (
            <div className="relative mt-4">
              <img src={imageInput} className="w-full h-48 object-cover rounded-3xl border-4 border-pink-50" />
              <button onClick={() => setImageInput(null)} className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 text-pink-400"><X size={18}/></button>
            </div>
          )}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-pink-50">
            <label className="p-4 bg-pink-50 rounded-full text-pink-400 cursor-pointer hover:bg-pink-100 transition-colors">
              <Camera size={24} />
              <input type="file" className="hidden" accept="image/*" onChange={e => {
                const f = e.target.files?.[0];
                if (f) {
                  const r = new FileReader();
                  r.onloadend = () => setImageInput(r.result);
                  r.readAsDataURL(f);
                }
              }} />
            </label>
            <button onClick={handlePost} className="melody-gradient text-white px-10 py-3 rounded-full font-black shadow-md hover:scale-105 transition-all flex items-center space-x-2">
              <span>Post ✨</span>
            </button>
          </div>
        </div>

        {/* The Diary Feed */}
        <div className="space-y-8">
          {posts.map(p => (
            <div key={p.id} className="bg-white p-8 rounded-[55px] soft-3d-shadow border-2 border-pink-50 transition-all hover:translate-y-[-4px]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <img src={p.pfp} className="w-12 h-12 rounded-full border-2 border-pink-100 bg-pink-50" />
                  <div>
                    <h4 className="font-bold text-pink-700 text-lg">{p.name}</h4>
                    <span className="text-[10px] text-pink-200 font-bold uppercase tracking-wider">{p.date}</span>
                  </div>
                </div>
                {profile.isAdmin && (
                  <button onClick={() => handleDelete(p.id)} className="text-pink-100 hover:text-red-400 transition-colors">
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
              {p.image && <img src={p.image} className="w-full rounded-[40px] mb-6 border-8 border-pink-50 shadow-inner" />}
              <p className="text-pink-600 whitespace-pre-wrap leading-relaxed text-lg font-medium">{p.text}</p>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="text-center py-24 text-pink-200 italic">
              <Sparkles size={40} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">No secrets yet... write your first one! 🎀</p>
            </div>
          )}
        </div>
      </main>

      {/* Profile Sidebar */}
      {showProfile && (
        <div className="fixed inset-0 z-[100] bg-pink-100/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xs rounded-[60px] p-12 text-center soft-3d-shadow relative border-4 border-white">
            <button onClick={() => setShowProfile(false)} className="absolute top-8 right-8 text-pink-200"><X size={28} /></button>
            <img src={profile.pfp} className="w-28 h-28 rounded-full mx-auto mb-6 border-4 border-pink-100 shadow-sm" />
            <h2 className="text-2xl font-black text-pink-500 mb-2">{profile.name}</h2>
            {profile.isAdmin && <span className="bg-pink-100 text-pink-600 px-4 py-1 rounded-full text-[10px] font-black uppercase">Admin 👑</span>}
            <div className="mt-10 space-y-4">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link Copied! 🎀 Give it to your friends!");
                }}
                className="w-full bg-pink-50 text-pink-500 py-4 rounded-2xl font-bold flex items-center justify-center space-x-2"
              >
                <Link size={18} /> <span>Invite Besties</span>
              </button>
              <button onClick={() => setShowProfile(false)} className="w-full melody-gradient text-white py-4 rounded-2xl font-black shadow-md">Back to Diary</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
