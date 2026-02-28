import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bug, Droplet } from 'lucide-react';

export default function WhackABug({ onWin }: { onWin: () => void }) {
  const [score, setScore] = useState(0);
  const [holes, setHoles] = useState<{ active: boolean, type: 'bug'|'dropli', id: number }[]>(
    Array(9).fill(null).map((_, i) => ({ active: false, type: 'bug', id: i }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setHoles(prev => {
        const inactive = prev.filter(h => !h.active);
        if (inactive.length === 0) return prev;
        
        const randomHole = inactive[Math.floor(Math.random() * inactive.length)];
        const isBug = Math.random() > 0.25; // 75% bug, 25% dropli
        
        const next = [...prev];
        next[randomHole.id] = { active: true, type: isBug ? 'bug' : 'dropli', id: randomHole.id };
        
        // Auto-hide after 800ms
        setTimeout(() => {
          setHoles(current => {
            const c = [...current];
            if (c[randomHole.id].active) {
              c[randomHole.id] = { ...c[randomHole.id], active: false };
            }
            return c;
          });
        }, 800);
        
        return next;
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const tapHole = (id: number, type: 'bug'|'dropli', active: boolean) => {
    if (!active) return;
    
    setHoles(prev => {
      const next = [...prev];
      next[id] = { ...next[id], active: false };
      return next;
    });

    if (type === 'bug') {
      const newScore = score + 5;
      if (newScore >= 100) {
        setScore(100);
        setTimeout(onWin, 300);
      } else {
        setScore(newScore);
      }
    } else {
      setScore(s => Math.max(0, s - 20));
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[300px] mx-auto space-y-6">
      <div className="text-3xl font-bold text-blue-600 bg-white px-6 py-2 rounded-full shadow-sm">
        {score}%
      </div>
      
      <div className="grid grid-cols-3 gap-3 w-full bg-green-100 p-4 rounded-3xl shadow-inner">
        {holes.map(hole => (
          <div key={hole.id} className="aspect-square bg-green-800/20 rounded-full relative overflow-hidden flex items-center justify-center">
            <AnimatePresence>
              {hole.active && (
                <motion.button
                  initial={{ y: 50 }}
                  animate={{ y: 0 }}
                  exit={{ y: 50 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => tapHole(hole.id, hole.type, hole.active)}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {hole.type === 'bug' ? (
                    <Bug className="w-12 h-12 text-green-700 fill-green-500 drop-shadow-md" />
                  ) : (
                    <Droplet className="w-12 h-12 text-blue-500 fill-blue-300 drop-shadow-md" />
                  )}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      
      <p className="text-sm text-gray-500 text-center px-4">
        Atrapa los bichos, ¡pero no toques a las gotas!
      </p>
    </div>
  );
}
