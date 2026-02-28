export interface GameState {
  name: string;
  minerals: number;
  hydration: number;
  happiness: number;
  sleep: number;
  xp: number;
  level: number;
  evolution: number;
  lastTimestamp: number;
  dewdrops: number;
  isSleeping: boolean;
  inventory: string[];
  equipped: {
    hat?: string;
    face?: string;
    neck?: string;
  };
  upgrades: {
    clickPower: number;
    autoGather: number;
    resilience: number;
  };
}

export type Screen = 'home' | 'minigames' | 'stats' | 'evolution' | 'shop';
