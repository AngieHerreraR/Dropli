import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Droplet, CloudRain } from 'lucide-react';
import Dropli from '../components/Dropli';
import NeedsBars from '../components/NeedsBars';
import ActionButtons from '../components/ActionButtons';
import { GameState } from '../types';

interface HomeProps {
  state: GameState;
  updateNeed: (need: keyof GameState, amount: number) => void;
  clickDropli: () => void;
  toggleSleep: () => void;
  goToMinigames: () => void;
  addXp: (amount: number) => void;
}

export default function Home({ state, updateNeed, clickDropli, toggleSleep, goToMinigames, addXp }: HomeProps) {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<'rain' | null>(null);
  const [rainClicks, setRainClicks] = useState(0);
  const [cloudPos, setCloudPos] = useState({ x: 50, y: 30 });
  const [clicks, setClicks] = useState<{id: number, x: number, y: number}[]>([]);



  const handleAction = (actionId: string) => {
    if (actionId === 'play') {
      goToMinigames();
      return;
    }
    
    if (actionId === 'sleep') {
      toggleSleep();
      if (!state.isSleeping) {
        addXp(10);
      }
      return;
    }

    if (actionId === 'rain') {
      setActiveTask('rain');
      setRainClicks(0);
      setCloudPos({ x: 50, y: 30 });
      return;
    }

    setActiveAction(actionId);
    
    // Apply effects
    setTimeout(() => {
      switch (actionId) {
        case 'nutrir': 
          updateNeed('minerals', 15); 
          addXp(10);
          break;
      }
      setActiveAction(null);
    }, 2000);
  };

  const handleDropliClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const id = Date.now() + Math.random();
    setClicks(prev => [...prev, { id, x, y }]);
    clickDropli();
    
    setTimeout(() => {
      setClicks(prev => prev.filter(c => c.id !== id));
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-between w-full h-full p-6 sm:p-8 overflow-y-auto pb-24">
      {/* Top Bar with Dewdrops */}
      <div className="absolute top-6 right-6 bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 flex items-center space-x-2.5 z-20 transition-transform hover:scale-105">
        <Droplet className="w-5 h-5 text-sky-400 fill-sky-200 drop-shadow-sm" />
        <span className="font-bold text-slate-700 text-lg">{Math.floor(state.dewdrops)}</span>
      </div>

      <div className="text-center mt-12 mb-6">
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight drop-shadow-sm">{state.name}</h1>
        <div className="inline-flex items-center justify-center space-x-2 mt-2 bg-white/60 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm border border-white/40">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nivel {state.level}</span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Etapa {state.evolution}</span>
        </div>
      </div>

      <div className="relative flex-1 flex items-center justify-center w-full min-h-[280px]">
        {/* Continuous Rain for AutoGather */}
        {state.upgrades.autoGather > 0 && !state.isSleeping && (
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={`autorain-${i}`}
                initial={{ y: -50, x: Math.random() * 400 }}
                animate={{ y: 800 }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1 + Math.random(), 
                  delay: Math.random() * 2,
                  ease: "linear" 
                }}
                className="absolute w-0.5 h-4 bg-blue-400 rounded-full"
              />
            ))}
          </div>
        )}

        <Dropli state={state} onClick={state.isSleeping ? toggleSleep : handleDropliClick} />
        
        {/* Click Animations */}
        <AnimatePresence>
          {clicks.map(click => (
            <motion.div
              key={click.id}
              initial={{ opacity: 1, y: click.y - 20, x: click.x - 10, scale: 0.5 }}
              animate={{ opacity: 0, y: click.y - 100, scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute pointer-events-none font-black text-sky-500 text-2xl z-50 drop-shadow-md"
              style={{ left: 0, top: 0 }}
            >
              +{1 + state.upgrades.clickPower}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Action Animations */}
        <AnimatePresence>
          {activeAction === 'nutrir' && (
            <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`min-${i}`}
                  initial={{ opacity: 0, x: (Math.random() - 0.5) * 250, y: (Math.random() - 0.5) * 250, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], x: 0, y: 0, scale: [0, 1.5, 0] }}
                  transition={{ duration: 1.2, delay: i * 0.15, ease: "easeInOut" }}
                  className="absolute w-4 h-4 rounded-full bg-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.8)]"
                />
              ))}
            </div>
          )}
          {activeAction === 'rain' && (
            <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`drop-${i}`}
                  initial={{ opacity: 0, y: -200, x: (Math.random() - 0.5) * 150, scale: 0.5 }}
                  animate={{ opacity: [0, 1, 0], y: 0, scale: [0.5, 1, 0] }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: "easeIn" }}
                  className="absolute text-blue-400 text-3xl drop-shadow-sm"
                >
                  💧
                </motion.div>
              ))}
            </div>
          )}
          {state.isSleeping && (
            <motion.div
              initial={{ opacity: 0, y: 0, x: 20 }}
              animate={{ opacity: 1, y: -60, x: 40 }}
              exit={{ opacity: 0 }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute top-10 right-10 text-indigo-300 text-4xl font-bold pointer-events-none z-40 drop-shadow-md"
            >
              Zzz
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mini Tasks Overlays */}
        <AnimatePresence>
          {activeTask === 'rain' && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="absolute inset-0 z-50 rounded-3xl overflow-hidden"
            >
              <div className="absolute top-4 left-0 right-0 flex flex-col items-center pointer-events-none">
                <h2 className="text-xl font-bold text-blue-600 drop-shadow-md bg-white/70 px-4 py-1 rounded-full backdrop-blur-sm">¡Toca la nube!</h2>
                <div className="mt-2 flex space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full transition-colors shadow-sm ${i < rainClicks ? 'bg-blue-500' : 'bg-white'}`} />
                  ))}
                </div>
              </div>
              
              <motion.button
                animate={{ left: `${cloudPos.x}%`, top: `${cloudPos.y}%` }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  const newClicks = rainClicks + 1;
                  if (newClicks >= 5) {
                    updateNeed('hydration', 15);
                    addXp(15);
                    setActiveAction('rain');
                    setTimeout(() => setActiveAction(null), 2000);
                    setActiveTask(null);
                    setRainClicks(0);
                  } else {
                    setCloudPos({
                      x: 15 + Math.random() * 70, // 15% to 85%
                      y: 15 + Math.random() * 50  // 15% to 65%
                    });
                    setRainClicks(newClicks);
                  }
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-blue-500 shadow-xl border-4 border-blue-100"
              >
                <CloudRain className="w-12 h-12" />
              </motion.button>
              <button onClick={() => setActiveTask(null)} className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm text-gray-500 font-medium px-6 py-2 rounded-full shadow-md">Cancelar</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full flex flex-col items-center mt-6">
        <NeedsBars state={state} />
        <ActionButtons onAction={handleAction} />
      </div>
    </div>
  );
}
