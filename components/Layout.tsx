
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../App';
import FolderSidebar from './FolderSidebar';
import NotificationPanel from './NotificationPanel';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  onOpenCreateProfile: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onOpenCreateProfile }) => {
  const { 
    currentUser, theme, setTheme, isPoweredUp, 
    selectedFolderId, folders, searchQuery, setSearchQuery, notifications,
    activeParty, isDev, cards, isWorkflowMode, setIsWorkflowMode
  } = useApp();
  
  const [activeTab, setActiveTab] = useState<'folders' | 'community'>('community');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const unreadNotifications = notifications.filter(n => n.recipientId === currentUser?.id && !n.read).length;
  const currentFolderName = folders.find(f => f.id === selectedFolderId)?.name || 'Communities';
  const isDark = theme === 'dark';

  const userHasProfile = cards.some(c => c.userId === currentUser?.id && c.folderId === selectedFolderId);
  const isCreationDisabled = userHasProfile && currentUser?.role !== UserRole.DEV;

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    const handleScroll = () => { setShowScrollTop(scrollContainer.scrollTop > 400); };
    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => { scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <div className={`flex h-screen overflow-hidden transition-all duration-500 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} flex-col lg:flex-row`}>
      {isPoweredUp && <div className="fixed inset-0 power-up-bg opacity-10 z-0 pointer-events-none" />}
      <div className={`${activeTab === 'folders' ? 'flex' : 'hidden'} lg:flex h-full z-20`}>
        <FolderSidebar onSelect={() => setActiveTab('community')} />
      </div>
      <main className={`flex-1 flex flex-col h-full overflow-hidden z-10 relative ${activeTab !== 'community' ? 'hidden lg:flex' : 'flex'}`}>
        <header className={`px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-40 transition-all ${isDark ? 'bg-slate-900/60' : 'bg-white/80'} backdrop-blur-xl border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-4 lg:gap-8 flex-1">
            <h1 className="text-xl lg:text-2xl font-extrabold tracking-tight truncate max-w-[200px]">
              {currentFolderName}
              <span className="ml-2 text-[10px] bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-full font-black uppercase tracking-widest border border-indigo-500/20 hidden sm:inline-block">
                {activeParty?.name}
              </span>
            </h1>
            <div className="flex-1 max-w-sm relative hidden sm:block">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </span>
              <input type="text" placeholder="Search community..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`w-full border-none rounded-2xl pl-11 pr-4 py-3 text-sm focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none ${isDark ? 'bg-slate-800 text-white placeholder-slate-500' : 'bg-slate-100 text-slate-900 placeholder-slate-400'}`} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isDev && (
              <button 
                onClick={() => setIsWorkflowMode(!isWorkflowMode)}
                className={`p-2.5 rounded-xl transition-all border-2 ${isWorkflowMode ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                title="Design Canvas"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
              </button>
            )}
            <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className={`p-2.5 rounded-xl transition-all ${isDark ? 'bg-slate-800 text-amber-400' : 'bg-slate-100 text-slate-500 hover:text-indigo-600'}`}>
              {isDark ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.071 16.071l.707.707M7.929 7.929l.707-.707M12 8a4 4 0 110 8 4 4 0 010-8z" /></svg> : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
            </button>
            <button onClick={() => setIsNotifOpen(true)} className={`p-2.5 rounded-xl transition-all relative ${isNotifOpen ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              {unreadNotifications > 0 && <span className="absolute -top-1 -right-1 flex h-5 w-5 pointer-events-none"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 border-2 border-white dark:border-slate-900 text-[9px] font-black items-center justify-center text-white">{unreadNotifications}</span></span>}
            </button>
            <button onClick={isCreationDisabled ? undefined : onOpenCreateProfile} disabled={isCreationDisabled} className={`${isCreationDisabled ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-300 dark:border-slate-700' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20'} px-5 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2`} title={isCreationDisabled ? "Limit Reached" : "Join community"}><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d={isCreationDisabled ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"} /></svg><span className="hidden sm:inline uppercase tracking-widest">{isCreationDisabled ? 'Joined' : 'Join'}</span></button>
          </div>
        </header>
        <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 pb-32">
          {children}
        </div>
        <button onClick={scrollToTop} className={`fixed bottom-28 lg:bottom-10 right-6 lg:right-10 p-4 rounded-full shadow-2xl transition-all duration-500 z-[100] border-2 group ${showScrollTop ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-50 pointer-events-none'} ${isDev ? 'bg-emerald-500 border-emerald-400 text-white shadow-emerald-500/20' : 'bg-indigo-600 border-indigo-500 text-white shadow-indigo-500/20'}`} aria-label="Scroll to top"><svg className="w-6 h-6 transform group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg></button>
      </main>
      <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isNotifOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsNotifOpen(false)}><div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" /><div className={`absolute top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-500 ease-out ${isNotifOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={(e) => e.stopPropagation()}><NotificationPanel onClose={() => setIsNotifOpen(false)} /></div></div>
      <nav className={`lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-4 flex gap-10 items-center rounded-3xl z-40 transition-all shadow-2xl border ${isDark ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-slate-100'} backdrop-blur-xl`}>
        <button onClick={() => setActiveTab('folders')} className={`p-1 ${activeTab === 'folders' ? 'text-indigo-500' : 'text-slate-400'}`}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg></button>
        <button onClick={isCreationDisabled ? undefined : onOpenCreateProfile} className={`p-4 -mt-10 rounded-2xl text-white shadow-xl transition-all ${isCreationDisabled ? 'bg-slate-400 opacity-50' : 'bg-indigo-600 shadow-indigo-500/40'} ${activeTab === 'community' && !isCreationDisabled ? 'scale-110' : ''}`}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={isCreationDisabled ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"} /></svg></button>
        <button onClick={() => setIsNotifOpen(true)} className={`p-1 relative ${isNotifOpen ? 'text-indigo-500' : 'text-slate-400'}`}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>{unreadNotifications > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />}</button>
      </nav>
    </div>
  );
};

export default Layout;
