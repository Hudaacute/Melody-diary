
import React, { useState, useEffect } from 'react';
import { DiaryEntry, UserProfile, ChatMessage, Visibility, Decoration, Group, Comment } from './types';
import { CloudDiaryEditor } from './components/CloudDiaryEditor';
import { DiaryList } from './components/DiaryList';
import { SocialHub } from './components/SocialHub';
import { AdminDashboard } from './components/AdminDashboard';
import { ProfileModal } from './components/ProfileModal';
import { AccessWall } from './components/AccessWall';
import { RegistrationForm } from './components/RegistrationForm';
import { Heart, ShieldAlert, Sparkles } from 'lucide-react';

const PRIVATE_SECRET_KEY = "2010";
const ADMIN_CODE = "1803";

// Helper for safe JSON parsing
const safeParse = <T,>(key: string, fallback: T): T => {
  try {
    const val = localStorage.getItem(key);
    if (!val || val === "undefined") return fallback;
    return JSON.parse(val) as T;
  } catch (e) {
    console.error(`Error parsing ${key}:`, e);
    return fallback;
  }
};

const App: React.FC = () => {
  // Use safe parsing to prevent app crashes on bad storage data
  const [profile, setProfile] = useState<UserProfile | null>(() => safeParse<UserProfile | null>('melody_profile', null));
  
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => safeParse<UserProfile[]>('melody_all_users', []));

  const [entries, setEntries] = useState<DiaryEntry[]>(() => safeParse<DiaryEntry[]>('melody_entries', []));
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const [replyTarget, setReplyTarget] = useState<string | null>(null);
  
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(() => localStorage.getItem('melody_access_granted') === 'true');

  // Immediate loader removal on mount
  useEffect(() => {
    const removeLoader = () => {
      const loader = document.getElementById('loading-screen');
      if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
          loader.style.display = 'none';
        }, 800);
      }
    };
    
    // Attempt removal immediately
    removeLoader();
    
    // Also attach to window load for safety
    window.addEventListener('load', removeLoader);
    return () => window.removeEventListener('load', removeLoader);
  }, []);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('melody_entries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('melody_all_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    if (profile) {
      localStorage.setItem('melody_profile', JSON.stringify(profile));
    } else {
      localStorage.removeItem('melody_profile');
    }
  }, [profile]);

  // Security check: Logout if kicked
  useEffect(() => {
    if (profile && allUsers.length > 0) {
      const stillExists = allUsers.find(u => u.id === profile.id);
      if (!stillExists) {
        setProfile(null);
        alert("Oh no! 🎀 You were removed from the kingdom registry. Please contact the Admin!");
      }
    }
  }, [allUsers]);

  const addEntry = (text: string, visibility: Visibility, image?: string, decorations: Decoration[] = [], groupId?: string) => {
    if (!profile) return;
    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      userId: profile.id,
      userName: profile.username,
      userPfp: profile.pfp,
      text,
      imageUrl: image,
      visibility,
      groupId,
      timestamp: Date.now(),
      decorations,
      likes: [],
      comments: [],
    };
    setEntries([newEntry, ...entries]);
    setReplyTarget(null);
  };

  const handleDeleteEntry = (entryId: string) => {
    if (confirm("Remove this memory forever? 🎀")) {
      setEntries(prev => prev.filter(e => e.id !== entryId));
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === profile?.id) {
      alert("You can't kick yourself! 🐰👑");
      return;
    }
    if (confirm("Kick this person out of the kingdom? They will lose all access immediately! 🚫")) {
      setAllUsers(prev => prev.filter(u => u.id !== userId));
      setEntries(prev => prev.filter(e => e.userId !== userId));
    }
  };

  const handleAddComment = (entryId: string, text: string) => {
    if (!profile || !text.trim()) return;
    const newComment: Comment = {
      id: Date.now().toString(),
      userName: profile.username,
      userPfp: profile.pfp,
      text,
      timestamp: Date.now()
    };
    setEntries(prev => prev.map(e => e.id === entryId ? { ...e, comments: [...(e.comments || []), newComment] } : e));
  };

  const handleLikeEntry = (entryId: string) => {
    if (!profile) return;
    setEntries(prev => prev.map(entry => {
      if (entry.id === entryId) {
        const hasLiked = entry.likes.includes(profile.id);
        return {
          ...entry,
          likes: hasLiked ? entry.likes.filter(id => id !== profile.id) : [...entry.likes, profile.id]
        };
      }
      return entry;
    }));
  };

  const handleReplyToEntry = (userName: string) => {
    setReplyTarget(`@${userName} `);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSendMessage = (text: string, groupId: string) => {
    if (!profile) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      userId: profile.id,
      userName: profile.username,
      groupId,
      text,
      timestamp: Date.now(),
    };
    setMessages([...messages, newMsg]);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!profile) return;
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    setAllUsers(prev => prev.map(u => u.id === profile.id ? { ...u, ...updates } : u));
  };

  const handleAcceptFriend = (friendId: string) => {
    if (!profile) return;
    const updatedPending = profile.pendingRequests.filter(id => id !== friendId);
    const updatedFriends = [...profile.friends, friendId];
    updateProfile({ pendingRequests: updatedPending, friends: updatedFriends });
    setAllUsers(prev => prev.map(u => u.id === friendId ? { ...u, friends: [...u.friends, profile.id] } : u));
  };

  const handleOpenAdmin = () => {
    const code = prompt("Enter Secret Admin Code: 🎀");
    if (code === ADMIN_CODE) {
      updateProfile({ isAdmin: true });
      setIsAdminOpen(true);
    } else {
      alert("Wrong code! 🍬");
    }
  };

  if (!isAuthorized) {
    return <AccessWall secretKey={PRIVATE_SECRET_KEY} onAuthorized={() => setIsAuthorized(true)} />;
  }

  if (!profile) {
    return <RegistrationForm onComplete={(p) => {
      setProfile(p);
      setAllUsers(prev => prev.find(u => u.id === p.id) ? prev : [...prev, p]);
    }} />;
  }

  const myGroups = allGroups.filter(g => g.members.includes(profile.id));
  const otherUsers = allUsers.filter(u => u.id !== profile.id);

  return (
    <div className="min-h-screen pb-10 bg-[#fff5f7]">
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-pink-100 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 melody-gradient rounded-full flex items-center justify-center shadow-lg">
            <Sparkles className="text-white" size={18} />
          </div>
          <h1 className="text-xl font-black text-pink-500 tracking-tight flex items-center gap-2">
            Melody Kingdom <span className="text-xs bg-pink-100 px-2 py-0.5 rounded-full text-pink-400">v1.1</span>
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={handleOpenAdmin} 
            className={`p-2.5 rounded-full transition-all hover:scale-110 active:scale-90 ${profile.isAdmin ? 'text-pink-600 bg-pink-100' : 'text-pink-200'}`}
          >
            <ShieldAlert size={22} />
          </button>
          <div className="h-8 w-px bg-pink-100 mx-1"></div>
          <img 
            src={profile.pfp} 
            className="w-10 h-10 rounded-full border-2 border-pink-200 cursor-pointer hover:border-pink-400 transition-all object-cover shadow-sm" 
            onClick={() => setIsProfileOpen(true)}
            alt="me" 
          />
        </div>
      </nav>

      <main className="container mx-auto px-4 mt-8 flex flex-col xl:flex-row gap-8 max-w-7xl animate-in fade-in duration-500">
        <div className="flex-1 space-y-8">
          <CloudDiaryEditor onPost={addEntry} initialText={replyTarget || ''} />
          <div className="flex items-center gap-4 px-4">
             <div className="h-px flex-1 bg-pink-100"></div>
             <Heart className="text-pink-200 fill-pink-200" size={16} />
             <div className="h-px flex-1 bg-pink-100"></div>
          </div>
          <DiaryList 
            entries={entries.filter(e => e.visibility !== 'group' && (e.visibility === 'public' || e.userId === profile.id))} 
            currentUserId={profile.id} 
            isAdmin={profile.isAdmin}
            onLike={handleLikeEntry}
            onReply={handleReplyToEntry}
            onDelete={handleDeleteEntry}
            onAddComment={handleAddComment}
          />
        </div>

        <SocialHub 
          profile={profile} 
          messages={messages} 
          groups={myGroups}
          allEntries={entries}
          friendsProfiles={otherUsers}
          onSendMessage={handleSendMessage}
          onAcceptFriend={handleAcceptFriend}
          onSendRequest={(u) => alert(`Sweet! Request sent to ${u} 🎀`)}
          onCreateGroup={(n) => {
            const newG: Group = { id: Date.now().toString(), name: n, members: [profile.id], ownerId: profile.id, isPublic: false };
            setAllGroups([...allGroups, newG]);
          }}
          onAddToGroup={() => {}}
          onPostToGroup={addEntry}
          onDeleteEntry={handleDeleteEntry}
        />
      </main>

      {isAdminOpen && <AdminDashboard users={allUsers} onDeleteUser={handleDeleteUser} onClose={() => setIsAdminOpen(false)} />}
      {isProfileOpen && <ProfileModal profile={profile} onSave={updateProfile} onClose={() => setIsProfileOpen(false)} />}
    </div>
  );
};

export default App;
