import { Sparkles, CloudRain, ThermometerSun, Gamepad2, Moon } from 'lucide-react';

interface ActionButtonsProps {
  onAction: (action: string) => void;
}

export default function ActionButtons({ onAction }: ActionButtonsProps) {
  const actions = [
    { id: 'nutrir', label: 'Nutrir', icon: Sparkles, color: 'bg-emerald-100 text-emerald-600 border-emerald-200' },
    { id: 'rain', label: 'Lluvia', icon: CloudRain, color: 'bg-sky-100 text-sky-600 border-sky-200' },
    { id: 'play', label: 'Jugar', icon: Gamepad2, color: 'bg-yellow-100 text-yellow-600 border-yellow-200' },
    { id: 'sleep', label: 'Dormir', icon: Moon, color: 'bg-indigo-100 text-indigo-600 border-indigo-200' },
  ];

  return (
    <div className="flex flex-nowrap justify-center gap-3 sm:gap-4 mt-8 w-full max-w-sm px-4">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => onAction(action.id)}
          className={`flex flex-col items-center justify-center flex-1 aspect-square max-w-[80px] rounded-[1.25rem] ${action.color} border shadow-[0_8px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_25px_rgb(0,0,0,0.08)] hover:-translate-y-1 active:scale-95 transition-all duration-300`}
        >
          <action.icon className="w-6 h-6 sm:w-7 sm:h-7 mb-1.5 drop-shadow-sm" />
          <span className="text-[10px] sm:text-[11px] font-bold tracking-wide">{action.label}</span>
        </button>
      ))}
    </div>
  );
}
