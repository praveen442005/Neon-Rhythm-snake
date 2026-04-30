import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, ListMusic, Volume2, Music2 } from 'lucide-react';
import { TRACKS } from '../constants';
import { Track } from '../types';

export default function MusicPlayer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = TRACKS[currentIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = (val / 100) * audioRef.current.duration;
      setProgress(val);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-sm bg-zinc-900/80 backdrop-blur-xl rounded-3xl border border-zinc-800 p-6 shadow-2xl relative overflow-hidden h-fit">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[60px] rounded-full" />
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Music2 size={18} className="text-neon-purple" />
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500 font-mono">Neural Player</h2>
        </div>
        <button 
          onClick={() => setShowPlaylist(!showPlaylist)}
          className={`p-2 rounded-lg transition ${showPlaylist ? 'bg-neon-purple text-black' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
        >
          <ListMusic size={20} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!showPlaylist ? (
          <motion.div 
            key="player"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-8 group">
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent z-10 rounded-2xl" />
              <img 
                src={currentTrack.coverUrl} 
                alt={currentTrack.title}
                className="w-48 h-48 object-cover rounded-2xl shadow-neon-purple grayscale group-hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              {isPlaying && (
                <div className="absolute -bottom-2 right-4 flex items-end gap-1 h-8 z-20">
                  {[1,2,3,4].map(i => (
                    <motion.div 
                      key={i}
                      animate={{ height: [8, 16, 12, 18, 10] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                      className="w-1 bg-neon-purple rounded-t-full"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-white mb-1 tracking-tight">{currentTrack.title}</h3>
              <p className="text-sm text-zinc-500 font-mono italic">{currentTrack.artist}</p>
            </div>

            <div className="w-full mb-8 space-y-4">
              <input 
                type="range" 
                value={progress}
                onChange={handleSeek}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-neon-purple"
              />
              <div className="flex justify-between items-center gap-4">
                <button onClick={prevTrack} className="p-3 text-zinc-500 hover:text-white transition"><SkipBack size={24} /></button>
                <button 
                  onClick={togglePlay}
                  className="w-16 h-16 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 active:scale-95 transition shadow-xl"
                >
                  {isPlaying ? <Pause size={28} fill="black" /> : <Play size={28} fill="black" className="ml-1" />}
                </button>
                <button onClick={nextTrack} className="p-3 text-zinc-500 hover:text-white transition"><SkipForward size={24} /></button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="playlist"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col gap-2 min-h-[400px]"
          >
            {TRACKS.map((track, idx) => (
              <button 
                key={track.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsPlaying(true);
                  setShowPlaylist(false);
                }}
                className={`flex items-center gap-4 p-3 rounded-xl transition group ${idx === currentIndex ? 'bg-zinc-800' : 'hover:bg-zinc-800/50'}`}
              >
                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={track.coverUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  {idx === currentIndex && isPlaying && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Volume2 size={16} className="text-neon-purple animate-pulse" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-start flex-1 min-w-0">
                  <span className={`text-sm font-bold truncate w-full ${idx === currentIndex ? 'text-neon-purple' : 'text-zinc-300'}`}>{track.title}</span>
                  <span className="text-xs text-zinc-500 font-mono italic">{track.artist}</span>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <audio 
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={onTimeUpdate}
        onEnded={nextTrack}
      />
    </div>
  );
}
