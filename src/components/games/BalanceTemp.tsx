import React, { useState, useEffect } from 'react';
import { Flame, Snowflake } from 'lucide-react';

export default function BalanceTemp({ onWin }: { onWin: () => void }) {
  const [temp, setTemp] = useState(50);
  const [score, setScore] = useState(0);
  const [driftDir, setDriftDir] = useState(1);

  // Change drift direction randomly
  useEffect(() => {
    const dirInterval = setInterval(() => {
      setDriftDir(Math.random() > 0.5 ? 1 : -1);
    }, 800);
    return () => clearInterval(dirInterval);
  }, []);

  // Apply drift
  useEffect(() => {
    const interval = setInterval(() => {
      setTemp(t => Math.max(0, Math.min(100, t + (driftDir * 2.5))));
    }, 100);
    return () => clearInterval(interval);
  }, [driftDir]);

  const tempRef = React.useRef(temp);

  useEffect(() => {
    tempRef.current = temp;
  }, [temp]);

  // Score logic
  useEffect(() => {
    const interval = setInterval(() => {
      setScore(s => {
        let newScore = s;
        const currentTemp = tempRef.current;
        if (currentTemp >= 35 && currentTemp <= 65) {
          newScore = s + 1;
          if (newScore >= 100) {
            setTimeout(onWin, 300);
            return 100;
          }
        } else {
          newScore = Math.max(0, s - 2);
        }
        return newScore;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [onWin]);

  return (
    <div className="flex flex-col items-center w-full max-w-[280px] mx-auto space-y-10">
      
      <div className="text-3xl font-bold text-blue-600 bg-white px-6 py-2 rounded-full shadow-sm">
        {score}%
      </div>

      <div className="w-full h-12 bg-gray-200 rounded-full relative overflow-hidden border-4 border-white shadow-inner">
        {/* Danger zones */}
        <div className="absolute top-0 bottom-0 left-0 w-[35%] bg-blue-200 opacity-50" />
        <div className="absolute top-0 bottom-0 right-0 w-[35%] bg-orange-200 opacity-50" />
        
        {/* Safe zone */}
        <div className="absolute top-0 bottom-0 left-[35%] right-[35%] bg-green-300" />
        
        {/* Needle */}
        <div 
          className="absolute top-0 bottom-0 w-3 bg-gray-800 rounded-full transition-all duration-100 shadow-md"
          style={{ left: `${temp}%`, transform: 'translateX(-50%)' }}
        />
      </div>

      <div className="flex justify-between w-full gap-4">
        <button 
          onPointerDown={() => setTemp(t => Math.max(0, t - 12))}
          className="flex-1 py-6 bg-blue-100 text-blue-600 rounded-3xl flex justify-center items-center active:scale-95 transition-transform shadow-sm"
        >
          <Snowflake className="w-10 h-10" />
        </button>
        <button 
          onPointerDown={() => setTemp(t => Math.min(100, t + 12))}
          className="flex-1 py-6 bg-orange-100 text-orange-600 rounded-3xl flex justify-center items-center active:scale-95 transition-transform shadow-sm"
        >
          <Flame className="w-10 h-10" />
        </button>
      </div>
      
      <p className="text-sm text-gray-500 text-center px-4">
        Toca los botones para mantener el indicador en la zona verde.
      </p>
    </div>
  );
}
