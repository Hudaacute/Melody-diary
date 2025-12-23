   
import React, { useState, useEffect } from 'react';
import { DiaryEntry, UserProfile, ChatMessage, Visibility, Decoration, Group, Comment } from './types';
import { CloudDiaryEditor } from './components/CloudDiaryEditor';
import { DiaryList } from './components/DiaryList';
import { SocialHub } from './components/SocialHub';
import { AdminDashboard } from './components/AdminDashboard';
import { ProfileModal } from './components/ProfileModal';
import { AccessWall } from './components/AccessWall';
import { RegistrationForm } from './components/RegistrationForm';
import { User, Bell, Heart, ShieldAlert } from 'lucide-react';

const PRIVATE_SECRET_KEY = "2010";
const ADMIN_CODE = "1803";

const App: React.FC = () => {
  const savedProfile = localStorage.getItem('melody_profile');
  const [profile, setProfile] = useState<UserProfile | null>(savedProfile ? JSON.parse(savedProfile) : null);
  
  const [entries, setEntries] = useState<DiaryEntry[]>(() => {
    const saved = localStorage.getItem('melody_entries');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const [replyTarget, setReplyTarget] = useState<string | null>(null);
  
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(localStorage.getItem('melody_access_granted') === 'true');

  const myGroups = allGroups.filter(g => profile && g.members.includes(profile.id));

  useEffect(() => {
    localStorage.setItem('melody_entries', JSON.stringify(entries));
  }, [entries]);

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
    if (confirm("Delete this sweet memory forever? 🎀")) {
      setEntries(prev => prev.filter(e => e.id !== entryId));
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
          likes: hasLiked 
            ? entry.likes.filter(id => id !== profile.id) 
            : [...entry.likes, profile.id]
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
    localStorage.setItem('melody_profile', JSON.stringify(newProfile));
  };

  const handleSendFriendRequest = (username: string) => {
    alert(`🎀 Friend request sent to ${username}!`);
  };

  const handleAcceptFriend = (requestId: string) => {
    if (!profile) return;
    const newFriends = [...profile.friends, requestId];
    const newPending = profile.pendingRequests.filter(r => r !== requestId);
    updateProfile({ friends: newFriends, pendingRequests: newPending });
    alert(`Yay! You have a new bestie! 💖`);
  };

  const handleCreateGroup = (name: string, isPublic: boolean) => {
    if (!profile) return;
    const newGroup: Group = {
      id: Date.now().toString(),
      name,
      members: [profile.id],
      ownerId: profile.id,
      isPublic
    };
    setAllGroups([...allGroups, newGroup]);
    alert(`New group "${name}" created! ☁️✨`);
  };

  const handleJoinGroup = (groupId: string) => {
    if (!profile) return;
    setAllGroups(prev => prev.map(g => {
      if (g.id === groupId && !g.members.includes(profile!.id)) {
        return { ...g, members: [...g.members, profile!.id] };
      }
      return g;
    }));
  };

  const handleAddToGroup = (groupId: string, friendId: string) => {
    setAllGroups(prev => prev.map(g => {
      if (g.id === groupId && !g.members.includes(friendId)) {
        return { ...g, members: [...g.members, friendId] };
      }
      return g;
    }));
  };

  const handleOpenAdmin = () => {
    const code = prompt("Enter Secret Admin Code: 🎀");
    if (code === ADMIN_CODE) {
      updateProfile({ isAdmin: true });
      setIsAdminOpen(true);
    } else {
      alert("Oops! That's not the secret admin code! 🍬");
    }
  };

  if (!isAuthorized) {
    return <AccessWall secretKey={PRIVATE_SECRET_KEY} onAuthorized={() => setIsAuthorized(true)} />;
  }

  if (!profile) {
    return <RegistrationForm onComplete={setProfile} />;
  }

  const friendsProfiles: UserProfile[] = [
    { id: 'f1', username: 'MelodyFan', email: 'm@fan.com', pfp: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', friends: [], pendingRequests: [], lastActive: '2m ago' },
    { id: 'f2', username: 'PinkPuff', email: 'p@puff.com', pfp: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop', friends: [], pendingRequests: [], lastActive: '5m ago' }
  ];

  return (
    <div className="min-h-screen pb-10 bg-[#fff5f7] animate-in fade-in duration-1000">
      <nav className="sticky top-0 z-50 glass-pink border-b border-pink-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 melody-gradient rounded-full flex items-center justify-center soft-3d-shadow animate-pulse">
            <Heart className="text-white fill-white" size={24} />
          </div>
          <h1 className="text-2xl font-black text-pink-500 tracking-tight hidden sm:block">My Secret Journal</h1>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={handleOpenAdmin} 
            className={`p-3 rounded-full transition-all flex items-center gap-2 ${profile.isAdmin ? 'text-pink-600 bg-pink-100' : 'text-pink-300 hover:bg-pink-50'}`} 
            title="Admin Hub"
          >
            <ShieldAlert size={22} />
          </button>
          <div className="flex items-center space-x-2 pl-2 border-l border-pink-100 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setIsProfileOpen(true)}>
            <img src={profile.pfp} className="w-10 h-10 rounded-full border-2 border-pink-200 object-cover" alt="profile" />
            <span className="font-bold text-pink-600 hidden md:block">{profile.username}</span>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 mt-8 flex flex-col xl:flex-row gap-8">
        <div className="flex-1 space-y-8">
          <section>
            <CloudDiaryEditor onPost={addEntry} initialText={replyTarget || ''} />
          </section>

          <section>
            <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto px-4">
              <h2 className="text-3xl font-black text-pink-700">Entries</h2>
            </div>
            <DiaryList 
              entries={entries.filter(e => e.visibility !== 'group')} 
              currentUserId={profile.id} 
              isAdmin={profile.isAdmin}
              onLike={handleLikeEntry}
              onReply={handleReplyToEntry}
              onDelete={handleDeleteEntry}
              onAddComment={handleAddComment}
            />
          </section>
        </div>

        <SocialHub 
          profile={profile} 
          messages={messages} 
          groups={myGroups}
          allEntries={entries}
          friendsProfiles={friendsProfiles}
          onSendMessage={handleSendMessage}
          onAcceptFriend={handleAcceptFriend}
          onSendRequest={handleSendFriendRequest}
          onCreateGroup={handleCreateGroup}
          onAddToGroup={handleAddToGroup}
          onPostToGroup={addEntry}
          onDeleteEntry={handleDeleteEntry}
        />
      </main>

      {isAdminOpen && <AdminDashboard users={[profile, ...friendsProfiles]} onClose={() => setIsAdminOpen(false)} />}
      {isProfileOpen && <ProfileModal profile={profile} onSave={updateProfile} onClose={() => setIsProfileOpen(false)} />}
    </div>
  );
};

export default App;
