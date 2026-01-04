
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { AppStage, AnalysisResult } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SubscriptionProvider, useSubscription } from './contexts/SubscriptionContext';
import Landing from './components/Landing';
import Onboarding from './components/Onboarding';
import Login from './components/Login';
import PhotoUpload from './components/PhotoUpload';
import Scanning from './components/Scanning';
import Cabinet from './components/Cabinet';
import Paywall from './components/Paywall';
import { LogOut, User, Crown } from 'lucide-react';

const AppContent: React.FC = () => {
  const [stage, setStage] = useState<AppStage>(AppStage.LANDING);
  const [photo, setPhoto] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [hasCompletedScan, setHasCompletedScan] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const { user, signOut, loading } = useAuth();
  const { canScan, incrementScanCount, isPremium, freeScansLeft } = useSubscription();

  // Redirect logged-in users with scan history directly to Cabinet
  useEffect(() => {
    if (!loading && user) {
      // Check if user has scan history
      const savedHistory = localStorage.getItem('ratery_scan_history');
      if (savedHistory) {
        try {
          const history = JSON.parse(savedHistory);
          if (Array.isArray(history) && history.length > 0) {
            setHasCompletedScan(true);
            setStage(AppStage.DASHBOARD);
            return;
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
      // User is logged in but no history - go to upload
      if (stage === AppStage.LANDING) {
        setStage(AppStage.UPLOAD);
      }
    }
  }, [user, loading]);

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
  const handleOnboardingComplete = () => {
    // If user is already logged in, go directly to upload
    if (user) {
      setStage(AppStage.UPLOAD);
    } else {
      setStage(AppStage.LOGIN);
    }
  };

  const handleLoginSuccess = () => setStage(AppStage.UPLOAD);

  const handlePhotoSelected = (img: string) => {
    // Check if user can scan (premium or has free scans left)
    if (!canScan) {
      setShowPaywall(true);
      return;
    }
    setPhoto(img);
    setStage(AppStage.SCANNING);
  };

  const handleScanComplete = (result: AnalysisResult | null, error?: string) => {
    if (error || !result) {
      // If there's an error (invalid face), go back to upload
      setPhoto(null);
      setStage(AppStage.UPLOAD);
      return;
    }
    // Increment scan count for non-premium users
    incrementScanCount();
    setAnalysisResult(result);
    setHasCompletedScan(true);
    setStage(AppStage.DASHBOARD);
  };

  const handleSignOut = async () => {
    await signOut();
    setStage(AppStage.LANDING);
    setPhoto(null);
    setAnalysisResult(null);
  };

  const handleNewScan = () => {
    setPhoto(null);
    setAnalysisResult(null);
    setStage(AppStage.UPLOAD);
  };

  const handleCancelUpload = () => {
    // Go back to Dashboard if user has completed at least one scan
    if (hasCompletedScan) {
      setStage(AppStage.DASHBOARD);
    }
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

        <nav className="hidden md:flex gap-8 text-[10px] font-bold uppercase tracking-widest text-white/40">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#00f0ff] rounded-full animate-pulse" />
            AI Powered
          </span>
          <span className="text-white/20">|</span>
          <span>DNA Scanner</span>
        </nav>

        {user ? (
          <div className="flex items-center gap-4">
            {/* Premium badge or upgrade button */}
            {isPremium ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#00f0ff]/20 to-purple-500/20 border border-[#00f0ff]/30 rounded-full">
                <Crown className="w-4 h-4 text-[#00f0ff]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#00f0ff]">Premium</span>
              </div>
            ) : (
              <motion.button
                onClick={() => setShowPaywall(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full hover:border-[#00f0ff]/30 transition-all"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                  {freeScansLeft} free
                </span>
              </motion.button>
            )}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-6 h-6 rounded-full" />
              ) : (
                <User className="w-4 h-4 text-[#00f0ff]" />
              )}
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 max-w-[100px] truncate">
                {user.displayName || user.email}
              </span>
            </div>
            <motion.button
              onClick={handleSignOut}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-white/5 border border-white/10 rounded-full hover:bg-red-500/20 hover:border-red-500/30 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </motion.button>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
          >
            Access Console
          </motion.button>
        )}
      </header>

      <main className="pt-24 md:pt-32 pb-24 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {stage === AppStage.LANDING && (
            <Landing key="landing" onStart={handleStart} />
          )}
          {stage === AppStage.ONBOARDING && (
            <Onboarding key="onboarding" onComplete={handleOnboardingComplete} />
          )}
          {stage === AppStage.LOGIN && (
            <Login key="login" onSuccess={handleLoginSuccess} />
          )}
          {stage === AppStage.UPLOAD && (
            <PhotoUpload
              key="upload"
              onPhotoSelected={handlePhotoSelected}
              onCancel={hasCompletedScan ? handleCancelUpload : undefined}
            />
          )}
          {stage === AppStage.SCANNING && (
            <Scanning key="scanning" photo={photo} onComplete={handleScanComplete} />
          )}
          {stage === AppStage.DASHBOARD && (
            <Cabinet
              key="cabinet"
              photo={photo}
              analysisResult={analysisResult}
              onNewScan={handleNewScan}
              onSignOut={handleSignOut}
            />
          )}
        </AnimatePresence>
      </main>

      <footer className="hidden md:flex fixed bottom-8 left-10 right-10 justify-between items-end pointer-events-none z-[100]">
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

      {/* Paywall Modal */}
      <AnimatePresence>
        {showPaywall && (
          <Paywall onClose={() => setShowPaywall(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <AppContent />
      </SubscriptionProvider>
    </AuthProvider>
  );
};

export default App;
