
import React, { useMemo } from 'react';
import { Card } from '../types';
import { useApp } from '../App';

interface UserCardProps {
  card: Card;
  onEdit: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ card, onEdit }) => {
  const { currentUser, follows, toggleFollow, cards, isPoweredUp, theme, isAdmin, activeParty } = useApp();

  const isFollowed = follows.some(f => f.followerId === currentUser?.id && f.targetCardId === card.id);
  const isOwnCard = card.userId === currentUser?.id;
  const isDark = theme === 'dark';
  
  const followsMe = follows.some(f => {
    const myCardIds = cards.filter(c => c.userId === currentUser?.id).map(c => c.id);
    return f.followerId === card.userId && myCardIds.includes(f.targetCardId);
  });

  const isMutual = isFollowed && followsMe;

  // Stats calculation: Only within this community
  const stats = useMemo(() => {
    if (!activeParty) return { followers: 0, following: 0 };
    
    // People who follow this user's cards in this party
    const targetUserCards = cards.filter(c => c.userId === card.userId).map(c => c.id);
    const uniqueFollowers = new Set(
      follows
        .filter(f => targetUserCards.includes(f.targetCardId) && f.partyId === activeParty.id)
        .map(f => f.followerId)
    ).size;

    // People this user follows in this party
    const uniqueFollowing = new Set(
      follows
        .filter(f => f.followerId === card.userId && f.partyId === activeParty.id)
        .map(f => {
          const targetCard = cards.find(c => c.id === f.targetCardId);
          return targetCard?.userId;
        })
        .filter(id => id !== undefined)
    ).size;

    return { followers: uniqueFollowers, following: uniqueFollowing };
  }, [follows, card.userId, activeParty, cards]);

  const handleFollowToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFollowed) {
      if (window.confirm(`Are you sure you want to unfollow ${card.displayName}?`)) {
        toggleFollow(card.id);
      }
    } else {
      toggleFollow(card.id);
    }
  };
  
  return (
    <div 
      id={`card-${card.id}`}
      className={`relative rounded-[2rem] p-6 transition-all duration-300 flex flex-col h-full border z-10 ${
        isPoweredUp ? 'glass-card shimmer' : isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
      } ${
        isFollowed 
          ? 'scale-[0.98] border-indigo-500/30' 
          : 'hover:-translate-y-1 hover:shadow-xl hover:border-indigo-300'
      }`}
    >
      <div className="flex flex-col h-full relative z-20">
        <div className="flex items-start justify-between mb-4 overflow-hidden">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg border-2 shrink-0 transition-all ${
              isMutual 
                ? 'bg-emerald-500 text-white border-emerald-400 rotate-3 shadow-lg' 
                : isDark ? 'bg-slate-800 border-slate-700 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600'
            }`}>
              {card.displayName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className={`font-extrabold text-base leading-tight break-words whitespace-normal overflow-visible min-h-[1.5em] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {card.displayName}
              </h3>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {isMutual ? (
                  <div className="flex items-center gap-1 bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm">
                    <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" d="M5 13l4 4L19 7" /></svg>
                    Mutual
                  </div>
                ) : followsMe ? (
                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter flex items-center gap-1 ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-700'}`}>
                    Follows You
                  </span>
                ) : null}
              </div>
            </div>
          </div>
          
          {(isAdmin || isOwnCard) && (
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
            </button>
          )}
        </div>

        {/* Community Stats Bar */}
        <div className={`grid grid-cols-2 gap-2 mb-6 p-3 rounded-2xl border ${isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
          <div className="text-center border-r border-slate-200 dark:border-slate-800">
            <p className="text-[14px] font-black text-indigo-500 dark:text-indigo-400">{stats.followers}</p>
            <p className="text-[7px] font-black uppercase tracking-widest text-slate-400">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-[14px] font-black text-indigo-500 dark:text-indigo-400">{stats.following}</p>
            <p className="text-[7px] font-black uppercase tracking-widest text-slate-400">Following</p>
          </div>
        </div>

        <div className="mt-auto space-y-3">
          <a 
            href={card.externalLink} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`flex items-center justify-center gap-2 w-full py-3 px-4 text-xs font-black rounded-2xl transition-all border ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <span>Open Profile</span>
            <svg className="w-4 h-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </a>

          {!isOwnCard ? (
            <button 
              onClick={handleFollowToggle}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-black transition-all shadow-lg border-2 ${
                isFollowed 
                  ? 'bg-emerald-500 border-emerald-400 text-white' 
                  : 'bg-indigo-600 border-indigo-500 hover:bg-indigo-700 text-white'
              }`}
            >
              {isFollowed ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                  <span>{isMutual ? 'Mutual Connection' : 'Followed'}</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                  <span>{followsMe ? 'Follow Back' : 'Connect Now'}</span>
                </>
              )}
            </button>
          ) : (
            <div className={`w-full text-center py-3 px-4 text-[10px] font-black rounded-2xl uppercase tracking-widest border border-dashed ${isDark ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-indigo-50 border-indigo-200 text-indigo-600'}`}>
              Your Identity
            </div>
          )}
        </div>
      </div>
      
      {isFollowed && !isMutual && (
        <div className="absolute top-4 right-4 z-30">
          <span className="flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
          </span>
        </div>
      )}
    </div>
  );
};

export default UserCard;
