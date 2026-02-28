import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Droplet, Bug } from 'lucide-react';

export default function CatchDrops({ onWin }: { onWin: () => void }) {
  const [score, setScore] = useState(0);
  const [items, setItems] = useState<{id: number, x: number, type: 'good'|'bad'}[]>([]);

  // Spawn items
  useEffect(() => {
    const interval = setInterval(() => {
      setItems(prev => [...prev, {
        id: Date.now(),
        x: Math.random() * 80 + 10, // Keep within 10% to 90% width
        type: Math.random() > 0.3 ? 'good' : 'bad'
      }]);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  // Cleanup items that fell out of bounds
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setItems(prev => prev.filter(item => now - item.id < 4000));
    }, 1000);
    return () => clearInterval(cleanup);
  }, []);

  const tapItem = (id: number, type: 'good'|'bad') => {
    setItems(prev => prev.filter(item => item.id !== id));
    if (type === 'good') {
      const newScore = score + 5;
      if (newScore >= 100) {
        setScore(100);
        setTimeout(onWin, 300);
      } else {
        setScore(newScore);
      }
    } else {
      setScore(s => Math.max(0, s - 25));
    }
  };

  return (
    <div className="relative w-full h-[400px] bg-gradient-to-b from-blue-50 to-blue-100 rounded-3xl overflow-hidden border-2 border-blue-200 shadow-inner">
      <div className="absolute top-4 left-4 font-bold text-blue-600 z-10 bg-white/60 px-3 py-1 rounded-full backdrop-blur-sm">
        {score}%
      </div>
      
      {items.map(item => (
        <motion.div
          key={item.id}
          initial={{ y: -50 }}
          animate={{ y: 450 }}
          transition={{ duration: 2.5, ease: 'linear' }}
          className="absolute cursor-pointer p-2 active:scale-90 transition-transform"
          style={{ left: `${item.x}%` }}
          onPointerDown={() => tapItem(item.id, item.type)}
        >
          {item.type === 'good' ? (
            <Droplet className="w-10 h-10 text-blue-500 fill-blue-300 drop-shadow-md" />
          ) : (
            <Bug className="w-10 h-10 text-green-600 fill-green-300 drop-shadow-md" />
          )}
        </motion.div>
      ))}
    </div>
  );
}
