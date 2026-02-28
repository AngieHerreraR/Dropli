import React, { useState } from 'react';
import { Gamepad2, Cloud, Thermometer, ArrowLeft, Calculator, Bug, Brain, Lock } from 'lucide-react';
import CatchDrops from '../components/games/CatchDrops';
import MemoryClouds from '../components/games/MemoryClouds';
import BalanceTemp from '../components/games/BalanceTemp';
import MathGame from '../components/games/MathGame';
import SimonSays from '../components/games/SimonSays';
import WhackABug from '../components/games/WhackABug';

interface MinigamesProps {
  addXp: (amount: number) => void;
  updateNeed: (need: string, amount: number) => void;
  addDewdrops: (amount: number) => void;
  level: number;
}

export default function Minigames({ addXp, updateNeed, addDewdrops, level }: MinigamesProps) {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const games = [
    { id: 'catch', name: 'Catch the Drops', icon: Gamepad2, desc: 'Atrapa gotas limpias, evita las tóxicas.', unlockLevel: 1 },
    { id: 'math', name: 'Math Drops', icon: Calculator, desc: 'Resuelve operaciones matemáticas simples.', unlockLevel: 2 },
    { id: 'memory', name: 'Memory Clouds', icon: Cloud, desc: 'Encuentra las parejas de nubes.', unlockLevel: 4 },
    { id: 'simon', name: 'Simon Says', icon: Brain, desc: 'Repite la secuencia de colores.', unlockLevel: 6 },
    { id: 'balance', name: 'Balance Temp', icon: Thermometer, desc: 'Mantén la temperatura estable.', unlockLevel: 8 },
    { id: 'whack', name: 'Whack-a-Bug', icon: Bug, desc: 'Atrapa los bichos, no toques las gotas.', unlockLevel: 10 },
  ];

  const handleWin = () => {
    addXp(20);
    updateNeed('happiness', 10);
    addDewdrops(50);
    setActiveGame(null);
  };

  const renderGame = () => {
    switch (activeGame) {
      case 'catch': return <CatchDrops onWin={handleWin} />;
      case 'memory': return <MemoryClouds onWin={handleWin} />;
      case 'balance': return <BalanceTemp onWin={handleWin} />;
      case 'math': return <MathGame onWin={handleWin} />;
      case 'simon': return <SimonSays onWin={handleWin} />;
      case 'whack': return <WhackABug onWin={handleWin} />;
      default: return null;
    }
  };

  if (activeGame) {
    const gameInfo = games.find(g => g.id === activeGame);
    return (
      <div className="flex flex-col items-center w-full h-full p-6 relative">
        <button 
          onClick={() => setActiveGame(null)}
          className="absolute top-6 left-6 p-2 bg-white rounded-full shadow-sm z-50"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        
        <h2 className="text-xl font-bold text-gray-800 mb-2 mt-4">{gameInfo?.name}</h2>
        <p className="text-sm text-gray-500 mb-8 text-center">{gameInfo?.desc}</p>
        
        <div className="w-full flex-1 flex flex-col justify-center">
          {renderGame()}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full h-full p-6 sm:p-8 overflow-y-auto pb-24">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 mt-4 tracking-tight">Mini Juegos</h1>
      
      <div className="w-full max-w-md space-y-5">
        {games.map((game) => {
          const isLocked = level < game.unlockLevel;
          return (
          <button
            key={game.id}
            onClick={() => !isLocked && setActiveGame(game.id)}
            disabled={isLocked}
            className={`w-full bg-white p-5 sm:p-6 rounded-3xl shadow-sm flex items-center space-x-4 sm:space-x-5 transition-all text-left group relative overflow-hidden ${isLocked ? 'opacity-75 cursor-not-allowed grayscale-[0.5]' : 'hover:bg-blue-50 hover:shadow-md'}`}
          >
            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${isLocked ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-600 group-hover:bg-blue-200'}`}>
              {isLocked ? <Lock className="w-7 h-7 sm:w-8 sm:h-8" /> : <game.icon className="w-7 h-7 sm:w-8 sm:h-8" />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h3 className={`font-bold text-base sm:text-lg ${isLocked ? 'text-gray-500' : 'text-gray-800'}`}>{game.name}</h3>
                {isLocked && (
                  <span className="text-[10px] sm:text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                    Nivel {game.unlockLevel}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-500 leading-tight">{game.desc}</p>
            </div>
          </button>
        )})}
      </div>
    </div>
  );
}
