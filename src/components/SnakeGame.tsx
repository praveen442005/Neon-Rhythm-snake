import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, INITIAL_SPEED, MIN_SPEED } from '../constants';
import { Direction, Point } from '../types';
import { Trophy, RotateCcw, Play, Pause } from 'lucide-react';

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    setFood(newFood);
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
    generateFood(INITIAL_SNAKE);
  };

  const wrapPosition = (pos: number) => {
    if (pos < 0) return GRID_SIZE - 1;
    if (pos >= GRID_SIZE) return 0;
    return pos;
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      newHead.x = wrapPosition(newHead.x);
      newHead.y = wrapPosition(newHead.y);

      // Collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        setIsPaused(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Eat food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(prev => {
          const next = prev + 10;
          setSpeed(s => Math.max(MIN_SPEED, s - 2));
          return next;
        });
        generateFood(newSnake);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, score, highScore, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': 
          if (isGameOver) resetGame();
          else setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isGameOver]);

  useEffect(() => {
    const loop = (time: number) => {
      if (time - lastUpdateRef.current > speed) {
        moveSnake();
        lastUpdateRef.current = time;
      }
      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [moveSnake, speed]);

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-zinc-900 shadow-2xl rounded-3xl border border-zinc-800 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full" />
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-pink-500/10 blur-[100px] rounded-full" />

      <div className="flex justify-between w-full max-w-[400px] items-end">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">Current Score</span>
          <span className="text-4xl font-bold font-mono text-glow-cyan text-neon-cyan">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">Best Session</span>
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-neon-pink" />
            <span className="text-xl font-bold font-mono text-zinc-300">{highScore}</span>
          </div>
        </div>
      </div>

      <div className="relative group">
        <div 
          className="grid gap-px p-1 bg-zinc-800 rounded-lg shadow-neon-purple border border-zinc-700/50"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            width: 'min(80vw, 400px)',
            height: 'min(80vw, 400px)'
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnakeHead = snake[0].x === x && snake[0].y === y;
            const isSnakeBody = snake.slice(1).some(s => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i} 
                className={`w-full h-full rounded-[1px] transition-all duration-300 ${
                  isSnakeHead ? 'bg-neon-cyan shadow-[0_0_8px_#00ffff]' :
                  isSnakeBody ? 'bg-neon-cyan/40' :
                  isFood ? 'bg-neon-pink animate-pulse shadow-[0_0_8px_#ff00ff]' :
                  'bg-zinc-900/50'
                }`}
              />
            );
          })}
        </div>

        <AnimatePresence>
          {(isGameOver || (isPaused && score === 0)) && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-lg z-10"
            >
              {isGameOver ? (
                <>
                  <h2 className="text-3xl font-bold text-neon-pink text-glow-pink mb-2 font-display uppercase tracking-widest">Game Over</h2>
                  <p className="text-zinc-400 mb-6 font-mono">Final Score: {score}</p>
                  <button 
                    onClick={resetGame}
                    className="flex items-center gap-2 px-6 py-3 bg-neon-pink text-white rounded-full font-bold hover:shadow-neon-pink transition-all active:scale-95"
                  >
                    <RotateCcw size={18} />
                    Try Again
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-neon-cyan text-glow-cyan mb-2 font-display uppercase tracking-widest">Ready?</h2>
                  <p className="text-zinc-400 mb-6 font-mono">Use Arrows to Move</p>
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="flex items-center gap-2 px-8 py-3 bg-neon-cyan text-black rounded-full font-bold hover:shadow-neon-cyan transition-all active:scale-95"
                  >
                    <Play size={18} fill="black" />
                    Start Game
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4">
        {!isGameOver && (
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className="p-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition"
          >
            {isPaused ? <Play size={20} className="text-neon-cyan" fill="currentColor" /> : <Pause size={20} className="text-neon-cyan" fill="currentColor" />}
          </button>
        )}
        <button 
          onClick={resetGame}
          className="p-3 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition"
        >
          <RotateCcw size={20} className="text-zinc-400" />
        </button>
      </div>

      <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-[0.2em]">
        Space to Pause / Start
      </div>
    </div>
  );
}
