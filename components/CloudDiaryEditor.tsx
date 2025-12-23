
import React, { useState, useRef } from 'react';
import { Camera, Send, Lock, Globe, Sparkles, Smile, Heart, Star, Ribbon } from 'lucide-react';
import { Visibility, Decoration } from '../types';
import { enhanceDiaryEntry } from '../services/gemini';

interface CloudDiaryEditorProps {
  onPost: (text: string, visibility: Visibility, image?: string, decorations?: Decoration[]) => void;
}

const STICKER_OPTIONS = [
  { type: 'heart', icon: <Heart size={16} fill="currentColor" />, color: 'text-pink-400' },
  { type: 'star', icon: <Star size={16} fill="currentColor" />, color: 'text-yellow-400' },
  { type: 'ribbon', icon: <Ribbon size={16} />, color: 'text-pink-300' },
  { type: 'melody', icon: <Smile size={16} />, color: 'text-pink-500', label: 'Melody' },
];

export const CloudDiaryEditor: React.FC<CloudDiaryEditorProps> = ({ onPost }) => {
  const [text, setText] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('private');
  const [image, setImage] = useState<string | null>(null);
  const [decorations, setDecorations] = useState<Decoration[]>([]);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addSticker = (type: string, label: string = '') => {
    const newDeco: Decoration = {
      id: Date.now().toString() + Math.random(),
      type,
      label,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
    };
    setDecorations([...decorations, newDeco]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleEnhance = async () => {
    if (!text) return;
    setIsEnhancing(true);
    const enhanced = await enhanceDiaryEntry(text);
    setText(enhanced);
    setIsEnhancing(false);
  };

  const handleSubmit = () => {
    if (!text.trim() && !image) return;
    onPost(text, visibility, image || undefined, decorations);
    setText('');
    setImage(null);
    setDecorations([]);
    setShowStickers(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-4">
      <div className="relative group">
        <div className="relative bg-white p-8 soft-3d-shadow rounded-[60px] border-4 border-pink-100 min-h-[180px] flex flex-col items-center overflow-hidden">
          {/* Removed the character photo from here as requested */}
          
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your sweet secrets here..."
            className="w-full bg-transparent border-none focus:ring-0 text-pink-600 placeholder-pink-200 resize-none text-lg font-medium relative z-10"
            rows={4}
          />

          {/* Decoration Preview */}
          {decorations.map((d) => (
            <div 
              key={d.id} 
              className={`absolute pointer-events-none opacity-60 animate-bounce`}
              style={{ left: `${d.x}%`, top: `${d.y}%` }}
            >
              {d.type === 'heart' && <Heart className="text-pink-300 fill-pink-100" size={32} />}
              {d.type === 'star' && <Star className="text-yellow-200 fill-yellow-50" size={32} />}
              {d.type === 'ribbon' && <span className="text-3xl">🎀</span>}
              {d.type === 'melody' && <span className="text-3xl">🐰</span>}
            </div>
          ))}

          {image && (
            <div className="relative w-full mt-4 z-10">
              <img src={image} className="rounded-2xl w-full h-48 object-cover border-4 border-pink-50" />
              <button onClick={() => setImage(null)} className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-pink-500 hover:text-pink-700">×</button>
            </div>
          )}
        </div>

        {/* Sticker Bar */}
        {showStickers && (
          <div className="flex items-center justify-center space-x-4 p-3 bg-white/90 backdrop-blur rounded-full mt-4 soft-3d-shadow animate-in slide-in-from-bottom-2">
            {STICKER_OPTIONS.map((opt) => (
              <button
                key={opt.type}
                onClick={() => addSticker(opt.type, opt.label)}
                className={`p-3 rounded-full hover:bg-pink-50 transition-all ${opt.color} flex items-center justify-center`}
              >
                {opt.icon}
              </button>
            ))}
            <button onClick={() => setDecorations([])} className="text-[10px] font-bold text-gray-400 hover:text-red-400 uppercase">Clear All</button>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between px-4">
          <div className="flex space-x-3">
            <button onClick={() => fileInputRef.current?.click()} className="p-3 bg-white rounded-full text-pink-400 hover:bg-pink-50 soft-3d-shadow transition-all"><Camera size={20} /></button>
            <button onClick={() => setShowStickers(!showStickers)} className={`p-3 bg-white rounded-full transition-all soft-3d-shadow ${showStickers ? 'bg-pink-100 text-pink-600' : 'text-pink-400 hover:bg-pink-50'}`}><Smile size={20} /></button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            <button onClick={handleEnhance} disabled={isEnhancing} className={`p-3 bg-white rounded-full text-pink-400 hover:bg-pink-50 soft-3d-shadow transition-all ${isEnhancing ? 'animate-pulse' : ''}`}><Sparkles size={20} /></button>
          </div>

          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full soft-3d-shadow">
            <button onClick={() => setVisibility('private')} className={`p-2 rounded-full transition-colors ${visibility === 'private' ? 'bg-pink-100 text-pink-600' : 'text-gray-400'}`}><Lock size={18} /></button>
            <button onClick={() => setVisibility('public')} className={`p-2 rounded-full transition-colors ${visibility === 'public' ? 'bg-pink-100 text-pink-600' : 'text-gray-400'}`}><Globe size={18} /></button>
          </div>

          <button onClick={handleSubmit} className="melody-gradient text-white px-8 py-3 rounded-full font-bold soft-3d-shadow hover:scale-105 active:scale-95 transition-all flex items-center space-x-2">
            <span>Post</span>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
