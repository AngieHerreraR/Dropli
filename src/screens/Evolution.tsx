import { GameState } from '../types';
import { Lock, Unlock } from 'lucide-react';

interface EvolutionProps {
  state: GameState;
}

export default function Evolution({ state }: EvolutionProps) {
  const stages = [
    { level: 1, stage: 1, name: 'Gota Básica', desc: 'Pequeña y adorable.' },
    { level: 6, stage: 2, name: 'Gota Brillante', desc: 'Más grande, con reflejos.' },
    { level: 11, stage: 3, name: 'Espíritu Acuático', desc: 'Halo místico y animaciones fluidas.' },
  ];

  return (
    <div className="flex flex-col items-center w-full h-full p-6 sm:p-8 overflow-y-auto pb-24">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 mt-4 tracking-tight">Evolución</h1>
      
      <div className="w-full max-w-md space-y-6 relative">
        {/* Connecting line */}
        <div className="absolute left-9 sm:left-11 top-10 bottom-10 w-1 bg-blue-100 -z-10 rounded-full" />

        {stages.map((stage) => {
          const isUnlocked = state.level >= stage.level;
          const isCurrent = state.evolution === stage.stage;
          
          return (
            <div 
              key={stage.stage}
              className={`flex items-center p-5 sm:p-6 rounded-3xl border-2 transition-all ${
                isCurrent ? 'bg-blue-50 border-blue-200 shadow-md scale-[1.02]' : 
                isUnlocked ? 'bg-white border-transparent shadow-sm hover:shadow-md' : 
                'bg-gray-50 border-transparent opacity-60'
              }`}
            >
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 mr-5 sm:mr-6 ${
                isUnlocked ? 'bg-blue-100 text-blue-600 shadow-inner' : 'bg-gray-200 text-gray-400'
              }`}>
                {isUnlocked ? <Unlock className="w-6 h-6 sm:w-7 sm:h-7" /> : <Lock className="w-6 h-6 sm:w-7 sm:h-7" />}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-bold text-base sm:text-lg ${isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                    {stage.name}
                  </h3>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${isCurrent ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                    Nv. {stage.level}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 leading-tight">{stage.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
