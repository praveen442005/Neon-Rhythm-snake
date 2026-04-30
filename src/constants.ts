import { Track } from './types';

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cyber Pulse',
    artist: 'AI Voyager',
    coverUrl: 'https://picsum.photos/seed/cyberpulse/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: '2',
    title: 'Neon Nights',
    artist: 'Vapor Ghost',
    coverUrl: 'https://picsum.photos/seed/neonnights/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: '3',
    title: 'Glitch Core',
    artist: 'Binary Beast',
    coverUrl: 'https://picsum.photos/seed/glitchcore/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];

export const GRID_SIZE = 20;
export const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
export const INITIAL_DIRECTION = 'UP';
export const INITIAL_SPEED = 150;
export const MIN_SPEED = 60;
