
import React from 'react';
import { useApp } from '../App';

interface UserDocsProps {
  onClose: () => void;
}

const UserDocs: React.FC<UserDocsProps> = ({ onClose }) => {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar rounded-[3rem] border shadow-2xl transition-all animate-in zoom-in-95 duration-500 ${isDark ? 'bg-slate-900 border-emerald-500/30 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
        
        <header className={`sticky top-0 z-10 p-8 flex items-center justify-between border-b backdrop-blur-md ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-100'}`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tighter uppercase">Member Handbook</h2>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">How to Connect & Grow</p>
            </div>
          </div>
          <button onClick={onClose} className={`p-3 rounded-2xl transition-all ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>

        <div className="p-8 lg:p-12 space-y-16">
          
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-widest">01: Entry</div>
              <h3 className="text-3xl font-black tracking-tight">Accessing the Hub</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Communities are gated by <strong>Membership Names</strong>. You only need the Hub Name and your personal credentials to enter.
              </p>
              <div className={`p-6 rounded-3xl border-2 border-dashed ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="space-y-3">
                  <div className="h-4 w-24 bg-indigo-500/20 rounded-full"></div>
                  <div className={`h-10 w-full rounded-xl border flex items-center px-4 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <span className="text-xs font-black opacity-30 uppercase tracking-widest">Biz-High-Ranker</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
               <div className="p-8 rounded-[3rem] bg-indigo-600 text-white shadow-2xl rotate-3">
                 <h4 className="font-black text-xl mb-2">Join Folder</h4>
                 <p className="text-xs opacity-80 font-bold mb-4">Add your social link to become visible to other members.</p>
                 <div className="h-10 w-full bg-white/20 rounded-xl"></div>
               </div>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="lg:order-2 space-y-6">
              <div className="inline-flex px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest">02: Safety</div>
              <h3 className="text-3xl font-black tracking-tight">The Verification Rule</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                To prevent bot-spam and ensure real connections, you <strong>MUST</strong> click "Open Profile" and view a member's page before the "Connect" button unlocks.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm font-bold text-slate-500">
                  <span className="text-emerald-500 font-black">✔</span> Click Open Profile
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-slate-500">
                  <span className="text-emerald-500 font-black">✔</span> Verify the account
                </li>
                <li className="flex items-center gap-3 text-sm font-bold text-slate-500">
                  <span className="text-emerald-500 font-black">✔</span> Click Connect Now
                </li>
              </ul>
            </div>
            <div className="lg:order-1 flex justify-center">
               <div className={`p-8 rounded-[3rem] border-4 border-amber-500/30 ${isDark ? 'bg-slate-900 shadow-2xl' : 'bg-white shadow-xl'}`}>
                  <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 mb-4 animate-pulse"></div>
                  <div className="space-y-2 mb-6">
                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                    <div className="h-3 w-48 bg-slate-100 dark:bg-slate-800/50 rounded-full"></div>
                  </div>
                  <div className="p-4 bg-amber-500 text-white rounded-2xl font-black text-center text-xs tracking-widest uppercase shadow-lg shadow-amber-500/20">
                    LOCKED: VIEW PROFILE FIRST
                  </div>
               </div>
            </div>
          </section>

          <section className="space-y-8">
            <div className="text-center space-y-3">
              <h3 className="text-3xl font-black tracking-tight">Trace to Connect</h3>
              <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Persistent Handshakes</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className={`p-8 rounded-[2.5rem] border shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                  <div className="text-3xl mb-4">🔔</div>
                  <h4 className="text-xl font-black mb-3">Persistent Traces</h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    When someone follows you, a notification appears. It <strong>won't disappear</strong> until you follow them back. No one is ever lost in the scroll.
                  </p>
               </div>
               <div className={`p-8 rounded-[2.5rem] border shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                  <div className="text-3xl mb-4">🤝</div>
                  <h4 className="text-xl font-black mb-3">Mutual Status</h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Once both parties have connected, your card displays a "MUTUAL" badge. This confirms a successful, high-value connection.
                  </p>
               </div>
            </div>
          </section>

          <footer className="pt-8 text-center border-t border-slate-100 dark:border-slate-800">
             <button 
              onClick={onClose}
              className="px-12 py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-2xl shadow-emerald-500/30 transition-all uppercase tracking-widest text-sm"
             >
               Ready to Connect
             </button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default UserDocs;
