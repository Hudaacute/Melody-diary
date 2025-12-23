
import React from 'react';
import { Heart, Star, Ribbon, User, Plus, Send, MessageCircle, Lock, Globe, Camera, Smile } from 'lucide-react';

export const STICKERS = [
  { type: 'heart', icon: <Heart className="text-pink-400 fill-pink-400" size={24} /> },
  { type: 'star', icon: <Star className="text-yellow-400 fill-yellow-400" size={24} /> },
  { type: 'ribbon', icon: <Ribbon className="text-pink-300" size={24} /> },
  { type: 'figure', icon: <Smile className="text-pink-500" size={24} /> },
] as const;

export const MY_MELODY_IMG = "https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?q=80&w=200&h=200&auto=format&fit=crop"; // Placeholder for My Melody vibe
