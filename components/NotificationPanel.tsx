
import React from 'react';
import { useApp } from '../App';
import { NotificationType } from '../types';

interface NotificationPanelProps {
  onClose?: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const { currentUser, notifications, markNotificationRead, setSelectedFolderId, cards, theme } = useApp();

  // Sort: STRICTLY Unread first, then by timestamp descending
  const userNotifications = [...notifications]
    .filter(n => n.recipientId === currentUser?.id)
    .sort((a, b) => {
      if (a.read !== b.read) return a.read ? 1 : -1;
      return b.timestamp - a.timestamp;
    });

  const unreadCount = userNotifications.filter(n => !n.read).length;
  const isDark = theme === 'dark';

  const handleNotificationClick = (notif: any) => {
    // 1. Mark as read immediately
    markNotificationRead(notif.id);
    
    // 2. Find the card we want to trace
    const targetCard = cards.find(c => c.id === notif.relatedCardId);
    
    if (targetCard) {
      // 3. Close the drawer first for a snappier feel
      if (onClose) onClose();

      // 4. Switch to the correct folder
      setSelectedFolderId(targetCard.folderId);
      
      // 5. Scroll and highlight after a short delay to allow the grid to render the new folder
      // We use a delay (400ms) to ensure the slide-out animation finishes 
      // and the new card is definitely in the DOM.
      setTimeout(() => {
        const el = document.getElementById(`card-${targetCard.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Apply a "Pulse" highlight effect
          el.classList.add('ring-4', 'ring-emerald-500', 'ring-offset-4', 'dark:ring-offset-slate-900', 'scale-105', 'z-50', 'transition-all', 'duration-500');
          
          // Remove highlight after 3 seconds
          setTimeout(() => {
            el.classList.remove('ring-4', 'ring-emerald-500', 'ring-offset-4', 'dark:ring-offset-slate-900', 'scale-105', 'z-50');
          }, 3000);
        } else {
          // Fallback if element not found immediately (sometimes React render takes an extra frame)
          setTimeout(() => {
            const retryEl = document.getElementById(`card-${targetCard.id}`);
            if (retryEl) {
              retryEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
              retryEl.classList.add('ring-4', 'ring-emerald-500', 'ring-offset-4', 'dark:ring-offset-slate-900', 'scale-105', 'z-50', 'transition-all', 'duration-500');
              setTimeout(() => {
                retryEl.classList.remove('ring-4', 'ring-emerald-500', 'ring-offset-4', 'dark:ring-offset-slate-900', 'scale-105', 'z-50');
              }, 3000);
            }
          }, 200);
        }
      }, 400);
    } else {
      // If card doesn't exist (maybe deleted?), just mark as read and close
      if (onClose) onClose();
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className={`p-6 border-b flex items-center justify-between sticky top-0 z-10 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <h2 className={`font-black text-xl flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Activity Hub
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">
              {unreadCount} NEW
            </span>
          )}
        </h2>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {userNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center h-full">
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest leading-relaxed">No activity yet. Join folders and connect with others to grow!</p>
          </div>
        ) : (
          <div className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
            {userNotifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`w-full p-6 cursor-pointer transition-all flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                  notif.read 
                    ? 'opacity-60 grayscale-[0.5]' 
                    : (isDark ? 'bg-indigo-500/10' : 'bg-indigo-50/40')
                }`}
              >
                <div className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center text-lg shadow-sm ${
                  notif.type === NotificationType.FOLLOW_BACK ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white'
                }`}>
                  {notif.type === NotificationType.FOLLOW_BACK ? '🤝' : '👋'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <span className={`font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{notif.senderName}</span> 
                    {" "}just followed you. Kindly follow them back.
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`font-black text-[10px] uppercase tracking-widest flex items-center gap-1 ${notif.read ? 'text-slate-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
                      Trace Member
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </span>
                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">
                      • {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                {!notif.read && (
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 mt-2 shrink-0 animate-pulse ring-4 ring-indigo-600/20"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {unreadCount > 0 && (
        <div className={`p-4 text-center border-t ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <button 
            onClick={() => userNotifications.forEach(n => !n.read && markNotificationRead(n.id))}
            className="text-[10px] font-black text-slate-400 hover:text-indigo-500 uppercase tracking-widest transition-colors"
          >
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
