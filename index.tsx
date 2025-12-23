
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Heart, Lock, Globe, Camera, Trash2, ShieldAlert, X, Link, Image as ImageIcon, 
  Sparkles, Send, Smile, Users, UserPlus, MessageCircle, Check, Star, Ribbon, Users2, ArrowLeft
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// Secret Codes
const PRIVATE_SECRET_KEY = "2010";
const ADMIN_CODE = "1803";

const STICKERS = [
  { type: 'heart', icon: <Heart size={16} fill="currentColor" />, color: 'text-pink-400' },
  { type: 'star', icon: <Star size={16} fill="currentColor" />, color: 'text-yellow-400' },
  { type: 'ribbon', icon: <Ribbon size={16} />, color: 'text-pink-300' },
  { type: 'melody', icon: <Smile size={16} />, color: 'text-pink-500' },
];

const App = () => {
  // --- STATE ---
  const [isAuthorized, setIsAuthorized] = useState(localStorage.getItem('melody_access') === 'true');
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('melody_profile');
    return saved ? JSON.parse(saved) : null;
  });
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('melody_entries');
    return saved ? JSON.parse(saved) : [];
  });
  const [messages, setMessages] = useState([]);
  // Fixed: explicitly typed the state to allow adding groups with string IDs.
  const [groups, setGroups] = useState<{ id: string; name: string; members: any[] }[]>([{ id: 'g1', name: 'Besties Club 🌸', members: [] }]);
  
  // UI State
  const [activeTab, setActiveTab] = useState('friends');
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [imageInput, setImageInput] = useState(null);
  const [visibility, setVisibility] = useState('private');
  const [activeDecorations, setActiveDecorations] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
  const [msgInput, setMsgInput] = useState('');

  // --- STORAGE ---
  useEffect(() => {
    localStorage.setItem('melody_entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    const loader = document.getElementById('loading-screen');
    if (loader) {
      setTimeout(() => {
        (loader as HTMLElement).style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
      }, 800);
    }
  }, []);

  // --- HANDLERS ---
  const handleAuth = (val) => {
    if (val === PRIVATE_SECRET_KEY) {
      localStorage.setItem('melody_access', 'true');
      setIsAuthorized(true);
    } else alert("Wrong code! 🍬");
  };

  const handleRegister = (name, pfp) => {
    const newProfile = { id: Date.now().toString(), username: name, pfp, isAdmin: false, friends: [], pending: ['MelodyFan'] };
    setProfile(newProfile);
    localStorage.setItem('melody_profile', JSON.stringify(newProfile));
  };

  const handlePost = () => {
    if (!textInput.trim() && !imageInput) return;
    const newEntry = {
      id: Date.now().toString(),
      userName: profile.username,
      userPfp: profile.pfp,
      text: textInput,
      image: imageInput,
      visibility,
      decorations: activeDecorations,
      timestamp: Date.now(),
      likes: []
    };
    setEntries([newEntry, ...entries]);
    setTextInput('');
    setImageInput(null);
    setActiveDecorations([]);
    setShowStickers(false);
  };

  const handleKawaiiMagic = async () => {
    if (!textInput.trim()) return;
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Rewrite this diary entry to be kawaii and cute with emojis: "${textInput}"`,
      });
      if (response.text) setTextInput(response.text.trim());
    } catch (err) { console.error(err); }
    finally { setIsAiLoading(false); }
  };

  const addSticker = (type) => {
    setActiveDecorations([...activeDecorations, { id: Math.random(), type, x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 }]);
  };

  const handleSendMessage = () => {
    if (!msgInput.trim() || !selectedGroupId) return;
    const newMsg = { id: Date.now(), userId: profile.id, userName: profile.username, text: msgInput, groupId: selectedGroupId };
    setMessages([...messages, newMsg]);
    setMsgInput('');
  };

  // --- SCREENS ---

  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 bg-[#fff5f7] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 melody-gradient rounded-full flex items-center justify-center mb-8 soft-3d-shadow animate-bounce"><Lock className="text-white" size={32}/></div>
        <h1 className="text-4xl font-black text-pink-500 mb-6 tracking-tight">Secret Access</h1>
        <div className="bg-white p-8 rounded-[40px] soft-3d-shadow border-4 border-pink-100 w-full max-w-sm">
          {/* Fix: cast e.target as HTMLInputElement to access .value */}
          <input type="password" placeholder="Secret Key..." onKeyDown={(e) => e.key === 'Enter' && handleAuth((e.target as HTMLInputElement).value)} className="w-full bg-pink-50 rounded-2xl p-4 text-center text-pink-700 font-bold mb-6 border-none outline-none"/>
          {/* Fix: cast document.querySelector result as HTMLInputElement to access .value */}
          <button onClick={() => handleAuth((document.querySelector('input[type="password"]') as HTMLInputElement)?.value)} className="w-full melody-gradient text-white py-4 rounded-2xl font-black shadow-lg">Enter Wonderland 🎀</button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="fixed inset-0 bg-[#fff5f7] flex items-center justify-center p-6">
        <div className="bg-white p-12 rounded-[50px] soft-3d-shadow border-4 border-pink-100 w-full max-w-md text-center">
          <div className="relative w-32 h-32 mx-auto mb-8 cursor-pointer group">
            <div className="w-full h-full bg-pink-50 rounded-full flex items-center justify-center border-4 border-white overflow-hidden shadow-inner">
              <img id="reg-pfp" src="https://api.dicebear.com/7.x/adventurer/svg?seed=pink" className="w-full h-full object-cover" />
            </div>
            <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md text-pink-500 border-2 border-pink-100 cursor-pointer">
              <Camera size={20} />
              <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  const r = new FileReader();
                  // Fix: cast document.getElementById result as HTMLImageElement to access .src
                  r.onload = (ev) => (document.getElementById('reg-pfp') as HTMLImageElement).src = (ev.target as FileReader).result as string;
                  r.readAsDataURL(f);
                }
              }} />
            </label>
          </div>
          <h2 className="text-3xl font-black text-pink-500 mb-4">Who are you? 🐰</h2>
          <input id="reg-name" placeholder="Name..." className="w-full bg-pink-50 rounded-2xl p-5 text-pink-700 font-bold mb-8 text-center border-none outline-none focus:ring-4 focus:ring-pink-100" />
          {/* Fix: cast document.getElementById results to access .value and .src */}
          <button onClick={() => handleRegister((document.getElementById('reg-name') as HTMLInputElement).value, (document.getElementById('reg-pfp') as HTMLImageElement).src)} className="w-full melody-gradient text-white py-5 rounded-2xl font-black shadow-lg">Create Profile ✨</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff5f7]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg px-6 py-4 flex items-center justify-between border-b-2 border-pink-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 melody-gradient rounded-full flex items-center justify-center"><Heart className="text-white fill-white" size={16} /></div>
          <h1 className="text-xl font-black text-pink-500 tracking-tighter uppercase italic">Melody World</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => { const c = prompt("Code?"); if(c === ADMIN_CODE) setProfile({...profile, isAdmin: true}) }} className={`p-2 rounded-full ${profile.isAdmin ? 'text-pink-600' : 'text-pink-200'}`}><ShieldAlert size={24} /></button>
          <img src={profile.pfp} className="w-10 h-10 rounded-full border-2 border-pink-200 shadow-sm" />
        </div>
      </nav>

      <div className="container mx-auto px-4 mt-8 flex flex-col lg:flex-row gap-8">
        {/* Main Feed */}
        <div className="flex-1 space-y-10">
          {/* Editor */}
          <div className="bg-white p-8 rounded-[50px] soft-3d-shadow border-4 border-pink-100 relative overflow-hidden">
            <textarea value={textInput} onChange={e => setTextInput(e.target.value)} placeholder="Type a sweet secret..." className="w-full bg-transparent border-none focus:ring-0 text-pink-600 font-semibold text-xl" rows={3}/>
            
            {/* Live Decorations */}
            <div className="relative h-0">
               {activeDecorations.map(d => (
                 <div key={d.id} className="absolute pointer-events-none opacity-40 animate-pulse" style={{left: `${d.x}%`, top: `-${Math.abs(d.y)}px`}}>
                   {d.type === 'heart' && <Heart fill="#ffb7c5" className="text-pink-200" size={30}/>}
                   {d.type === 'star' && <Star fill="#fff1b8" className="text-yellow-200" size={30}/>}
                   {d.type === 'ribbon' && <span className="text-2xl">🎀</span>}
                 </div>
               ))}
            </div>

            {imageInput && <img src={imageInput} className="w-full h-48 object-cover rounded-3xl mt-4 border-4 border-pink-50" />}
            
            <div className="flex flex-wrap items-center justify-between mt-6 pt-4 border-t border-pink-50 gap-4">
              <div className="flex space-x-2">
                <label className="p-3 bg-pink-50 rounded-full text-pink-400 cursor-pointer"><Camera size={20} /><input type="file" className="hidden" accept="image/*" onChange={e => {
                  const r = new FileReader(); r.onload = ev => setImageInput((ev.target as FileReader).result as string); r.readAsDataURL(e.target.files![0]);
                }} /></label>
                <button onClick={() => setShowStickers(!showStickers)} className={`p-3 rounded-full ${showStickers ? 'bg-pink-500 text-white' : 'bg-pink-50 text-pink-400'}`}><Smile size={20} /></button>
                <button onClick={handleKawaiiMagic} className={`p-3 bg-pink-50 rounded-full text-pink-400 ${isAiLoading ? 'animate-spin' : ''}`}><Sparkles size={20} /></button>
                <div className="bg-pink-50 rounded-full flex p-1">
                   <button onClick={() => setVisibility('private')} className={`p-2 rounded-full ${visibility === 'private' ? 'bg-white text-pink-500 shadow-sm' : 'text-pink-300'}`}><Lock size={16}/></button>
                   <button onClick={() => setVisibility('public')} className={`p-2 rounded-full ${visibility === 'public' ? 'bg-white text-pink-500 shadow-sm' : 'text-pink-300'}`}><Globe size={16}/></button>
                </div>
              </div>
              <button onClick={handlePost} className="melody-gradient text-white px-8 py-3 rounded-full font-black shadow-md flex items-center gap-2">Post <Send size={16}/></button>
            </div>

            {showStickers && (
              <div className="flex gap-4 p-4 mt-4 bg-pink-50 rounded-3xl animate-in slide-in-from-top-2">
                {STICKERS.map(s => <button key={s.type} onClick={() => addSticker(s.type)} className={`${s.color} hover:scale-125 transition-transform`}>{s.icon}</button>)}
                <button onClick={() => setActiveDecorations([])} className="text-[10px] font-bold text-pink-300 uppercase">Clear</button>
              </div>
            )}
          </div>

          {/* Feed */}
          <div className="space-y-8 pb-20">
            {entries.map(e => (
              <div key={e.id} className="bg-white p-8 rounded-[55px] soft-3d-shadow border-2 border-pink-50 relative group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img src={e.userPfp} className="w-12 h-12 rounded-full border-2 border-pink-100" />
                    <div><h4 className="font-bold text-pink-700">{e.userName}</h4><span className="text-[10px] font-bold text-pink-300 uppercase">{e.visibility}</span></div>
                  </div>
                  {profile.isAdmin && <button onClick={() => setEntries(entries.filter(i => i.id !== e.id))} className="text-pink-100 hover:text-red-400 transition-colors"><Trash2 size={20}/></button>}
                </div>
                {e.image && <img src={e.image} className="w-full rounded-[40px] mb-4 border-4 border-pink-50 shadow-inner" />}
                <p className="text-pink-600 font-semibold text-lg">{e.text}</p>
                {/* Entry Stickers */}
                {e.decorations?.map(d => (
                   <div key={d.id} className="absolute opacity-60" style={{left: `${d.x}%`, top: `${d.y}%`}}>
                      {d.type === 'heart' && <Heart fill="#ffb7c5" className="text-pink-200" size={24}/>}
                      {d.type === 'star' && <Star fill="#fff1b8" className="text-yellow-200" size={24}/>}
                      {d.type === 'ribbon' && <span className="text-xl">🎀</span>}
                      {d.type === 'melody' && <span className="text-xl">🐰</span>}
                   </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Social Sidebar */}
        <aside className="w-full lg:w-80 space-y-6">
          <div className="bg-white rounded-[40px] soft-3d-shadow border-2 border-pink-50 p-6 flex flex-col h-[500px]">
            <div className="flex p-1 bg-pink-50 rounded-full mb-4">
               {['friends', 'groups', 'chat'].map(t => (
                 <button key={t} onClick={() => setActiveTab(t)} className={`flex-1 py-2 rounded-full text-[11px] font-bold uppercase ${activeTab === t ? 'melody-gradient text-white shadow-md' : 'text-pink-300'}`}>{t}</button>
               ))}
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              {activeTab === 'friends' && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-pink-400 uppercase tracking-widest">Pending Requests</h4>
                  {profile.pending.map(p => (
                    <div key={p} className="bg-pink-50 p-3 rounded-2xl flex items-center justify-between">
                      <span className="text-sm font-bold text-pink-700">{p}</span>
                      <div className="flex gap-1"><button onClick={() => setProfile({...profile, pending: []})} className="p-1 bg-green-400 text-white rounded-full"><Check size={12}/></button><button className="p-1 bg-red-400 text-white rounded-full"><X size={12}/></button></div>
                    </div>
                  ))}
                  <button onClick={() => prompt("Invite Bestie by Name?")} className="w-full border-2 border-dashed border-pink-200 rounded-2xl p-4 text-pink-300 text-sm font-bold flex items-center justify-center gap-2"><UserPlus size={16}/> Add Bestie</button>
                </div>
              )}

              {activeTab === 'groups' && (
                <div className="space-y-3">
                  {groups.map(g => (
                    <div key={g.id} onClick={() => { setSelectedGroupId(g.id); setActiveTab('chat'); }} className="p-4 bg-pink-50 rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-pink-100">
                      <div className="w-10 h-10 melody-gradient rounded-full flex items-center justify-center text-white font-black">{g.name[0]}</div>
                      <span className="font-bold text-pink-700">{g.name}</span>
                    </div>
                  ))}
                  {/* Fixed: Use .toString() for ID and ensured members matches state type */}
                  <button onClick={() => { const n = prompt("Group Name?"); if(n) setGroups([...groups, {id: Date.now().toString(), name: n, members: [] as any[]}]) }} className="w-full melody-gradient text-white py-3 rounded-2xl font-black shadow-sm">+ Create Group</button>
                </div>
              )}

              {activeTab === 'chat' && (
                <div className="h-full flex flex-col">
                  {!selectedGroupId ? <p className="text-center text-pink-200 italic mt-20">Pick a group to chat! 🐰</p> : (
                    <>
                      <div className="flex items-center justify-between mb-4"><span className="text-xs font-black text-pink-400 uppercase">{groups.find(g => g.id === selectedGroupId).name}</span><button onClick={() => setSelectedGroupId(null)}><ArrowLeft size={14}/></button></div>
                      <div className="flex-1 space-y-3 overflow-y-auto">
                        {messages.filter(m => m.groupId === selectedGroupId).map(m => (
                          <div key={m.id} className={`flex flex-col ${m.userId === profile.id ? 'items-end' : 'items-start'}`}>
                            <div className={`p-3 rounded-2xl text-sm ${m.userId === profile.id ? 'bg-pink-500 text-white' : 'bg-pink-100 text-pink-700'}`}>{m.text}</div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex gap-2"><input value={msgInput} onChange={e => setMsgInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} className="flex-1 bg-pink-50 rounded-full px-4 text-sm border-none" placeholder="Aa..." /><button onClick={handleSendMessage} className="p-2 melody-gradient text-white rounded-full"><Send size={14}/></button></div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);
