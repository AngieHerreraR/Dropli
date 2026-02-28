import { useState } from 'react';
import { Home as HomeIcon, Gamepad2, BarChart2, Sparkles, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useGameState } from './hooks/useGameState';
import { Screen } from './types';
import Home from './screens/Home';
import Minigames from './screens/Minigames';
import Stats from './screens/Stats';
import Evolution from './screens/Evolution';
import Shop from './screens/Shop';
import EvolutionAnimation from './components/EvolutionAnimation';

export default function App() {
  const { 
    gameState, updateNeed, addXp, clickDropli, buyUpgrade, 
    addDewdrops, toggleSleep, buyAccessory, toggleAccessory, isLoaded, levelUpData, setLevelUpData
  } = useGameState();
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-screen bg-blue-50">Cargando...</div>;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <Home state={gameState} updateNeed={updateNeed} clickDropli={clickDropli} toggleSleep={toggleSleep} goToMinigames={() => setCurrentScreen('minigames')} addXp={addXp} />;
      case 'minigames':
        return <Minigames addXp={addXp} updateNeed={updateNeed} addDewdrops={addDewdrops} level={gameState.level} />;
      case 'stats':
        return <Stats state={gameState} />;
      case 'evolution':
        return <Evolution state={gameState} />;
      case 'shop':
        return <Shop state={gameState} buyUpgrade={buyUpgrade} buyAccessory={buyAccessory} toggleAccessory={toggleAccessory} />;
    }
  };

  const navItems = [
    { id: 'home', icon: HomeIcon, label: 'Inicio' },
    { id: 'minigames', icon: Gamepad2, label: 'Juegos' },
    { id: 'shop', icon: ShoppingCart, label: 'Tienda' },
    { id: 'stats', icon: BarChart2, label: 'Stats' },
    { id: 'evolution', icon: Sparkles, label: 'Evolución' },
  ] as const;

  return (
    <div className="flex justify-center w-full h-screen bg-slate-900 overflow-hidden font-sans">
      {/* Mobile container */}
      <div className="w-full max-w-md h-full bg-gradient-to-b from-sky-50 to-white flex flex-col relative shadow-2xl overflow-hidden">
        
        {/* Sleep Overlay */}
        <div 
          className={`absolute inset-0 bg-slate-900/60 z-40 pointer-events-none transition-all duration-1000 ${
            gameState.isSleeping ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Evolution Animation */}
        <AnimatePresence>
          {levelUpData && (
            <EvolutionAnimation 
              level={levelUpData.level} 
              isEvolution={levelUpData.isEvolution} 
              onComplete={() => setLevelUpData(null)} 
            />
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden relative z-10">
          {renderScreen()}
        </main>

        {/* Bottom Navigation */}
        <nav className="bg-white/80 backdrop-blur-md border-t border-slate-100 px-6 sm:px-8 py-4 sm:py-5 flex justify-between items-center pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.04)] z-50">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id)}
                className={`flex flex-col items-center space-y-1.5 transition-all duration-300 ${
                  isActive ? 'text-sky-600 scale-110' : 'text-slate-400 hover:text-slate-600 hover:scale-105'
                }`}
              >
                <div className={`p-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-sky-100 shadow-inner' : 'bg-transparent'}`}>
                  <item.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${isActive ? 'fill-sky-200' : ''}`} />
                </div>
                <span className="text-[10px] sm:text-xs font-bold tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
