import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Cloud, Sun, CloudRain, Snowflake, Wind, Zap, Droplet, Moon, Star } from 'lucide-react';

const ICONS = [Sun, CloudRain, Snowflake, Wind, Zap, Droplet, Moon, Star];

export default function MemoryClouds({ onWin }: { onWin: () => void }) {
  const [cards, setCards] = useState<{id: number, icon: any, isFlipped: boolean, isMatched: boolean}[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);

  useEffect(() => {
    const deck = [...ICONS, ...ICONS].map((icon, i) => ({
      id: i,
      icon,
      isFlipped: false,
      isMatched: false
    })).sort(() => Math.random() - 0.5);
    setCards(deck);
  }, []);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (newCards[first].icon === newCards[second].icon) {
        // Match found
        setTimeout(() => {
          const matchedCards = [...newCards];
          matchedCards[first].isMatched = true;
          matchedCards[second].isMatched = true;
          setCards(matchedCards);
          setFlippedIndices([]);
          
          const newMatches = matches + 1;
          setMatches(newMatches);
          if (newMatches === ICONS.length) {
            setTimeout(onWin, 600);
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[first].isFlipped = false;
          resetCards[second].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="grid grid-cols-4 gap-2 w-full max-w-[320px] mx-auto">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCardClick(i)}
            className={`aspect-square rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 ${
              card.isFlipped || card.isMatched 
                ? 'bg-white shadow-sm border border-gray-100 rotate-y-180' 
                : 'bg-blue-300 shadow-md hover:bg-blue-400'
            }`}
          >
            {card.isFlipped || card.isMatched ? (
              <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}>
                <Icon className={`w-8 h-8 ${card.isMatched ? 'text-green-400' : 'text-blue-500'}`} />
              </motion.div>
            ) : (
              <Cloud className="w-8 h-8 text-white/80" />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
