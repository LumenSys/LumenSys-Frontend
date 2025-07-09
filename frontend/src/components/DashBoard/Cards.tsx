import React from 'react';

interface CardItem {
  title: string;
  value: string | number;
  bgColor: string;
  icon: React.ReactNode;
}

interface CardsProps {
  cards: CardItem[];
}

export default function Cards({ cards }: CardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {cards.map((card, index) => (
        <div key={index} className="bg-surface rounded-lg shadow p-6 flex flex-col justify-between">
          <span className="text-textSecondary text-lg font-semibold mb-2">{card.title}</span>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-textPrimary">{card.value}</span>
            <div className={`w-14 h-14 ${card.bgColor} rounded-md flex items-center justify-center text-background`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 