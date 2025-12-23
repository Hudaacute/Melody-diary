
import React, { useState } from 'react';
import { UserPlus, MessageCircle, Users, Check, X, Send, Search, Users2, Plus, ArrowLeft, Globe, Compass } from 'lucide-react';
import { UserProfile, ChatMessage, Group } from '../types';

interface SocialHubProps {
  profile: UserProfile;
  messages: ChatMessage[];
  groups: Group[];
  allGroups: Group[]; // For discovery
  friendsProfiles: UserProfile[];
  onSendMessage: (text: string, groupId: string) => void;
  onAcceptFriend: (userId: string) => void;
  onSendRequest: (username: string) => void;
  onCreateGroup: (name: string, isPublic: boolean) => void;
  onAddToGroup: (groupId: string, friendId: string) => void;
  onJoinGroup: (groupId: string) => void;
}

const MOCK_FINDABLE_USERS = [
  { id: 'berry', username: 'BerryBunny', pfp: 'https://picsum.photos/seed/berry/100' },
  { id: 'lace', username: 'LaceHeart', pfp: 'https://picsum.photos/seed/lace/100' },
  { id: 'candy', username: 'CandyCloud', pfp: 'https://picsum.photos/seed/candy/100' },
];

export const SocialHub: React.FC<SocialHubProps> = ({ 
  profile, 
  messages, 
  groups,
  allGroups,
  friendsProfiles,
  onSendMessage, 
  onAcceptFriend, 
  onSendRequest,
  onCreateGroup,
  onAddToGroup,
  onJoinGroup
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'friends' | 'groups'>('chat');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('global');
  const [msgInput, setMsgInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof MOCK_FINDABLE_USERS>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [groupSearchQuery, setGroupSearchQuery] = useState('');

  const handleSend = () => {
    if (!msgInput.trim()) return;
    onSendMessage(msgInput, selectedGroupId);
    setMsgInput('');
  };

  const handleSearch = (val: string) => {
    setSearchQuery(val);
    if (val.trim().length > 1) {
      setSearchResults(MOCK_FINDABLE_USERS.filter(u => u.username.toLowerCase().includes(val.toLowerCase())));
    } else {
      setSearchResults([]);
    }
  };

  const currentGroupMessages = messages.filter(m => m.groupId === selectedGroupId);
  const activeGroup = allGroups.find(g => g.id === selectedGroupId) || { name: 'Global Chat', id: 'global' };

  // Filter groups for discovery: public groups the user is NOT in
  const discoverableGroups = allGroups.filter(g => 
    g.isPublic && 
    !g.members.includes(profile.id) && 
    g.name.toLowerCase().includes(groupSearchQuery.toLowerCase())
  );

  return (
    <div className="fixed right-4 top-24 bottom-4 w-80 bg-white rounded-[40px] soft-3d-shadow border-2 border-pink-100 flex flex-col hidden xl:flex">
      {/* Tabs */}
      <div className="flex p-2 gap-1">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2.5 rounded-full font-bold text-[12px] flex items-center justify-center space-x-1 transition-all ${activeTab === 'chat' ? 'melody-gradient text-white shadow-md' : 'text-pink-300 hover:bg-pink-50'}`}
        >
          <MessageCircle size={14} />
          <span>Chat</span>
        </button>
        <button
          onClick={() => setActiveTab('friends')}
          className={`flex-1 py-2.5 rounded-full font-bold text-[12px] flex items-center justify-center space-x-1 transition-all ${activeTab === 'friends' ? 'melody-gradient text-white shadow-md' : 'text-pink-300 hover:bg-pink-50'}`}
        >
          <Users size={14} />
          <span>Friends</span>
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          className={`flex-1 py-2.5 rounded-full font-bold text-[12px] flex items-center justify-center space-x-1 transition-all ${activeTab === 'groups' ? 'melody-gradient text-white shadow-md' : 'text-pink-300 hover:bg-pink-50'}`}
        >
          <Users2 size={14} />
          <span>Groups</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'chat' ? (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-pink-50">
              <span className="text-xs font-black text-pink-400 uppercase tracking-tighter">{activeGroup.name}</span>
              {selectedGroupId !== 'global' && (
                <button onClick={() => setSelectedGroupId('global')} className="text-pink-300 hover:text-pink-500"><ArrowLeft size={14}/></button>
              )}
            </div>
            <div className="flex-1 space-y-4">
              {currentGroupMessages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-pink-200 text-xs italic">No messages yet...</div>
              ) : (
                currentGroupMessages.map((m) => (
                  <div key={m.id} className={`flex flex-col ${m.userId === profile.id ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] text-pink-300 mb-0.5 px-2">{m.userName}</span>
                    <div className={`max-w-[90%] p-2.5 rounded-2xl text-sm ${m.userId === profile.id ? 'bg-pink-500 text-white rounded-tr-none' : 'bg-pink-100 text-pink-700 rounded-tl-none'}`}>
                      {m.text}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : activeTab === 'friends' ? (
          <div className="space-y-6">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search to add friends..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-pink-50 border-none rounded-full py-2 pl-10 pr-4 text-sm text-pink-600 focus:ring-2 focus:ring-pink-200"
              />
              <Search className="absolute left-3 top-2.5 text-pink-300" size={16} />
              
              {searchResults.length > 0 && (
                <div className="absolute top-11 left-0 right-0 bg-white border border-pink-50 rounded-2xl shadow-xl z-20 p-2 space-y-2">
                  {searchResults.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-2 hover:bg-pink-50 rounded-xl transition-colors">
                      <div className="flex items-center space-x-2">
                        <img src={user.pfp} className="w-8 h-8 rounded-full" />
                        <span className="text-xs font-bold text-pink-700">{user.username}</span>
                      </div>
                      <button 
                        onClick={() => {
                          onSendRequest(user.username);
                          setSearchQuery('');
                          setSearchResults([]);
                        }}
                        className="p-1.5 melody-gradient text-white rounded-full hover:scale-110 transition-transform"
                      >
                        <UserPlus size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h4 className="text-pink-400 text-[10px] font-bold uppercase tracking-wider mb-3">Requests ({profile.pendingRequests.length})</h4>
              {profile.pendingRequests.length > 0 ? (
                profile.pendingRequests.map((reqId) => (
                  <div key={reqId} className="bg-pink-50 p-2 rounded-2xl flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-pink-700">Request from {reqId}</span>
                    <div className="flex space-x-1">
                      <button onClick={() => onAcceptFriend(reqId)} className="p-1 bg-green-400 text-white rounded-full"><Check size={12} /></button>
                      <button className="p-1 bg-red-400 text-white rounded-full"><X size={12} /></button>
                    </div>
                  </div>
                ))
              ) : <p className="text-pink-200 text-[10px] italic text-center">No pending requests</p>}
            </div>

            <div>
              <h4 className="text-pink-400 text-[10px] font-bold uppercase tracking-wider mb-3">Your Friends</h4>
              <div className="grid grid-cols-4 gap-3">
                {friendsProfiles.map((f) => (
                  <div key={f.id} className="relative group">
                    <img src={f.pfp} className="w-full aspect-square rounded-full border-2 border-white object-cover" />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-pink-400 text-[10px] font-bold uppercase tracking-wider">Your Groups</h4>
              <button 
                onClick={() => setIsCreatingGroup(!isCreatingGroup)}
                className="p-1.5 bg-pink-100 text-pink-600 rounded-full hover:bg-pink-200 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>

            {isCreatingGroup && (
              <div className="bg-pink-50 p-3 rounded-2xl space-y-2 animate-in slide-in-from-top-2">
                <input 
                  type="text" 
                  placeholder="Group Name..."
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full bg-white border-none rounded-xl py-2 px-3 text-xs text-pink-600 focus:ring-2 focus:ring-pink-200"
                />
                <button 
                  onClick={() => {
                    if (newGroupName.trim()) {
                      onCreateGroup(newGroupName, true); // Create as public for now
                      setNewGroupName('');
                      setIsCreatingGroup(false);
                    }
                  }}
                  className="w-full melody-gradient text-white py-2 rounded-xl text-xs font-bold shadow-sm"
                >
                  Create Public Group
                </button>
              </div>
            )}

            <div className="space-y-3">
              <div 
                onClick={() => { setSelectedGroupId('global'); setActiveTab('chat'); }}
                className={`p-3 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${selectedGroupId === 'global' ? 'bg-pink-100' : 'bg-pink-50 hover:bg-pink-100/50'}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full melody-gradient flex items-center justify-center text-white"><Globe size={14}/></div>
                  <span className="text-xs font-bold text-pink-700">Global Chat</span>
                </div>
              </div>

              {groups.map(group => (
                <div key={group.id} className={`p-3 rounded-2xl space-y-2 transition-all ${selectedGroupId === group.id ? 'bg-pink-100' : 'bg-pink-50 hover:bg-pink-100/50'}`}>
                  <div className="flex items-center justify-between">
                    <div 
                      className="flex items-center space-x-3 cursor-pointer flex-1"
                      onClick={() => { setSelectedGroupId(group.id); setActiveTab('chat'); }}
                    >
                      <div className="w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center text-pink-600 font-black text-xs">
                        {group.name[0].toUpperCase()}
                      </div>
                      <span className="text-xs font-bold text-pink-700">{group.name}</span>
                    </div>
                    
                    {group.ownerId === profile.id && (
                      <div className="relative group/pop">
                        <button className="p-1 text-pink-400 hover:text-pink-600"><Plus size={12}/></button>
                        <div className="absolute right-0 top-6 w-48 bg-white border border-pink-100 rounded-xl shadow-xl hidden group-hover/pop:block z-30 p-2">
                           <p className="text-[10px] font-bold text-pink-300 mb-2 px-2 uppercase">Invite Besties</p>
                           {friendsProfiles.filter(f => !group.members.includes(f.id)).length > 0 ? (
                             friendsProfiles.filter(f => !group.members.includes(f.id)).map(friend => (
                               <button 
                                 key={friend.id}
                                 onClick={() => onAddToGroup(group.id, friend.id)}
                                 className="w-full flex items-center space-x-2 p-1.5 hover:bg-pink-50 rounded-lg text-left"
                               >
                                 <img src={friend.pfp} className="w-5 h-5 rounded-full" />
                                 <span className="text-[10px] text-pink-600 font-bold">{friend.username}</span>
                               </button>
                             ))
                           ) : <p className="text-[10px] text-gray-400 italic px-2">Everyone's already here!</p>}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex -space-x-1.5 overflow-hidden">
                    {group.members.slice(0, 5).map(mId => (
                      <div key={mId} className="w-5 h-5 rounded-full border border-white bg-pink-50 text-[8px] flex items-center justify-center text-pink-400 font-bold">
                        {mId === profile.id ? 'Me' : mId[0].toUpperCase()}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Group Discovery Section */}
            <div className="pt-4 border-t border-pink-50 space-y-4">
              <div className="flex items-center space-x-2 text-pink-400">
                <Compass size={16} />
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Discover Groups</h4>
              </div>
              
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Find public groups..."
                  value={groupSearchQuery}
                  onChange={(e) => setGroupSearchQuery(e.target.value)}
                  className="w-full bg-pink-50 border-none rounded-full py-2 pl-8 pr-4 text-xs text-pink-600 focus:ring-2 focus:ring-pink-200"
                />
                <Search className="absolute left-2.5 top-2 text-pink-300" size={14} />
              </div>

              <div className="space-y-2">
                {discoverableGroups.length > 0 ? (
                  discoverableGroups.map(dg => (
                    <div key={dg.id} className="bg-white border border-pink-50 p-2.5 rounded-2xl flex items-center justify-between hover:border-pink-200 transition-colors">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full melody-gradient flex items-center justify-center text-white text-[10px] font-black">
                          {dg.name[0]}
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-pink-700 leading-tight">{dg.name}</p>
                          <p className="text-[8px] text-pink-300">{dg.members.length} members</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => onJoinGroup(dg.id)}
                        className="px-3 py-1 bg-pink-50 text-pink-500 rounded-full text-[10px] font-bold hover:bg-pink-100 transition-colors"
                      >
                        Join
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-gray-400 italic text-center py-2">No new groups found</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {activeTab === 'chat' && (
        <div className="p-4 bg-pink-50/50 rounded-b-[40px]">
          <div className="bg-white rounded-full p-2 flex items-center shadow-inner border border-pink-100">
            <input
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
              placeholder={`Chat in ${activeGroup.name}...`}
              className="flex-1 bg-transparent border-none focus:ring-0 text-pink-600 text-sm px-2"
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="w-8 h-8 rounded-full melody-gradient text-white flex items-center justify-center hover:scale-110 transition-transform">
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
