export interface Track {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string; // Using dummy URLs or placeholders
}

export interface GameState {
  score: number;
  highScore: number;
  isGameOver: boolean;
  isPaused: boolean;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Point {
  x: number;
  y: number;
}
