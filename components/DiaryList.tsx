
import React from 'react';
import { DiaryEntry, Visibility } from '../types';
import { Lock, Globe, Heart, MessageCircle } from 'lucide-react';

interface DiaryListProps {
  entries: DiaryEntry[];
  currentUserId: string;
}

export const DiaryList: React.FC<DiaryListProps> = ({ entries, currentUserId }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {entries.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-pink-300 text-xl font-medium">No diary entries yet... Start writing! ✨</p>
        </div>
      ) : (
        entries.map((entry) => (
          <div key={entry.id} className="bg-white rounded-[40px] p-6 soft-3d-shadow border-2 border-pink-50 relative overflow-hidden transition-transform hover:scale-[1.01]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img src={entry.userPfp} className="w-12 h-12 rounded-full border-2 border-pink-200 object-cover" />
                <div>
                  <h3 className="font-bold text-pink-700">{entry.userName}</h3>
                  <p className="text-pink-300 text-xs">{new Date(entry.timestamp).toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-pink-50 px-3 py-1 rounded-full flex items-center space-x-1">
                {entry.visibility === 'private' ? (
                  <><Lock size={14} className="text-pink-400" /> <span className="text-[10px] text-pink-400 font-bold">PRIVATE</span></>
                ) : (
                  <><Globe size={14} className="text-pink-400" /> <span className="text-[10px] text-pink-400 font-bold">PUBLIC</span></>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              {entry.imageUrl && (
                <img src={entry.imageUrl} className="w-full rounded-3xl object-cover max-h-96 border-4 border-pink-50 shadow-inner" />
              )}
              <p className="text-pink-600 leading-relaxed text-lg whitespace-pre-wrap">
                {entry.text}
              </p>
            </div>

            {/* Decorations Layer (Simplified) */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-40">
               <Heart className="absolute top-4 right-8 text-pink-200" size={40} />
               <div className="absolute bottom-8 left-4 text-pink-100 rotate-12">🎀</div>
            </div>

            {/* Footer Actions */}
            <div className="mt-6 flex items-center space-x-6 border-t border-pink-50 pt-4">
              <button className="flex items-center space-x-1 text-pink-400 hover:text-pink-600">
                <Heart size={20} />
                <span className="text-sm font-bold">Love</span>
              </button>
              <button className="flex items-center space-x-1 text-pink-400 hover:text-pink-600">
                <MessageCircle size={20} />
                <span className="text-sm font-bold">Reply</span>
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
