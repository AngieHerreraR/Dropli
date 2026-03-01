import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Star } from 'lucide-react';

interface Props {
  level: number;
  isEvolution: boolean;
  onComplete: () => void;
}

export default function EvolutionAnimation({ level, isEvolution, onComplete }: Props) {
  const [phase, setPhase] = useState<'start' | 'flash' | 'reveal'>('start');

  useEffect(() => {
    if (!isEvolution) {
      const timer = setTimeout(onComplete, 3500);
      return () => clearTimeout(timer);
    }

    const t2 = setTimeout(() => setPhase('flash'), 4500);
    const t3 = setTimeout(() => setPhase('reveal'), 5000);
    const t4 = setTimeout(onComplete, 8500);

    return () => {
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isEvolution, onComplete]);

  // Allow clicking to skip/dismiss at any time
  const handleContainerClick = () => {
    onComplete();
  };

  const particles = Array.from({ length: 36 });

  const oldScale = level === 6 ? 1 : 1.2;
  const newScale = level === 6 ? 1.2 : 1.4;

  // Ensure arrays have exactly the same length (14 elements) to prevent Framer Motion errors
  const morphScales = [
    oldScale, oldScale,
    0.5, newScale, 0.5, oldScale,
    0.5, newScale, 0.5, oldScale,
    0.5, newScale, 0.5, newScale
  ];
  
  const morphTimes = [
    0, 0.2,
    0.3, 0.4, 0.5, 0.6,
    0.7, 0.75, 0.8, 0.85,
    0.9, 0.94, 0.97, 1
  ];

  const morphFilters = [
    'brightness(1)', 'brightness(100)',
    'brightness(100)', 'brightness(100)', 'brightness(100)', 'brightness(100)',
    'brightness(100)', 'brightness(100)', 'brightness(100)', 'brightness(100)',
    'brightness(100)', 'brightness(100)', 'brightness(100)', 'brightness(100)'
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onClick={handleContainerClick}
      className="absolute inset-0 z-[100] flex items-center justify-center bg-slate-900 overflow-hidden cursor-pointer"
    >
      {/* Background rotating rays */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute w-[200%] h-[200%] opacity-30"
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, ${isEvolution ? '#3b82f6' : '#38bdf8'} 20deg, transparent 40deg, ${isEvolution ? '#3b82f6' : '#38bdf8'} 60deg, transparent 80deg, ${isEvolution ? '#3b82f6' : '#38bdf8'} 100deg, transparent 120deg, ${isEvolution ? '#3b82f6' : '#38bdf8'} 140deg, transparent 160deg, ${isEvolution ? '#3b82f6' : '#38bdf8'} 180deg, transparent 200deg, ${isEvolution ? '#3b82f6' : '#38bdf8'} 220deg, transparent 240deg, ${isEvolution ? '#3b82f6' : '#38bdf8'} 260deg, transparent 280deg, ${isEvolution ? '#3b82f6' : '#38bdf8'} 300deg, transparent 320deg, ${isEvolution ? '#3b82f6' : '#38bdf8'} 340deg, transparent 360deg)`
        }}
      />

      {/* Evolution Sequence */}
      {isEvolution && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <AnimatePresence>
            {phase === 'start' && (
              <motion.div
                initial={{ scale: oldScale, filter: 'brightness(1)' }}
                animate={{ scale: morphScales, filter: morphFilters }}
                transition={{ duration: 4.5, times: morphTimes, ease: "easeInOut" }}
                exit={{ opacity: 0 }}
                className="relative"
              >
                <svg width="160" height="180" viewBox="0 0 160 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M80 10C80 10 20 70 20 110C20 143.137 46.8629 170 80 170C113.137 170 140 143.137 140 110C140 70 80 10 80 10Z" fill="#60a5fa" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {phase === 'reveal' && (
              <motion.div
                initial={{ scale: newScale, filter: 'brightness(100)' }}
                animate={{ scale: newScale, filter: 'brightness(1)' }}
                transition={{ duration: 1.5 }}
                className="relative"
              >
                <svg width="160" height="180" viewBox="0 0 160 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M80 10C80 10 20 70 20 110C20 143.137 46.8629 170 80 170C113.137 170 140 143.137 140 110C140 70 80 10 80 10Z" fill="#60a5fa" />
                  <g>
                    <ellipse cx="60" cy="95" rx="8" ry="12" fill="#1e3a8a" />
                    <ellipse cx="100" cy="95" rx="8" ry="12" fill="#1e3a8a" />
                    <circle cx="58" cy="91" r="3" fill="white" />
                    <circle cx="98" cy="91" r="3" fill="white" />
                    <path d="M75 115 Q 80 125 85 115" stroke="#1e3a8a" strokeWidth="3" strokeLinecap="round" fill="none" />
                  </g>
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* White Flash */}
      <AnimatePresence>
        {phase === 'flash' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-white z-30"
          />
        )}
      </AnimatePresence>

      {/* Particles explosion */}
      {(!isEvolution || phase === 'reveal') && particles.map((_, i) => {
        const angle = (i / particles.length) * Math.PI * 2;
        const distance = 150 + Math.random() * 200;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        const delay = Math.random() * 0.2;
        const isStar = i % 3 === 0;

        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{ x, y, scale: Math.random() * 1.5 + 0.5, opacity: 0, rotate: 360 }}
            transition={{ duration: 1.5 + Math.random(), delay, ease: "easeOut" }}
            className={`absolute z-20 ${isEvolution ? 'text-blue-300' : 'text-sky-300'}`}
          >
            {isStar ? <Star className="w-8 h-8 fill-current" /> : <Sparkles className="w-6 h-6" />}
          </motion.div>
        );
      })}

      {/* Typography */}
      {(!isEvolution || phase === 'reveal') && (
        <div className="relative z-40 flex flex-col items-center mt-48">
          <motion.div
            initial={{ scale: 0.5, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.3 }}
            className="text-center"
          >
            <h2 className={`text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b ${isEvolution ? 'from-blue-200 to-blue-600' : 'from-sky-200 to-sky-600'} drop-shadow-[0_0_20px_rgba(255,255,255,0.6)] uppercase tracking-widest`}>
              {isEvolution ? '¡Evolución!' : '¡Nivel Up!'}
            </h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="mt-6 inline-block bg-white/20 backdrop-blur-md px-8 py-2 rounded-full border border-white/30 shadow-xl"
            >
              <p className="text-white text-2xl font-bold tracking-wide">
                Nivel {level}
              </p>
            </motion.div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
