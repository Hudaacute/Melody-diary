
import React from 'react';
import { UserProfile } from '../types';
import { Shield, Eye, Trash2, Clock } from 'lucide-react';

interface AdminDashboardProps {
  users: UserProfile[];
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-[40px] soft-3d-shadow overflow-hidden flex flex-col max-h-[80vh]">
        <div className="melody-gradient p-6 flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <Shield size={24} />
            <h2 className="text-xl font-black uppercase tracking-widest">Secret Admin Hub</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <Eye size={20} className="rotate-180" />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-pink-50 text-pink-300 text-xs uppercase font-bold">
                <th className="py-4 px-2">User</th>
                <th className="py-4 px-2">Email</th>
                <th className="py-4 px-2">Last Active</th>
                <th className="py-4 px-2">Status</th>
                <th className="py-4 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                  <td className="py-4 px-2 flex items-center space-x-3">
                    <img src={u.pfp} className="w-8 h-8 rounded-full border border-pink-100" />
                    <span className="font-bold text-pink-700">{u.username}</span>
                  </td>
                  <td className="py-4 px-2 text-sm text-gray-500">{u.email}</td>
                  <td className="py-4 px-2 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock size={12} />
                      <span>{u.lastActive}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-600 text-[10px] font-bold">ACTIVE</span>
                  </td>
                  <td className="py-4 px-2">
                    <button className="text-red-300 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
