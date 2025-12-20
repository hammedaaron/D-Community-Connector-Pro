
import React, { useMemo } from 'react';
import { useApp } from '../App';
import UserCard from './UserCard';
import { Card } from '../types';

interface CardGridProps {
  folderId: string | null;
  onEditCard: (card: Card) => void;
}

const CardGrid: React.FC<CardGridProps> = ({ folderId, onEditCard }) => {
  const { cards, searchQuery } = useApp();

  const filteredCards = useMemo(() => {
    if (!folderId) return [];
    return cards
      .filter(c => c.folderId === folderId)
      .filter(c => 
        c.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.externalLink.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [cards, folderId, searchQuery]);

  if (!folderId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 dark:bg-slate-800">
          <svg className="w-10 h-10 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </div>
        <p className="text-lg font-bold text-slate-500">Select a community folder</p>
        <p className="text-sm">Choose a platform on the left to see members.</p>
      </div>
    );
  }

  if (filteredCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
        <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <svg className="w-12 h-12 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <p className="text-lg font-bold text-slate-600 dark:text-slate-400">No members found</p>
        <p className="text-sm text-center max-w-xs">
          {searchQuery ? `No results for "${searchQuery}" in this folder.` : "This folder is currently empty. Click 'Join Community' to be the first!"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {filteredCards.map(card => (
        <UserCard key={card.id} card={card} onEdit={() => onEditCard(card)} />
      ))}
    </div>
  );
};

export default CardGrid;
