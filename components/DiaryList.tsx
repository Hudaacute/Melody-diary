
import React, { useState } from 'react';
import { DiaryEntry, Visibility } from '../types';
import { Lock, Globe, Heart, MessageCircle, Trash2, Send } from 'lucide-react';

interface DiaryListProps {
  entries: DiaryEntry[];
  currentUserId: string;
  isAdmin?: boolean;
  onLike: (id: string) => void;
  onReply: (userName: string) => void;
  onDelete: (id: string) => void;
  onAddComment: (entryId: string, text: string) => void;
}

export const DiaryList: React.FC<DiaryListProps> = ({ entries, currentUserId, isAdmin, onLike, onReply, onDelete, onAddComment }) => {
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  const submitComment = (id: string) => {
    onAddComment(id, commentInput);
    setCommentInput('');
    setActiveCommentId(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {entries.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-pink-300 text-xl font-medium italic">No diary entries yet... Start writing! ✨</p>
        </div>
      ) : (
        entries.map((entry) => {
          const likes = entry.likes || [];
          const comments = entry.comments || [];
          const hasLiked = likes.includes(currentUserId);
          const isOwner = entry.userId === currentUserId;

          return (
            <div key={entry.id} className="bg-white rounded-[40px] p-8 soft-3d-shadow border-2 border-pink-50 relative overflow-hidden transition-all group/card">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <img src={entry.userPfp} className="w-14 h-14 rounded-full border-4 border-pink-50 object-cover shadow-sm" alt={entry.userName} />
                  <div>
                    <h3 className="font-black text-pink-700 text-lg leading-none mb-1">{entry.userName}</h3>
                    <p className="text-pink-300 text-[10px] font-bold uppercase tracking-wider">{new Date(entry.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="bg-pink-50 px-3 py-1.5 rounded-full flex items-center space-x-1.5 shadow-inner">
                    {entry.visibility === 'private' ? (
                      <><Lock size={12} className="text-pink-400" /> <span className="text-[9px] text-pink-500 font-black">PRIVATE</span></>
                    ) : (
                      <><Globe size={12} className="text-pink-400" /> <span className="text-[9px] text-pink-500 font-black">PUBLIC</span></>
                    )}
                  </div>
                  {(isOwner || isAdmin) && (
                    <button 
                      onClick={() => onDelete(entry.id)}
                      className="p-2 text-pink-100 hover:text-red-400 hover:bg-red-50 rounded-full transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {entry.imageUrl && (
                  <div className="relative">
                    <img src={entry.imageUrl} className="w-full rounded-[35px] object-cover max-h-96 border-8 border-pink-50 shadow-md" alt="post" />
                    <div className="absolute top-4 left-4 text-2xl drop-shadow-md">🎀</div>
                  </div>
                )}
                <p className="text-pink-600 leading-relaxed text-xl font-medium whitespace-pre-wrap px-2">
                  {entry.text}
                </p>
              </div>

              {/* Interaction Bar */}
              <div className="flex items-center space-x-6 border-t border-pink-50 pt-5 relative z-10">
                <button 
                  onClick={() => onLike(entry.id)}
                  className={`flex items-center space-x-2 transition-all hover:scale-110 active:scale-95 group/btn ${hasLiked ? 'text-pink-600' : 'text-pink-300 hover:text-pink-500'}`}
                >
                  <div className={`p-2 rounded-full ${hasLiked ? 'bg-pink-100' : 'bg-gray-50'}`}>
                    <Heart size={20} fill={hasLiked ? "currentColor" : "none"} />
                  </div>
                  <span className="text-sm font-black uppercase tracking-tighter">{likes.length} Love</span>
                </button>
                <button 
                  onClick={() => setActiveCommentId(activeCommentId === entry.id ? null : entry.id)}
                  className="flex items-center space-x-2 text-pink-300 hover:text-pink-500 transition-all hover:scale-110 active:scale-95 group/btn"
                >
                  <div className="p-2 bg-gray-50 rounded-full group-hover/btn:bg-pink-50">
                    <MessageCircle size={20} />
                  </div>
                  <span className="text-sm font-black uppercase tracking-tighter">{comments.length} Talk</span>
                </button>
              </div>

              {/* Comment Section */}
              {(activeCommentId === entry.id || comments.length > 0) && (
                <div className="mt-6 space-y-4 pt-4 animate-in slide-in-from-top-2">
                  <div className="space-y-3">
                    {comments.map((c) => (
                      <div key={c.id} className="flex items-start space-x-3 bg-pink-50/50 p-4 rounded-3xl border border-white">
                        <img src={c.userPfp} className="w-8 h-8 rounded-full border border-pink-100 shadow-sm" alt={c.userName} />
                        <div className="flex-1">
                          <h4 className="text-[11px] font-black text-pink-700 uppercase tracking-tighter">{c.userName}</h4>
                          <p className="text-pink-600 text-sm font-medium">{c.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {activeCommentId === entry.id && (
                    <div className="flex items-center space-x-2 bg-white rounded-full p-2 border-2 border-pink-100 shadow-inner group-focus-within:border-pink-300 transition-all">
                      <input 
                        autoFocus
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="Say something sweet..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-pink-600 font-semibold px-4"
                        onKeyDown={(e) => e.key === 'Enter' && submitComment(entry.id)}
                      />
                      <button 
                        onClick={() => submitComment(entry.id)}
                        className="w-10 h-10 melody-gradient text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};
