import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

const COLORS = [
  'bg-red-400',
  'bg-green-400',
  'bg-blue-400',
  'bg-yellow-400'
];
const ACTIVE_COLORS = [
  'bg-red-300 shadow-[0_0_20px_rgba(248,113,113,0.8)]',
  'bg-green-300 shadow-[0_0_20px_rgba(74,222,128,0.8)]',
  'bg-blue-300 shadow-[0_0_20px_rgba(96,165,250,0.8)]',
  'bg-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.8)]'
];

export default function SimonSays({ onWin }: { onWin: () => void }) {
  const [score, setScore] = useState(0);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerStep, setPlayerStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeBtn, setActiveBtn] = useState<number | null>(null);

  const playSequence = async (seq: number[]) => {
    setIsPlaying(true);
    await new Promise(r => setTimeout(r, 500));
    for (let i = 0; i < seq.length; i++) {
      setActiveBtn(seq[i]);
      await new Promise(r => setTimeout(r, 400));
      setActiveBtn(null);
      await new Promise(r => setTimeout(r, 200));
    }
    setIsPlaying(false);
  };

  const nextLevel = () => {
    const nextSeq = [...sequence, Math.floor(Math.random() * 4)];
    setSequence(nextSeq);
    setPlayerStep(0);
    playSequence(nextSeq);
  };

  useEffect(() => {
    nextLevel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTap = (idx: number) => {
    if (isPlaying) return;
    
    setActiveBtn(idx);
    setTimeout(() => setActiveBtn(null), 200);

    if (idx === sequence[playerStep]) {
      const nextStep = playerStep + 1;
      if (nextStep === sequence.length) {
        const newScore = score + 20;
        if (newScore >= 100) {
          setScore(100);
          setTimeout(onWin, 500);
        } else {
          setScore(newScore);
          setTimeout(nextLevel, 1000);
        }
      } else {
        setPlayerStep(nextStep);
      }
    } else {
      setScore(s => Math.max(0, s - 20));
      setPlayerStep(0);
      setTimeout(() => playSequence(sequence), 1000);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[280px] mx-auto space-y-8">
      <div className="text-3xl font-bold text-blue-600 bg-white px-6 py-2 rounded-full shadow-sm">
        {score}%
      </div>
      
      <div className="grid grid-cols-2 gap-4 w-full aspect-square">
        {[0, 1, 2, 3].map(i => (
          <motion.button
            key={i}
            whileTap={!isPlaying ? { scale: 0.9 } : {}}
            onClick={() => handleTap(i)}
            className={`rounded-3xl transition-all duration-200 ${
              activeBtn === i ? ACTIVE_COLORS[i] : COLORS[i]
            } ${isPlaying ? 'cursor-default' : 'cursor-pointer'}`}
          />
        ))}
      </div>
      
      <p className="text-sm text-gray-500 text-center px-4">
        Repite la secuencia de colores.
      </p>
    </div>
  );
}
