
import React, { useMemo } from 'react';
import { useApp } from '../App';
import { NotificationType, AppNotification } from '../types';

interface NotificationPanelProps {
  onClose?: () => void;
}

// Helper to aggregate notifications
interface AggregatedNotification extends AppNotification {
  count: number;
  allIds: string[];
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const { currentUser, notifications, markNotificationRead, setSelectedFolderId, cards, theme } = useApp();

  // Aggregate notifications by sender and type
  const aggregatedNotifications = useMemo(() => {
    const groups = new Map<string, AggregatedNotification>();
    
    // Sort raw notifications by timestamp first
    const sortedRaw = [...notifications]
      .filter(n => n.recipientId === currentUser?.id)
      .sort((a, b) => b.timestamp - a.timestamp);

    sortedRaw.forEach(n => {
      const key = `${n.senderId}_${n.type}`;
      if (!groups.has(key)) {
        groups.set(key, { ...n, count: 1, allIds: [n.id] });
      } else {
        const existing = groups.get(key)!;
        existing.count++;
        existing.allIds.push(n.id);
        // If any notification in the stack is unread, the stack is unread
        if (!n.read) existing.read = false;
      }
    });
    
    return Array.from(groups.values()).sort((a, b) => {
      if (a.read !== b.read) return a.read ? 1 : -1;
      return b.timestamp - a.timestamp;
    });
  }, [notifications, currentUser?.id]);

  const unreadCount = aggregatedNotifications.filter(n => !n.read).length;
  const isDark = theme === 'dark';

  const handleNotificationClick = async (notif: AggregatedNotification) => {
    // RULE ENFORCEMENT: Clicking no longer marks as read automatically.
    // Read status is only updated when follow-back is complete.
    
    const targetCard = cards.find(c => c.id === notif.relatedCardId);
    
    if (targetCard) {
      if (onClose) onClose();
      setSelectedFolderId(targetCard.folderId);
      
      let attempts = 0;
      const findAndHighlight = () => {
        const el = document.getElementById(`card-${targetCard.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const highlightClasses = [
            'ring-8', 'ring-emerald-500/50', 'ring-offset-4', 
            'dark:ring-offset-slate-950', 'scale-105', 'z-50', 
            'transition-all', 'duration-700', 'shadow-[0_0_50px_rgba(16,185,129,0.4)]'
          ];
          el.classList.add(...highlightClasses);
          setTimeout(() => el.classList.remove(...highlightClasses), 3500);
        } else if (attempts < 20) {
          attempts++;
          setTimeout(findAndHighlight, 100);
        }
      };
      setTimeout(findAndHighlight, 150);
    } else if (onClose) {
      onClose();
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
        {aggregatedNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center h-full">
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest leading-relaxed">No activity yet. Join folders and connect with others to grow!</p>
          </div>
        ) : (
          <div className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
            {aggregatedNotifications.map(notif => (
              <div
                key={`${notif.senderId}_${notif.type}`}
                onClick={() => handleNotificationClick(notif)}
                className={`w-full p-6 cursor-pointer transition-all flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                  notif.read 
                    ? 'opacity-60' 
                    : (isDark ? 'bg-indigo-500/10' : 'bg-indigo-50/40')
                }`}
              >
                <div className="relative shrink-0">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg shadow-sm ${
                    notif.type === NotificationType.FOLLOW_BACK ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white'
                  }`}>
                    {notif.type === NotificationType.FOLLOW_BACK ? '🤝' : '👋'}
                  </div>
                  {notif.count > 1 && (
                    <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border-2 border-white dark:border-slate-900 shadow-sm">
                      x{notif.count}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <span className={`font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{notif.senderName}</span> 
                    {notif.count > 1 ? ` followed you in ${notif.count} communities.` : " just followed you."}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`font-black text-[10px] uppercase tracking-widest flex items-center gap-1 ${notif.read ? 'text-slate-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
                      Trace to Connect
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
    </div>
  );
};

export default NotificationPanel;
