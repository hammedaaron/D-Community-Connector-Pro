
import React, { useState } from 'react';
import { useApp } from '../App';

interface CreateProfileModalProps {
  onClose: () => void;
  onSubmit: (name: string, link: string) => void;
}

const CreateProfileModal: React.FC<CreateProfileModalProps> = ({ onClose, onSubmit }) => {
  const { currentUser, theme } = useApp();
  const [name, setName] = useState(currentUser?.name || '');
  const [link, setLink] = useState('');
  const isDark = theme === 'dark';

  const handlePost = () => {
    if (!name.trim() || !link.trim()) return;
    onSubmit(name.trim(), link.trim());
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`w-full max-w-lg overflow-hidden transform transition-all rounded-t-[3rem] sm:rounded-[3rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] animate-in slide-in-from-bottom-full duration-500 ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-100'}`}>
        <div className="px-10 py-8 flex items-center justify-between">
          <h3 className={`font-black text-2xl tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>Add Profile</h3>
          <button onClick={onClose} className={`p-3 rounded-2xl transition-all ${isDark ? 'hover:bg-slate-800 text-slate-500' : 'hover:bg-slate-100 text-slate-400'}`}>
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="px-10 pb-10 space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Display Identity</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Vitalik B."
                className={`w-full rounded-2xl px-6 py-4 text-base font-bold transition-all focus:ring-4 focus:ring-indigo-500/10 outline-none border ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-600' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'}`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Target Profile URL</label>
              <input 
                type="url" 
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://x.com/username"
                className={`w-full rounded-2xl px-6 py-4 text-base font-bold transition-all focus:ring-4 focus:ring-indigo-500/10 outline-none border ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-600' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'}`}
              />
            </div>
          </div>

          <div className={`p-6 rounded-2xl flex gap-4 items-center border ${isDark ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-700'}`}>
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-xs font-bold leading-relaxed">
              Your profile will be pinned in this community for others to discover and connect with you.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={onClose}
              className={`flex-1 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${isDark ? 'hover:bg-slate-800 text-slate-500' : 'hover:bg-slate-100 text-slate-500'}`}
            >
              Go Back
            </button>
            <button 
              onClick={handlePost}
              disabled={!name.trim() || !link.trim()}
              className="flex-1 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-2xl shadow-indigo-500/30 transition-all text-sm uppercase tracking-widest disabled:opacity-30 disabled:shadow-none hover:scale-[1.02] active:scale-95"
            >
              Add Profile
            </button>
          </div>
        </div>
        <div className="h-8 sm:hidden bg-transparent"></div>
      </div>
    </div>
  );
};

export default CreateProfileModal;
