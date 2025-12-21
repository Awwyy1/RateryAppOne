
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { AppStage } from './types';
import Landing from './components/Landing';
import Onboarding from './components/Onboarding';
import PhotoUpload from './components/PhotoUpload';
import Scanning from './components/Scanning';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>(AppStage.LANDING);
  const [photo, setPhoto] = useState<string | null>(null);

  // Mouse tracking for custom cursor and spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { damping: 20, stiffness: 200 });
  const smoothMouseY = useSpring(mouseY, { damping: 20, stiffness: 200 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const handleStart = () => setStage(AppStage.ONBOARDING);
  const handleOnboardingComplete = () => setStage(AppStage.UPLOAD);
  
  const handlePhotoSelected = (img: string) => {
    setPhoto(img);
    setStage(AppStage.SCANNING);
  };

  const handleScanComplete = () => {
    setStage(AppStage.DASHBOARD);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white cyber-grid relative selection:bg-[#00f0ff] selection:text-black">
      {/* Spotlight Effect */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(600px circle at ${smoothMouseX}px ${smoothMouseY}px, rgba(0, 240, 255, 0.03), transparent 80%)`
        }}
      />

      {/* Custom Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-[#00f0ff] rounded-full mix-blend-difference pointer-events-none z-[10000]"
        style={{ x: smoothMouseX, y: smoothMouseY, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-[#00f0ff]/30 rounded-full pointer-events-none z-[9999]"
        style={{ x: smoothMouseX, y: smoothMouseY, translateX: '-50%', translateY: '-50%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 150 }}
      />

      <header className="fixed top-0 left-0 right-0 z-[100] px-10 py-6 flex justify-between items-center backdrop-blur-md border-b border-white/5">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black rounded-full text-lg">R</div>
          <span className="text-sm font-bold tracking-[0.3em] uppercase">Ratery.System</span>
        </motion.div>
        
        <nav className="hidden md:flex gap-10 text-[10px] font-bold uppercase tracking-widest text-white/40">
          <a href="#" className="hover:text-white transition-colors">Architecture</a>
          <a href="#" className="hover:text-white transition-colors">Protocols</a>
          <a href="#" className="hover:text-white transition-colors">Nodes</a>
        </nav>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
        >
          Access Console
        </motion.button>
      </header>

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {stage === AppStage.LANDING && (
            <Landing key="landing" onStart={handleStart} />
          )}
          {stage === AppStage.ONBOARDING && (
            <Onboarding key="onboarding" onComplete={handleOnboardingComplete} />
          )}
          {stage === AppStage.UPLOAD && (
            <PhotoUpload key="upload" onPhotoSelected={handlePhotoSelected} />
          )}
          {stage === AppStage.SCANNING && (
            <Scanning key="scanning" photo={photo} onComplete={handleScanComplete} />
          )}
          {stage === AppStage.DASHBOARD && (
            <Dashboard key="dashboard" photo={photo} />
          )}
        </AnimatePresence>
      </main>

      <footer className="fixed bottom-8 left-10 right-10 flex justify-between items-end pointer-events-none z-[100]">
        <div className="flex flex-col gap-1">
          <div className="w-1 h-12 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="w-full bg-[#00f0ff]"
              animate={{ height: ['0%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <span className="text-[8px] uppercase tracking-widest text-white/20 vertical-text mt-4">Active</span>
        </div>
        <div className="text-[9px] uppercase tracking-[0.4em] text-white/20 font-mono">
          ©2025 Ratery Intelligence Corp // All Rights Reserved
        </div>
      </footer>
    </div>
  );
};

export default App;
