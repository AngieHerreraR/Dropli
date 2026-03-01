import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState } from '../types';

const INITIAL_STATE: GameState = {
  name: 'Dropli',
  minerals: 100,
  hydration: 100,
  happiness: 100,
  sleep: 100,
  xp: 0,
  level: 1,
  evolution: 1,
  lastTimestamp: Date.now(),
  dewdrops: 0,
  isSleeping: false,
  inventory: [],
  equipped: {},
  upgrades: {
    clickPower: 0,
    autoGather: 0,
    resilience: 0,
  }
};

const BASE_DEGRADATION_RATE_MS = 45 * 1000; // 45 seconds per point

const calculateLevelAndXp = (currentXp: number, currentLevel: number) => {
  let newXp = currentXp;
  let newLevel = currentLevel;
  let xpToNext = 100 * Math.pow(newLevel, 1.4);

  while (newXp >= xpToNext && newLevel < 15) {
    newXp -= xpToNext;
    newLevel++;
    xpToNext = 100 * Math.pow(newLevel, 1.4);
  }

  let newEvolution = 1;
  if (newLevel >= 11) newEvolution = 3;
  else if (newLevel >= 6) newEvolution = 2;

  return { xp: newXp, level: newLevel, evolution: newEvolution };
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{level: number, isEvolution: boolean} | null>(null);
  const prevLevelRef = useRef(INITIAL_STATE.level);

  // Trigger level up animation
  useEffect(() => {
    if (isLoaded && gameState.level > prevLevelRef.current) {
      const isEvolution = gameState.level === 6 || gameState.level === 11;
      setLevelUpData({ level: gameState.level, isEvolution });
    }
    prevLevelRef.current = gameState.level;
  }, [gameState.level, isLoaded]);

  // Load and calculate degradation
  useEffect(() => {
    const saved = localStorage.getItem('dropli_save');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const stateWithDefaults: GameState = {
          ...INITIAL_STATE,
          ...parsed,
          minerals: parsed.minerals ?? parsed.purity ?? 100,
          sleep: parsed.sleep ?? parsed.social ?? 100,
          isSleeping: parsed.isSleeping || false,
          inventory: parsed.inventory || [],
          equipped: parsed.equipped || {},
          upgrades: {
            ...INITIAL_STATE.upgrades,
            ...(parsed.upgrades || {})
          },
          dewdrops: parsed.dewdrops || 0
        };

        const now = Date.now();
        const timeDiff = now - stateWithDefaults.lastTimestamp;
        
        // Calculate offline dewdrops and sleep
        const autoGatherRate = stateWithDefaults.upgrades.autoGather;
        const offlineSeconds = Math.floor(timeDiff / 1000);
        const offlineDewdrops = offlineSeconds * autoGatherRate;
        
        let offlineSleep = 0;
        if (stateWithDefaults.isSleeping) {
          offlineSleep = Math.floor(offlineSeconds / 2); // 1 point every 2 seconds
        }

        // Calculate degradation
        const resilience = stateWithDefaults.upgrades.resilience;
        const effectiveDegradationRate = BASE_DEGRADATION_RATE_MS * (1 + (resilience * 0.2));
        const pointsToDeduct = Math.floor(timeDiff / effectiveDegradationRate);

        if (pointsToDeduct > 0 || offlineDewdrops > 0 || offlineSleep > 0) {
          const newSleep = stateWithDefaults.isSleeping 
            ? Math.min(100, stateWithDefaults.sleep + offlineSleep)
            : Math.max(0, stateWithDefaults.sleep - pointsToDeduct);

          setGameState({
            ...stateWithDefaults,
            minerals: Math.max(0, stateWithDefaults.minerals - pointsToDeduct),
            hydration: Math.max(0, stateWithDefaults.hydration - pointsToDeduct),
            happiness: Math.max(0, stateWithDefaults.happiness - pointsToDeduct),
            sleep: newSleep,
            isSleeping: newSleep === 100 ? false : stateWithDefaults.isSleeping,
            dewdrops: stateWithDefaults.dewdrops + offlineDewdrops,
            lastTimestamp: now,
          });
        } else {
          setGameState({ ...stateWithDefaults, lastTimestamp: now });
        }
      } catch (e) {
        setGameState(INITIAL_STATE);
      }
    }
    setIsLoaded(true);
  }, []);

  // Active Tick (Auto-gather + Active Degradation)
  useEffect(() => {
    if (!isLoaded) return;
    const interval = setInterval(() => {
      setGameState(prev => {
        let newState = { ...prev };
        let changed = false;

        // 1. Auto Gather (NO XP GAIN)
        if (prev.upgrades.autoGather > 0) {
          newState.dewdrops += prev.upgrades.autoGather;
          changed = true;
        }

        // 2. Active Degradation or Sleep Recovery
        const now = Date.now();
        const timeDiff = now - prev.lastTimestamp;
        
        if (prev.isSleeping) {
          // Recover sleep
          if (timeDiff >= 2000) { // 1 point every 2 seconds
            newState.sleep = Math.min(100, newState.sleep + Math.floor(timeDiff / 2000));
            if (newState.sleep === 100) {
              newState.isSleeping = false; // Wake up automatically
            }
            newState.lastTimestamp = now;
            changed = true;
          }
        } else {
          // Normal degradation
          const effectiveDegradationRate = BASE_DEGRADATION_RATE_MS * (1 + (prev.upgrades.resilience * 0.2));
          const pointsToDeduct = Math.floor(timeDiff / effectiveDegradationRate);

          if (pointsToDeduct > 0) {
            newState.minerals = Math.max(0, newState.minerals - pointsToDeduct);
            newState.hydration = Math.max(0, newState.hydration - pointsToDeduct);
            newState.happiness = Math.max(0, newState.happiness - pointsToDeduct);
            newState.sleep = Math.max(0, newState.sleep - pointsToDeduct);
            newState.lastTimestamp = now;
            changed = true;
          }
        }

        return changed ? newState : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isLoaded]);

  // Save on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('dropli_save', JSON.stringify(gameState));
    }
  }, [gameState, isLoaded]);

  const updateNeed = useCallback((need: keyof GameState, amount: number) => {
    setGameState((prev) => {
      const newValue = Math.min(100, Math.max(0, (prev[need] as number) + amount));
      return { ...prev, [need]: newValue, lastTimestamp: Date.now() };
    });
  }, []);

  const addXp = useCallback((amount: number) => {
    setGameState((prev) => {
      const { xp, level, evolution } = calculateLevelAndXp(prev.xp + amount, prev.level);
      return {
        ...prev,
        xp,
        level,
        evolution,
        lastTimestamp: Date.now(),
      };
    });
  }, []);

  const setName = useCallback((name: string) => {
    setGameState((prev) => ({ ...prev, name }));
  }, []);

  const addDewdrops = useCallback((amount: number) => {
    setGameState(prev => {
      const xpGain = amount * 0.2; // Gain 20% of dewdrops as XP
      const { xp, level, evolution } = calculateLevelAndXp(prev.xp + xpGain, prev.level);
      return { ...prev, dewdrops: prev.dewdrops + amount, xp, level, evolution };
    });
  }, []);

  const toggleSleep = useCallback(() => {
    setGameState(prev => ({ ...prev, isSleeping: !prev.isSleeping, lastTimestamp: Date.now() }));
  }, []);

  const clickDropli = useCallback(() => {
    setGameState(prev => {
      const power = 1 + prev.upgrades.clickPower;
      const xpGain = power * 0.5; // Gain 0.5 XP per drop clicked
      const { xp, level, evolution } = calculateLevelAndXp(prev.xp + xpGain, prev.level);
      return { ...prev, dewdrops: prev.dewdrops + power, xp, level, evolution };
    });
  }, []);

  const buyUpgrade = useCallback((upgradeId: keyof GameState['upgrades'], cost: number) => {
    setGameState(prev => {
      if (prev.dewdrops >= cost) {
        const xpGain = cost * 0.05; // Gain 5% of cost as XP
        const { xp, level, evolution } = calculateLevelAndXp(prev.xp + xpGain, prev.level);
        return {
          ...prev,
          dewdrops: prev.dewdrops - cost,
          xp, level, evolution,
          upgrades: {
            ...prev.upgrades,
            [upgradeId]: prev.upgrades[upgradeId] + 1
          }
        };
      }
      return prev;
    });
  }, []);

  const buyAccessory = useCallback((id: string, cost: number) => {
    setGameState(prev => {
      if (prev.dewdrops >= cost && !prev.inventory.includes(id)) {
        const xpGain = cost * 0.05; // Gain 5% of cost as XP
        const { xp, level, evolution } = calculateLevelAndXp(prev.xp + xpGain, prev.level);
        return {
          ...prev,
          dewdrops: prev.dewdrops - cost,
          xp, level, evolution,
          inventory: [...prev.inventory, id]
        };
      }
      return prev;
    });
  }, []);

  const toggleAccessory = useCallback((id: string, category: keyof GameState['equipped']) => {
    setGameState(prev => {
      const isEquipped = prev.equipped[category] === id;
      return {
        ...prev,
        equipped: {
          ...prev.equipped,
          [category]: isEquipped ? undefined : id
        }
      };
    });
  }, []);

  return { gameState, updateNeed, addXp, setName, clickDropli, buyUpgrade, addDewdrops, toggleSleep, buyAccessory, toggleAccessory, isLoaded, levelUpData, setLevelUpData };
}
