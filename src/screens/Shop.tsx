import React, { useState } from 'react';
import { GameState } from '../types';
import { Droplet, MousePointerClick, Zap, Shield, Glasses, Sparkles, Crown, Wind, Lock } from 'lucide-react';

interface ShopProps {
  state: GameState;
  buyUpgrade: (upgradeId: keyof GameState['upgrades'], cost: number) => void;
  buyAccessory: (id: string, cost: number) => void;
  toggleAccessory: (id: string, category: keyof GameState['equipped']) => void;
}

export default function Shop({ state, buyUpgrade, buyAccessory, toggleAccessory }: ShopProps) {
  const [activeTab, setActiveTab] = useState<'upgrades' | 'accessories'>('upgrades');

  const upgrades = [
    {
      id: 'clickPower' as const,
      name: 'Fuerza de Gota',
      desc: 'Aumenta las gotas por clic.',
      icon: MousePointerClick,
      baseCost: 50,
      level: state.upgrades.clickPower,
      effect: `+${state.upgrades.clickPower + 1} por clic`,
      color: 'text-blue-500',
      bg: 'bg-blue-100',
      multiplier: 1.6
    },
    {
      id: 'autoGather' as const,
      name: 'Lluvia Automática',
      desc: 'Genera gotas pasivamente cada segundo.',
      icon: Zap,
      baseCost: 150,
      level: state.upgrades.autoGather,
      effect: `${state.upgrades.autoGather} gotas / seg`,
      color: 'text-yellow-500',
      bg: 'bg-yellow-100',
      multiplier: 1.8
    },
    {
      id: 'resilience' as const,
      name: 'Resiliencia',
      desc: 'Reduce la velocidad a la que bajan las necesidades.',
      icon: Shield,
      baseCost: 300,
      level: state.upgrades.resilience,
      effect: `+${state.upgrades.resilience * 20}% duración`,
      color: 'text-green-500',
      bg: 'bg-green-100',
      multiplier: 2.0
    }
  ];

  const accessories = [
    { id: 'freckles', name: 'Pecas', desc: 'Un toque adorable.', cost: 15000, category: 'face' as const, icon: Sparkles, color: 'text-orange-500', bg: 'bg-orange-100', unlockLevel: 1 },
    { id: 'glasses', name: 'Gafas', desc: 'Para ver mejor las gotas.', cost: 20000, category: 'face' as const, icon: Glasses, color: 'text-gray-600', bg: 'bg-gray-100', unlockLevel: 3 },
    { id: 'scarf', name: 'Bufanda', desc: 'Calentito en invierno.', cost: 25000, category: 'neck' as const, icon: Wind, color: 'text-yellow-500', bg: 'bg-yellow-100', unlockLevel: 5 },
    { id: 'cap', name: 'Gorra Roja', desc: 'Protege del sol.', cost: 35000, category: 'hat' as const, icon: Crown, color: 'text-red-500', bg: 'bg-red-100', unlockLevel: 7 },
    { id: 'tophat', name: 'Sombrero Copa', desc: 'Mucha elegancia.', cost: 50000, category: 'hat' as const, icon: Crown, color: 'text-purple-500', bg: 'bg-purple-100', unlockLevel: 10 }
  ];

  return (
    <div className="flex flex-col items-center w-full h-full p-6 sm:p-8 overflow-y-auto pb-24">
      <div className="flex items-center justify-between w-full max-w-md mb-6 mt-4">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Tienda</h1>
        <div className="bg-white px-4 py-2 rounded-full shadow-sm flex items-center space-x-2">
          <Droplet className="w-5 h-5 text-blue-400 fill-blue-100" />
          <span className="font-bold text-gray-800">{Math.floor(state.dewdrops)}</span>
        </div>
      </div>

      <div className="flex w-full max-w-md bg-gray-100 p-1 rounded-xl mb-6">
        <button 
          onClick={() => setActiveTab('upgrades')} 
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'upgrades' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'}`}
        >
          Mejoras
        </button>
        <button 
          onClick={() => setActiveTab('accessories')} 
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'accessories' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'}`}
        >
          Complementos
        </button>
      </div>
      
      <div className="w-full max-w-md space-y-5">
        {activeTab === 'upgrades' && upgrades.map((upg) => {
          const cost = Math.floor(upg.baseCost * Math.pow(upg.multiplier, upg.level));
          const canAfford = state.dewdrops >= cost;

          return (
            <div key={upg.id} className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-4 sm:space-x-5 transition-all hover:shadow-md">
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 ${upg.bg} ${upg.color}`}>
                <upg.icon className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-gray-800 text-base sm:text-lg">{upg.name}</h3>
                  <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                    Nv. {upg.level}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 leading-tight mb-2">{upg.desc}</p>
                <div className="inline-block px-2 py-1 bg-blue-50 rounded-md">
                  <p className="text-xs font-semibold text-blue-600">{upg.effect}</p>
                </div>
              </div>
              <button
                onClick={() => buyUpgrade(upg.id, cost)}
                disabled={!canAfford}
                className={`shrink-0 flex flex-col items-center justify-center min-w-[72px] px-3 py-2 sm:py-3 rounded-xl font-bold text-sm transition-all ${
                  canAfford 
                    ? 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95 shadow-md hover:shadow-lg' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span className="text-xs font-normal opacity-80 mb-0.5">Mejorar</span>
                <div className="flex items-center space-x-1">
                  <span>{cost}</span>
                  <Droplet className="w-3 h-3 fill-current" />
                </div>
              </button>
            </div>
          );
        })}

        {activeTab === 'accessories' && accessories.map((acc) => {
          const isOwned = state.inventory.includes(acc.id);
          const isEquipped = state.equipped[acc.category] === acc.id;
          const isLocked = state.level < acc.unlockLevel;
          const canAfford = state.dewdrops >= acc.cost && !isLocked;

          return (
            <div key={acc.id} className={`bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-4 sm:space-x-5 transition-all ${isLocked ? 'opacity-75 grayscale-[0.5]' : 'hover:shadow-md'}`}>
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 ${isLocked ? 'bg-gray-100 text-gray-400' : `${acc.bg} ${acc.color}`}`}>
                {isLocked ? <Lock className="w-7 h-7 sm:w-8 sm:h-8" /> : <acc.icon className="w-7 h-7 sm:w-8 sm:h-8" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h3 className={`font-bold text-base sm:text-lg ${isLocked ? 'text-gray-500' : 'text-gray-800'}`}>{acc.name}</h3>
                  {isLocked && (
                    <span className="text-[10px] sm:text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                      Nivel {acc.unlockLevel}
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-500 leading-tight mb-2">{acc.desc}</p>
              </div>
              
              {isOwned ? (
                <button
                  onClick={() => toggleAccessory(acc.id, acc.category)}
                  className={`shrink-0 min-w-[72px] px-3 py-2 sm:py-3 rounded-xl font-bold text-sm transition-all ${
                    isEquipped 
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                >
                  {isEquipped ? 'Quitar' : 'Poner'}
                </button>
              ) : (
                <button
                  onClick={() => !isLocked && buyAccessory(acc.id, acc.cost)}
                  disabled={!canAfford || isLocked}
                  className={`shrink-0 flex flex-col items-center justify-center min-w-[72px] px-3 py-2 sm:py-3 rounded-xl font-bold text-sm transition-all ${
                    canAfford 
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95 shadow-md hover:shadow-lg' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <span className="text-xs font-normal opacity-80 mb-0.5">{isLocked ? 'Bloqueado' : 'Comprar'}</span>
                  {!isLocked && (
                    <div className="flex items-center space-x-1">
                      <span>{acc.cost}</span>
                      <Droplet className="w-3 h-3 fill-current" />
                    </div>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
