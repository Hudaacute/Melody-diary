
import React, { useState, useEffect } from 'react';
import { DiaryEntry, UserProfile, ChatMessage, Visibility, Decoration, Group } from './types';
import { CloudDiaryEditor } from './components/CloudDiaryEditor';
import { DiaryList } from './components/DiaryList';
import { SocialHub } from './components/SocialHub';
import { AdminDashboard } from './components/AdminDashboard';
import { ProfileModal } from './components/ProfileModal';
import { AccessWall } from './components/AccessWall';
import { User, Bell, Heart, ShieldAlert } from 'lucide-react';

const ADMIN_EMAIL = "admin@pink.diary"; 
const PRIVATE_SECRET_KEY = "2010"; // NEW SECRET CODE FOR FRIENDS
const ADMIN_CODE = "1803"; // NEW ADMIN CODE

const MOCK_REGISTRY: UserProfile[] = [
  { id: 'me', username: 'MelodySweetie', email: ADMIN_EMAIL, pfp: 'https://picsum.photos/seed/me/200', friends: ['user1', 'user2'], pendingRequests: ['req1'], lastActive: 'Just now', isAdmin: true },
  { id: 'user1', username: 'CloudCuddle', email: 'cloud@friend.com', pfp: 'https://picsum.photos/seed/user1/200', friends: ['me'], pendingRequests: [], lastActive: '2m ago' },
  { id: 'user2', username: 'PinkBow', email: 'bow@friend.com', pfp: 'https://picsum.photos/seed/user2/200', friends: ['me'], pendingRequests: [], lastActive: '10m ago' },
  { id: 'user3', username: 'BerryBunny', email: 'berry@friend.com', pfp: 'https://picsum.photos/seed/berry/100', friends: [], pendingRequests: [], lastActive: 'Offline' },
];

