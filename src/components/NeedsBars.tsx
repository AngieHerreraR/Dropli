import { Droplet, Smile, Moon, Sparkles } from 'lucide-react';
import { GameState } from '../types';

interface NeedsBarsProps {
  state: GameState;
}

export default function NeedsBars({ state }: NeedsBarsProps) {
  const needs = [
    { label: 'Minerales', value: state.minerals, icon: Sparkles, color: 'bg-emerald-400' },
    { label: 'Hidratación', value: state.hydration, icon: Droplet, color: 'bg-cyan-400' },
    { label: 'Felicidad', value: state.happiness, icon: Smile, color: 'bg-yellow-400' },
    { label: 'Sueño', value: state.sleep, icon: Moon, color: 'bg-indigo-400' },
  ];

  return (
    <div className="w-full max-w-xs space-y-4 bg-white/60 backdrop-blur-md p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50">
      {needs.map((need) => (
        <div key={need.label} className="flex items-center space-x-4">
          <div className={`p-2 rounded-xl bg-white shadow-sm border border-slate-100 ${need.color.replace('bg-', 'text-').replace('400', '500')}`}>
            <need.icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="flex-1 h-3 sm:h-4 bg-slate-200/50 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
            <div
              className={`h-full ${need.color} transition-all duration-500 rounded-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)]`}
              style={{ width: `${need.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
