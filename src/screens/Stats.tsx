import { GameState } from '../types';
import { Award, TrendingUp, Clock } from 'lucide-react';

interface StatsProps {
  state: GameState;
}

export default function Stats({ state }: StatsProps) {
  const xpToNext = Math.floor(100 * Math.pow(state.level, 1.4));
  const progress = Math.min(100, (state.xp / xpToNext) * 100);

  return (
    <div className="flex flex-col items-center w-full h-full p-6 sm:p-8 overflow-y-auto pb-24">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 mt-4 tracking-tight">Estadísticas</h1>
      
      <div className="w-full max-w-md space-y-6">
        {/* Level Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 text-yellow-600 rounded-2xl">
                <Award className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <span className="font-bold text-gray-800 text-xl sm:text-2xl">Nivel {state.level}</span>
            </div>
            <span className="text-sm font-medium px-3 py-1 bg-gray-100 rounded-lg text-gray-600">Etapa {state.evolution}</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm sm:text-base">
              <span className="text-gray-500 font-medium">Experiencia</span>
              <span className="font-bold text-gray-800">{Math.floor(state.xp)} / {xpToNext} XP</span>
            </div>
            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-yellow-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500 mb-3" />
            <span className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Estado General</span>
            <span className="font-bold text-gray-800 text-xl sm:text-2xl">
              {Math.floor((state.minerals + state.hydration + state.happiness + state.sleep) / 4)}%
            </span>
          </div>
          <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-green-500 mb-3" />
            <span className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Última visita</span>
            <span className="font-bold text-gray-800 text-lg sm:text-xl">
              {new Date(state.lastTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
