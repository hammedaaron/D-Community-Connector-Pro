
import React, { useState } from 'react';
import { useApp } from '../App';
import { UserRole } from '../types';
import { optimizeIdentity } from '../services/gemini';

interface CreateProfileModalProps {
  onClose: () => void;
  onSubmit: (name: string, link: string) => void;
}

const CreateProfileModal: React.FC<CreateProfileModalProps> = ({ onClose, onSubmit }) => {
  const { currentUser, theme, cards, selectedFolderId, showToast } = useApp();
  const [name, setName] = useState(currentUser?.name || '');
  const [link, setLink] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const isDark = theme === 'dark';

  const alreadyHasProfile = cards.some(c => c.userId === currentUser?.id && c.folderId === selectedFolderId);
  const isPrivileged = currentUser?.role === UserRole.DEV;
  const isEnforced = alreadyHasProfile && !isPrivileged;

  const handlePost = () => {
    if (isEnforced) return;
    if (!name.trim() || !link.trim()) return;
    let cleanLink = link.trim();
    if (!cleanLink.startsWith('http://') && !cleanLink.startsWith('https://')) cleanLink = `https://${cleanLink}`;
    onSubmit(name.trim(), cleanLink);
  };

  const handleOptimize = async () => {
    if (!link.trim()) {
      showToast("Enter a link first to optimize your identity.", "error");
      return;
    }
    setIsOptimizing(true);
    try {
      const bestName = await optimizeIdentity(name, link);
      setName(bestName);
      showToast("Identity Enhanced with AI ✨");
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`w-full max-w-lg overflow-hidden transform transition-all rounded-t-[2.5rem] sm:rounded-[3rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] animate-in slide-in-from-bottom-full duration-500 ${isDark ? 'bg-slate-900 border-t sm:border border-slate-800' : 'bg-white border-t sm:border border-slate-100'}`}>
        {/* Mobile Pull Handle */}
        <div className="sm:hidden flex justify-center py-3">
          <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full opacity-50" />
        </div>

        <div className="px-8 sm:px-10 py-4 sm:py-8 flex items-center justify-between">
          <h3 className={`font-black text-xl sm:text-2xl tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>{isEnforced ? 'Profile Exists' : 'Establish Node'}</h3>
          <button onClick={onClose} className={`p-3 rounded-2xl transition-all ${isDark ? 'hover:bg-slate-800 text-slate-500' : 'hover:bg-slate-100 text-slate-400'}`}>
            <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="px-8 sm:px-10 pb-10 sm:pb-12 space-y-6 sm:space-y-8">
          {isEnforced ? (
            <div className={`p-6 sm:p-8 rounded-[2rem] border text-center space-y-4 ${isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-100'}`}>
              <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-red-500/20">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <p className="text-sm font-bold text-slate-500 leading-relaxed">Each member is limited to one profile per community. Edit your existing card to update details.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2 relative">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Display Identity</label>
                <div className="relative">
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Vitalik B." className={`w-full rounded-2xl px-5 sm:px-6 py-4 text-sm sm:text-base font-bold transition-all focus:ring-4 focus:ring-indigo-500/10 outline-none border ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-600' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'}`} />
                  <button onClick={handleOptimize} disabled={isOptimizing} className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-500 hover:text-white rounded-xl transition-all disabled:opacity-30" title="Optimize with AI">
                    {isOptimizing ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.586 15.586a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM16 11a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1z" /></svg>}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Target Profile URL</label>
                <input type="text" value={link} onChange={(e) => setLink(e.target.value)} placeholder="x.com/username" className={`w-full rounded-2xl px-5 sm:px-6 py-4 text-sm sm:text-base font-bold transition-all focus:ring-4 focus:ring-indigo-500/10 outline-none border ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-600' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'}`} />
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-4 pb-4">
            {!isEnforced && (
              <button onClick={handlePost} disabled={!name.trim() || !link.trim() || isOptimizing} className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-2xl shadow-indigo-500/30 transition-all text-sm uppercase tracking-[0.2em] disabled:opacity-30">
                {isPrivileged ? 'Establish Node' : 'Add Profile'}
              </button>
            )}
            <button onClick={onClose} className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isDark ? 'hover:bg-slate-800 text-slate-500' : 'hover:bg-slate-100 text-slate-500'}`}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProfileModal;
