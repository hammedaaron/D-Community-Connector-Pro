
import React, { useState } from 'react';
import { Card } from '../types';
import { useApp } from '../App';

interface EditProfileModalProps {
  card: Card;
  onClose: () => void;
  onUpdate: (id: string, name: string, link: string) => void;
  onDelete: (id: string) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ card, onClose, onUpdate, onDelete }) => {
  const { theme, isAdmin, currentUser } = useApp();
  const [name, setName] = useState(card.displayName);
  const [link, setLink] = useState(card.externalLink);
  const isDark = theme === 'dark';
  
  const isOwn = card.userId === currentUser?.id;

  const handleUpdate = () => {
    if (!name.trim() || !link.trim()) return;
    onUpdate(card.id, name.trim(), link.trim());
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`w-full max-w-lg p-8 rounded-[3rem] shadow-2xl border animate-in slide-in-from-bottom-8 duration-500 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className={`font-black text-2xl tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {isOwn ? 'Edit Your Card' : 'Admin: Management'}
            </h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
              Updating Identity in {card.folderId}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-indigo-500 transition-colors">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-2">Display Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-6 py-4 rounded-2xl font-bold outline-none border transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'}`}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-2">Social Link</label>
            <input 
              type="url" 
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className={`w-full px-6 py-4 rounded-2xl font-bold outline-none border transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-500'}`}
            />
          </div>

          <div className="flex flex-col gap-4 pt-4">
            <button 
              onClick={handleUpdate}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 transition-all text-sm uppercase tracking-widest"
            >
              Save Changes
            </button>
            <button 
              onClick={() => onDelete(card.id)}
              className={`w-full py-4 text-xs font-black uppercase tracking-widest border border-dashed rounded-2xl transition-all ${isDark ? 'border-red-500/30 text-red-500 hover:bg-red-500/10' : 'border-red-200 text-red-500 hover:bg-red-50'}`}
            >
              Delete This Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
