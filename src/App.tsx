/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Gamepad2, Layers } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-neon-cyan selection:text-black">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon-cyan/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-neon-pink/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      {/* Navigation / Header */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-6 border-b border-zinc-800/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-900 rounded-lg shadow-neon-cyan border border-zinc-700">
            <Layers size={20} className="text-neon-cyan" />
          </div>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-[0.4em] text-white">Neon Rhythm</h1>
            <p className="text-[10px] text-zinc-500 font-mono tracking-widest">OS REV. 2.0.4</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-[11px] font-mono tracking-widest text-zinc-500 uppercase">
          <a href="#" className="hover:text-neon-cyan transition-colors">Neural Net</a>
          <a href="#" className="hover:text-neon-pink transition-colors">High Scores</a>
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800">
            <span className="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse" />
            <span>Server Stable</span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-20 grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-20 items-start">
        {/* Left Side: Game Section */}
        <div className="flex flex-col gap-8 order-2 lg:order-1">
          <div className="flex items-center gap-4 mb-4">
            <Gamepad2 className="text-neon-pink" size={32} />
            <div>
              <h2 className="text-3xl font-display font-black italic uppercase tracking-tighter text-white">Arcade Core</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-neon-pink to-transparent" />
            </div>
          </div>

          <div className="flex justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <SnakeGame />
            </motion.div>
          </div>
          
          <div className="mt-8 p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
            <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-4">Tactical Intelligence</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Latency', value: '4ms', color: 'text-neon-green' },
                { label: 'AI Seed', value: '0x7F2A', color: 'text-zinc-400' },
                { label: 'Environment', value: 'CYBER_CITY', color: 'text-zinc-400' }
              ].map(stat => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-[9px] text-zinc-600 uppercase font-mono">{stat.label}</span>
                  <span className={`text-sm font-bold font-mono ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Player Section */}
        <div className="order-1 lg:order-2 lg:sticky lg:top-12">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <MusicPlayer />
          </motion.div>
          
          <div className="mt-8 px-4">
            <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 mb-4">Instructions</h4>
            <ul className="space-y-3 text-xs text-zinc-400 font-mono italic">
              <li>• Arrow keys for movement manipulation</li>
              <li>• Collect energy nodes for system optimization</li>
              <li>• Avoid self-collision to maintain link</li>
              <li>• Neural audio sync recommended</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="relative z-20 py-12 border-t border-zinc-900/50 mt-20">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30 lowercase italic font-mono text-[11px]">
          <div>© 2026 neural_rhythm_industries</div>
          <div className="flex gap-8">
            <span>link_status: active</span>
            <span>node: ais-production-01</span>
            <span>enc: rsa_4096</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
