import React from 'react';
import { motion } from 'motion/react';
import { GameState } from '../types';

interface DropliProps {
  state: GameState;
  onClick?: (e: React.MouseEvent) => void;
}

export default function Dropli({ state, onClick }: DropliProps) {
  const isSick = state.minerals < 15 || state.hydration < 15 || state.happiness < 15 || state.sleep < 15;
  const isSad = !isSick && (state.minerals < 30 || state.hydration < 30 || state.happiness < 30 || state.sleep < 30);
  const isHappy = state.minerals > 70 && state.hydration > 70 && state.happiness > 70 && state.sleep > 70;

  let color = '#60a5fa'; // Default blue
  if (isSick) color = '#86efac'; // Greenish
  else if (isSad) color = '#3b82f6'; // Darker blue
  else if (isHappy) color = '#93c5fd'; // Bright blue

  const scale = state.evolution === 1 ? 1 : state.evolution === 2 ? 1.2 : 1.4;

  return (
    <div className="relative flex items-center justify-center w-64 h-64 cursor-pointer" onClick={onClick}>
      {/* Halo for evolution 3 */}
      {state.evolution === 3 && (
        <motion.div
          className="absolute w-48 h-48 rounded-full bg-blue-300/30 blur-xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        />
      )}

      <motion.div
        whileTap={{ scale: scale * 0.9 }}
        animate={{
          y: isHappy ? [-10, 10, -10] : [-5, 5, -5],
          scale: isHappy ? [scale, scale * 1.05, scale] : scale,
        }}
        transition={{
          repeat: Infinity,
          duration: isHappy ? 2 : 4,
          ease: 'easeInOut',
        }}
        className="relative z-10"
      >
        <svg width="160" height="180" viewBox="0 0 160 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Body */}
          <path
            d="M80 10C80 10 20 70 20 110C20 143.137 46.8629 170 80 170C113.137 170 140 143.137 140 110C140 70 80 10 80 10Z"
            fill={color}
            className="transition-colors duration-1000"
          />
          
          {/* Sparkle for evolution 2+ */}
          {state.evolution >= 2 && (
            <ellipse cx="45" cy="100" rx="8" ry="15" fill="white" fillOpacity="0.4" transform="rotate(-30 45 100)" />
          )}

          {/* Eyes */}
          <g>
            {state.isSleeping ? (
              <>
                <path d="M50 95 Q 60 100 70 95" stroke="#1e3a8a" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M90 95 Q 100 100 110 95" stroke="#1e3a8a" strokeWidth="4" strokeLinecap="round" fill="none" />
              </>
            ) : isSick || isSad ? (
              <>
                <path d="M50 95 Q 60 85 70 95" stroke="#1e3a8a" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M90 95 Q 100 85 110 95" stroke="#1e3a8a" strokeWidth="4" strokeLinecap="round" fill="none" />
              </>
            ) : (
              <>
                <motion.ellipse
                  cx="60" cy="95" rx="8" ry="12" fill="#1e3a8a"
                  animate={{ scaleY: [1, 0.1, 1] }}
                  transition={{ repeat: Infinity, duration: 4, times: [0, 0.05, 0.1], repeatDelay: Math.random() * 2 + 2 }}
                />
                <motion.ellipse
                  cx="100" cy="95" rx="8" ry="12" fill="#1e3a8a"
                  animate={{ scaleY: [1, 0.1, 1] }}
                  transition={{ repeat: Infinity, duration: 4, times: [0, 0.05, 0.1], repeatDelay: Math.random() * 2 + 2 }}
                />
                {/* Eye sparkles */}
                <circle cx="58" cy="91" r="3" fill="white" />
                <circle cx="98" cy="91" r="3" fill="white" />
              </>
            )}
          </g>

          {/* Mouth */}
          {state.isSleeping ? (
            <circle cx="80" cy="115" r="3" fill="#1e3a8a" />
          ) : isSick ? (
            <path d="M70 120 Q 80 110 90 120" stroke="#1e3a8a" strokeWidth="4" strokeLinecap="round" fill="none" />
          ) : isSad ? (
            <path d="M75 120 Q 80 115 85 120" stroke="#1e3a8a" strokeWidth="3" strokeLinecap="round" fill="none" />
          ) : isHappy ? (
            <path d="M70 115 Q 80 130 90 115" stroke="#1e3a8a" strokeWidth="4" strokeLinecap="round" fill="none" />
          ) : (
            <path d="M75 115 Q 80 125 85 115" stroke="#1e3a8a" strokeWidth="3" strokeLinecap="round" fill="none" />
          )}
          {/* Accessories: Face */}
          {state.equipped.face === 'freckles' && (
            <g fill="#1e3a8a" opacity="0.3">
              <circle cx="45" cy="105" r="2.5"/><circle cx="52" cy="108" r="2"/><circle cx="40" cy="109" r="2"/>
              <circle cx="115" cy="105" r="2.5"/><circle cx="108" cy="108" r="2"/><circle cx="120" cy="109" r="2"/>
            </g>
          )}
          {state.equipped.face === 'glasses' && (
            <g stroke="#1f2937" strokeWidth="4" fill="none">
              <rect x="40" y="85" width="30" height="24" rx="6"/>
              <rect x="90" y="85" width="30" height="24" rx="6"/>
              <path d="M70 97 L90 97"/>
              <path d="M40 97 L25 92"/>
              <path d="M120 97 L135 92"/>
            </g>
          )}

          {/* Accessories: Hat */}
          {state.equipped.hat === 'cap' && (
            <g>
              <path d="M35 55 Q 80 15 125 55 L 145 55 L 145 65 L 25 65 Z" fill="#ef4444"/>
              <rect x="75" y="35" width="10" height="10" fill="#fca5a5" rx="5"/>
            </g>
          )}
          {state.equipped.hat === 'tophat' && (
            <g>
              <rect x="55" y="5" width="50" height="55" fill="#1f2937" rx="2"/>
              <rect x="35" y="60" width="90" height="8" fill="#1f2937" rx="4"/>
              <rect x="55" y="50" width="50" height="10" fill="#dc2626"/>
            </g>
          )}

          {/* Accessories: Neck */}
          {state.equipped.neck === 'scarf' && (
            <g>
              <path d="M30 135 Q 80 160 130 135 L 125 150 Q 80 175 35 150 Z" fill="#f59e0b"/>
              <path d="M105 140 L 115 180 L 95 175 L 90 145 Z" fill="#f59e0b"/>
              <path d="M115 180 L 115 185 M 105 177 L 105 182 M 95 175 L 95 180" stroke="#d97706" strokeWidth="2"/>
            </g>
          )}
        </svg>
      </motion.div>
    </div>
  );
}