const MOCK_ALL_GROUPS: Group[] = [
  { id: 'besties', name: 'Pink Besties 🎀', members: ['me', 'user1', 'user2'], ownerId: 'me', isPublic: true },
  { id: 'cloud_lovers', name: 'Cloud Lovers ☁️', members: ['user1', 'user3'], ownerId: 'user1', isPublic: true },
  { id: 'sweet_secrets', name: 'Sweet Secrets 🍭', members: ['user2'], ownerId: 'user2', isPublic: true },
];

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(MOCK_REGISTRY[0]);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [allGroups, setAllGroups] = useState<Group[]>(MOCK_ALL_GROUPS);
  
  const [activeView, setActiveView] = useState<'all' | 'mine'>('all');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(localStorage.getItem('melody_access_granted') === 'true');

  // Filter groups user is a member of
  const myGroups = allGroups.filter(g => g.members.includes(profile.id));

  useEffect(() => {
    if (entries.length === 0) {
      addEntry("Welcome to our pink dream world! 🎀✨ Start writing your first secret above!", 'public', undefined, []);
    }
  }, []);

  const addEntry = (text: string, visibility: Visibility, image?: string, decorations: Decoration[] = []) => {
    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      userId: profile.id,
      userName: profile.username,
      userPfp: profile.pfp,
      text,
      imageUrl: image,
      visibility,
      timestamp: Date.now(),
      decorations,
    };
    setEntries([newEntry, ...entries]);
  };

  const handleSendMessage = (text: string, groupId: string) => {
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
    setProfile({ ...profile, ...updates });
  };

  const handleSendFriendRequest = (username: string) => {
    alert(`🎀 Friend request sent to ${username}! Wait for them to say yes! ✨`);
    if (username.toLowerCase().includes('berry')) {
      setTimeout(() => {
        setProfile(prev => ({ ...prev, friends: [...prev.friends, 'user3'] }));
        alert("BerryBunny accepted your request! 🍓🐰");
      }, 2000);
    }
  };

  const handleAcceptFriend = (requestId: string) => {
    const newFriends = [...profile.friends, requestId];
    const newPending = profile.pendingRequests.filter(r => r !== requestId);
    setProfile({ ...profile, friends: newFriends, pendingRequests: newPending });
    alert(`Yay! You have a new bestie! 💖`);
  };

  const handleCreateGroup = (name: string, isPublic: boolean) => {
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
    setAllGroups(prev => prev.map(g => {
      if (g.id === groupId && !g.members.includes(profile.id)) {
        return { ...g, members: [...g.members, profile.id] };
      }
      return g;
    }));
    const groupName = allGroups.find(g => g.id === groupId)?.name;
    alert(`You've joined ${groupName}! 🎀✨ Start chatting!`);
  };

  const handleAddToGroup = (groupId: string, friendId: string) => {
    setAllGroups(prev => prev.map(g => {
      if (g.id === groupId && !g.members.includes(friendId)) {
        return { ...g, members: [...g.members, friendId] };
      }
      return g;
    }));
    const friend = MOCK_REGISTRY.find(u => u.id === friendId);
    alert(`${friend?.username} added to the group! 🎀`);
  };

  const handleOpenAdmin = () => {
    const code = prompt("Enter Secret Admin Code: 🎀");
    if (code === ADMIN_CODE) {
      setIsAdminOpen(true);
    } else {
      alert("Oops! That's not the secret admin code! 🍬");
    }
  };

  const friendsProfiles = MOCK_REGISTRY.filter(u => profile.friends.includes(u.id));

  if (!isAuthorized) {
    return <AccessWall secretKey={PRIVATE_SECRET_KEY} onAuthorized={() => setIsAuthorized(true)} />;
  }

  return (
    <div className="min-h-screen pb-10 bg-[#fff5f7] animate-in fade-in duration-1000">
      <nav className="sticky top-0 z-50 glass-pink border-b border-pink-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 melody-gradient rounded-full flex items-center justify-center soft-3d-shadow">
            <Heart className="text-white fill-white" size={24} />
          </div>
          <h1 className="text-2xl font-black text-pink-500 tracking-tight hidden sm:block">Melody Diary</h1>
        </div>

        <div className="flex items-center bg-white rounded-full p-1.5 soft-3d-shadow border border-pink-50">
          <button
            onClick={() => setActiveView('all')}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeView === 'all' ? 'melody-gradient text-white shadow-md' : 'text-pink-300 hover:text-pink-500'}`}
          >
            Feed
          </button>
          <button
            onClick={() => setActiveView('mine')}
            className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeView === 'mine' ? 'melody-gradient text-white shadow-md' : 'text-pink-300 hover:text-pink-500'}`}
          >
            My Journal
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {profile.email === ADMIN_EMAIL && (
            <button onClick={handleOpenAdmin} className="p-3 text-pink-600 hover:bg-pink-100 rounded-full transition-all animate-pulse" title="Admin Hub"><ShieldAlert size={22} /></button>
          )}
          <button className="p-3 text-pink-400 hover:bg-white hover:shadow-sm rounded-full transition-all relative">
            <Bell size={22} />
            <span className="absolute top-2 right-2 w-3 h-3 bg-pink-500 border-2 border-white rounded-full"></span>
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
            <CloudDiaryEditor onPost={addEntry} />
          </section>

          <section>
            <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto px-4">
              <h2 className="text-3xl font-black text-pink-700">
                {activeView === 'all' ? "Community Moments ✨" : "My Secret Diary 🎀"}
              </h2>
            </div>
            <DiaryList 
              entries={activeView === 'all' ? entries : entries.filter(e => e.userId === profile.id)} 
              currentUserId={profile.id} 
            />
          </section>
        </div>

        <SocialHub 
          profile={profile} 
          messages={messages} 
          groups={myGroups}
          allGroups={allGroups}
          friendsProfiles={friendsProfiles}
          onSendMessage={handleSendMessage}
          onAcceptFriend={handleAcceptFriend}
          onSendRequest={handleSendFriendRequest}
          onCreateGroup={handleCreateGroup}
          onAddToGroup={handleAddToGroup}
          onJoinGroup={handleJoinGroup}
        />
      </main>

      {isAdminOpen && <AdminDashboard users={MOCK_REGISTRY} onClose={() => setIsAdminOpen(false)} />}
      {isProfileOpen && <ProfileModal profile={profile} onSave={updateProfile} onClose={() => setIsProfileOpen(false)} />}

      <button onClick={() => setIsProfileOpen(true)} className="xl:hidden fixed bottom-6 right-6 w-16 h-16 melody-gradient text-white rounded-full flex items-center justify-center soft-3d-shadow z-40">
        <User size={30} />
      </button>
    </div>
  );
};

export default App;
