
import React, { useMemo } from 'react';
import { useApp } from '../App';
import UserCard from './UserCard';
import { Card } from '../types';

interface CardGridProps {
  folderId: string | null;
  onEditCard: (card: Card) => void;
}

const CardGrid: React.FC<CardGridProps> = ({ folderId, onEditCard }) => {
  const { cards, searchQuery, currentUser, instructions, theme } = useApp();
  const isDark = theme === 'dark';

  const folderCards = useMemo(() => {
    if (!folderId) return [];
    return cards.filter(c => c.folderId === folderId);
  }, [cards, folderId]);

  const folderInstructions = useMemo(() => {
    if (!folderId) return [];
    return instructions.filter(i => i.folderId === folderId);
  }, [instructions, folderId]);

  const filteredCards = useMemo(() => {
    const filtered = folderCards.filter(c => 
      c.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.externalLink.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return [...filtered].sort((a, b) => {
      const isAOwn = a.userId === currentUser?.id;
      const isBOwn = b.userId === currentUser?.id;
      if (isAOwn && !isBOwn) return -1;
      if (!isAOwn && isBOwn) return 1;
      return b.timestamp - a.timestamp;
    });
  }, [folderCards, searchQuery, currentUser?.id]);

  const renderInstructionContent = (text: any) => {
    const contentStr = typeof text === 'string' ? text : String(text || '');
    const parts = contentStr.split('\n');
    const boldRegex = /\*\*(.*?)\*\*/g;

    return parts.map((line, i) => {
      // MASTER STYLE: H2 is Mystic Green
      if (line.trim().startsWith('## ')) {
        return <h2 key={i} className="text-[#00ff9d] text-2xl font-black mb-4 mt-6 first:mt-0 tracking-tighter uppercase">{line.replace('## ', '').trim()}</h2>;
      }
      const segments = line.split(boldRegex);
      const formatted = segments.map((segment, index) => {
        // MASTER STYLE: Bold is Mystic Blue
        if (index % 2 === 1) return <b key={index} className="text-[#2563eb] dark:text-[#60a5fa] font-black">{segment}</b>;
        return segment;
      });
      return <p key={i} className="text-sm leading-relaxed mb-2 opacity-90 font-medium">{formatted}</p>;
    });
  };

  if (!folderId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 dark:bg-slate-800">
          <svg className="w-10 h-10 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
        </div>
        <p className="text-lg font-bold text-slate-500">Select a community folder</p>
      </div>
    );
  }

  const hasWorkflow = folderCards.some(c => c.x !== undefined && c.y !== undefined) || folderInstructions.length > 0;

  if (hasWorkflow) {
    return (
      <div className="relative w-full min-h-[1800px]">
        {folderInstructions.map(box => (
          <div 
            key={box.id}
            className={`absolute p-10 rounded-[3rem] border-2 shadow-2xl z-10 ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white/80 border-slate-100 backdrop-blur-md'}`}
            style={{ left: box.x, top: box.y, width: `${box.width}px` }}
          >
            {renderInstructionContent(box.content)}
          </div>
        ))}

        {filteredCards.map(card => {
          const isPositioned = card.x !== undefined && card.y !== undefined;
          return (
            <div 
              key={card.id}
              className={`${isPositioned ? 'absolute z-20 transition-all' : 'inline-block mr-8 mb-8'}`}
              style={isPositioned ? { left: card.x, top: card.y, width: '280px' } : { width: '280px' }}
            >
              <UserCard card={card} onEdit={() => onEditCard(card)} />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 lg:gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {filteredCards.map(card => (
        <UserCard key={card.id} card={card} onEdit={() => onEditCard(card)} />
      ))}
    </div>
  );
};

export default CardGrid;
