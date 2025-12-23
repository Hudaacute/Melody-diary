
import React, { useState, useRef } from 'react';
import { UserPlus, MessageCircle, Users, Check, X, Send, Search, Users2, Plus, ArrowLeft, Camera, Trash2, Image as ImageIcon } from 'lucide-react';
import { UserProfile, ChatMessage, Group, DiaryEntry, Visibility } from '../types';

interface SocialHubProps {
  profile: UserProfile;
  messages: ChatMessage[];
  groups: Group[];
  allEntries: DiaryEntry[];
  friendsProfiles: UserProfile[];
  onSendMessage: (text: string, groupId: string) => void;
  onAcceptFriend: (userId: string) => void;
  onSendRequest: (username: string) => void;
  onCreateGroup: (name: string, isPublic: boolean) => void;
  onAddToGroup: (groupId: string, friendId: string) => void;
  onPostToGroup: (text: string, visibility: Visibility, image?: string, decos?: any, groupId?: string) => void;
  onDeleteEntry: (id: string) => void;
}

export const SocialHub: React.FC<SocialHubProps> = ({ 
  profile, 
  messages, 
  groups,
  allEntries,
  friendsProfiles,
  onSendMessage, 
  onAcceptFriend, 
  onSendRequest,
  onCreateGroup,
  onAddToGroup,
  onPostToGroup,
  onDeleteEntry
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'friends' | 'groups'>('friends');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [msgInput, setMsgInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [groupTab, setGroupTab] = useState<'chat' | 'photos'>('chat');
  const groupFileRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!msgInput.trim() || !selectedGroupId) return;
    onSendMessage(msgInput, selectedGroupId);
    setMsgInput('');
  };

  const handleGroupPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedGroupId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onPostToGroup("Shared a photo with the group! 🎀", 'group', reader.result as string, [], selectedGroupId);
      };
      reader.readAsDataURL(file);
    }
  };

  const activeGroup = groups.find(g => g.id === selectedGroupId);
  const currentGroupMessages = messages.filter(m => m.groupId === selectedGroupId);
  const groupPhotos = allEntries.filter(e => e.visibility === 'group' && e.groupId === selectedGroupId);

  return (
    <div className="fixed right-4 top-24 bottom-4 w-80 bg-white rounded-[40px] soft-3d-shadow border-2 border-pink-100 flex flex-col hidden xl:flex">
      <div className="flex p-2 gap-1 bg-pink-50/50 rounded-t-[40px]">
        <button
          onClick={() => setActiveTab('friends')}
          className={`flex-1 py-3 rounded-full font-black text-[10px] uppercase flex items-center justify-center space-x-1 transition-all ${activeTab === 'friends' ? 'melody-gradient text-white shadow-md' : 'text-pink-300 hover:bg-pink-100'}`}
        >
          <Users size={14} />
          <span>Besties</span>
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          className={`flex-1 py-3 rounded-full font-black text-[10px] uppercase flex items-center justify-center space-x-1 transition-all ${activeTab === 'groups' ? 'melody-gradient text-white shadow-md' : 'text-pink-300 hover:bg-pink-100'}`}
        >
          <Users2 size={14} />
          <span>Groups</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'groups' && selectedGroupId ? (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-pink-50">
              <div className="flex items-center space-x-2">
                <button onClick={() => setSelectedGroupId(null)} className="text-pink-300 hover:text-pink-500"><ArrowLeft size={16}/></button>
                <span className="text-xs font-black text-pink-500 uppercase tracking-tighter">{activeGroup?.name}</span>
              </div>
              <div className="flex bg-pink-50 p-1 rounded-full text-[10px] font-bold">
                <button onClick={() => setGroupTab('chat')} className={`px-2 py-1 rounded-full ${groupTab === 'chat' ? 'bg-white text-pink-500 shadow-sm' : 'text-pink-300'}`}>CHAT</button>
                <button onClick={() => setGroupTab('photos')} className={`px-2 py-1 rounded-full ${groupTab === 'photos' ? 'bg-white text-pink-500 shadow-sm' : 'text-pink-300'}`}>PHOTOS</button>
              </div>
            </div>

            {groupTab === 'chat' ? (
              <div className="flex flex-col h-full">
                <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                  {currentGroupMessages.map((m) => (
                    <div key={m.id} className={`flex flex-col ${m.userId === profile.id ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[85%] p-2.5 rounded-2xl text-xs font-semibold ${m.userId === profile.id ? 'bg-pink-500 text-white rounded-tr-none' : 'bg-pink-100 text-pink-700 rounded-tl-none'}`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                   <input 
                    value={msgInput} 
                    onChange={e => setMsgInput(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && handleSend()} 
                    placeholder="Type..."
                    className="flex-1 bg-pink-50 rounded-full px-4 text-xs border-none focus:ring-1 focus:ring-pink-200"
                   />
                   <button onClick={handleSend} className="p-2 melody-gradient text-white rounded-full shadow-md"><Send size={14}/></button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="grid grid-cols-2 gap-2 flex-1 overflow-y-auto pr-1 content-start">
                   {groupPhotos.map(photo => (
                     <div key={photo.id} className="relative aspect-square group">
                        <img src={photo.imageUrl} className="w-full h-full object-cover rounded-2xl border-2 border-pink-50 shadow-sm" />
                        {photo.userId === profile.id && (
                          <button onClick={() => onDeleteEntry(photo.id)} className="absolute top-1 right-1 p-1 bg-white/80 text-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12}/></button>
                        )}
                     </div>
                   ))}
                   {groupPhotos.length === 0 && <p className="col-span-2 text-center text-pink-200 text-[10px] mt-10">No photos shared yet! 🎀</p>}
                </div>
                <button onClick={() => groupFileRef.current?.click()} className="mt-4 w-full melody-gradient text-white py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg">
                  <Camera size={14} /> <span>Upload Group Photo</span>
                </button>
                <input type="file" ref={groupFileRef} className="hidden" accept="image/*" onChange={handleGroupPhoto} />
              </div>
            )}
          </div>
        ) : activeTab === 'friends' ? (
          <div className="space-y-6">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Find a bestie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-pink-50 border-none rounded-full py-3 pl-10 pr-4 text-sm text-pink-600 focus:ring-4 focus:ring-pink-100"
              />
              <Search className="absolute left-3 top-3.5 text-pink-300" size={16} />
              {searchQuery.length > 2 && (
                <button 
                  onClick={() => { onSendRequest(searchQuery); setSearchQuery(''); }}
                  className="absolute right-2 top-2 bg-pink-500 text-white p-1.5 rounded-full"
                >
                  <Plus size={14} />
                </button>
              )}
            </div>

            <div>
              <h4 className="text-pink-400 text-[9px] font-black uppercase tracking-widest mb-3">Requests ({profile.pendingRequests.length})</h4>
              {profile.pendingRequests.map((reqId) => (
                <div key={reqId} className="bg-pink-50 p-2 rounded-2xl flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-pink-700">{reqId}</span>
                  <div className="flex space-x-1">
                    <button onClick={() => onAcceptFriend(reqId)} className="p-1.5 bg-green-400 text-white rounded-full"><Check size={12} /></button>
                    <button className="p-1.5 bg-red-400 text-white rounded-full"><X size={12} /></button>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h4 className="text-pink-400 text-[9px] font-black uppercase tracking-widest mb-3">Your Besties</h4>
              <div className="grid grid-cols-4 gap-3">
                {friendsProfiles.map((f) => (
                  <div key={f.id} className="relative group cursor-help" title={f.username}>
                    <img src={f.pfp} className="w-full aspect-square rounded-full border-2 border-white object-cover shadow-sm group-hover:scale-110 transition-transform" alt={f.username} />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-pink-400 text-[9px] font-black uppercase tracking-widest">Your Circles</h4>
              <button 
                onClick={() => setIsCreatingGroup(!isCreatingGroup)}
                className="p-1.5 bg-pink-50 text-pink-500 rounded-full hover:bg-pink-100"
              >
                <Plus size={16} />
              </button>
            </div>

            {isCreatingGroup && (
              <div className="bg-pink-50 p-4 rounded-3xl space-y-3 animate-in slide-in-from-top-2 border-2 border-white shadow-sm">
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
                      onCreateGroup(newGroupName, false);
                      setNewGroupName('');
                      setIsCreatingGroup(false);
                    }
                  }}
                  className="w-full melody-gradient text-white py-3 rounded-xl text-xs font-black shadow-md"
                >
                  Create Private Group
                </button>
              </div>
            )}

            <div className="space-y-3">
              {groups.map(group => (
                <div key={group.id} className={`p-4 rounded-3xl space-y-2 transition-all cursor-pointer shadow-sm ${selectedGroupId === group.id ? 'bg-pink-100 border-2 border-white' : 'bg-pink-50 hover:bg-pink-100/50 border-2 border-transparent'}`} onClick={() => setSelectedGroupId(group.id)}>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full melody-gradient flex items-center justify-center text-white font-black text-xs shadow-inner">
                      {group.name[0].toUpperCase()}
                    </div>
                    <div>
                      <h5 className="text-[11px] font-black text-pink-700 tracking-tight">{group.name}</h5>
                      <p className="text-[8px] font-bold text-pink-300 uppercase">{group.members.length} members</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
