
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
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import { LogOut, User, Crown, CheckCircle, X, Sparkles } from 'lucide-react';

const AppContent: React.FC = () => {
  const [stage, setStage] = useState<AppStage>(AppStage.LANDING);
  const [photo, setPhoto] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [hasCompletedScan, setHasCompletedScan] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const { user, signOut, loading } = useAuth();
  const { canScan, incrementScanCount, isPremium, isPro, scansLeft, currentPlan, setPlan } = useSubscription();

  // Handle payment redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const planParam = urlParams.get('plan');

    if (paymentStatus === 'success') {
      // Set user plan based on what they purchased
      if (planParam === 'pro') {
        setPlan('pro');
      } else {
        setPlan('premium');
      }
      setShowPaymentSuccess(true);
      // Clear URL parameter
      window.history.replaceState({}, '', window.location.pathname);
      // Auto-hide success message
      setTimeout(() => setShowPaymentSuccess(false), 5000);
    }
  }, [setPlan]);

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

  const previousStageRef = React.useRef<AppStage>(AppStage.LANDING);
  const handleShowLegal = (page: AppStage.PRIVACY | AppStage.TERMS) => {
    previousStageRef.current = stage;
    setStage(page);
  };
  const handleLegalBack = () => {
    setStage(previousStageRef.current);
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

      <header className="fixed top-0 left-0 right-0 z-[100] px-4 md:px-10 py-4 md:py-6 flex justify-between items-center backdrop-blur-md border-b border-white/5">
        {/* Logo - left aligned */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 md:gap-3 shrink-0"
        >
          <div className="w-8 h-8 md:w-10 md:h-10 bg-white text-black flex items-center justify-center font-black rounded-full text-sm md:text-lg">R</div>
          <span className="text-xs md:text-sm font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase">Ratery.System</span>
        </motion.div>

        {/* Center nav - hidden on mobile */}
        <nav className="hidden lg:flex gap-8 text-[10px] font-bold uppercase tracking-widest text-white/40">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#00f0ff] rounded-full animate-pulse" />
            AI Powered
          </span>
          <span className="text-white/20">|</span>
          <span>DNA Scanner</span>
        </nav>

        {/* User controls */}
        {user ? (
          <div className="flex items-center gap-2 md:gap-4">
            {/* Plan badge or upgrade button */}
            {isPro ? (
              <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 rounded-full">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-amber-400" />
                <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-wider md:tracking-widest text-amber-400">Pro</span>
              </div>
            ) : isPremium ? (
              <motion.button
                onClick={() => setShowPaywall(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-[#00f0ff]/20 to-purple-500/20 border border-[#00f0ff]/30 rounded-full"
              >
                <Crown className="w-3 h-3 md:w-4 md:h-4 text-[#00f0ff]" />
                <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-wider md:tracking-widest text-[#00f0ff]">
                  {scansLeft} left
                </span>
              </motion.button>
            ) : (
              <motion.button
                onClick={() => setShowPaywall(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 px-2 md:px-3 py-1 md:py-1.5 bg-white/5 border border-white/10 rounded-full hover:border-[#00f0ff]/30 transition-all"
              >
                <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-wider text-white/60">
                  {scansLeft === 'unlimited' ? '∞' : scansLeft} free
                </span>
              </motion.button>
            )}
            {/* User avatar + name - name hidden on mobile */}
            <div className="flex items-center gap-2 px-2 md:px-4 py-1.5 md:py-2 bg-white/5 border border-white/10 rounded-full">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-5 h-5 md:w-6 md:h-6 rounded-full" />
              ) : (
                <User className="w-4 h-4 text-[#00f0ff]" />
              )}
              <span className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-white/60 max-w-[80px] md:max-w-[100px] truncate">
                {user.displayName || user.email}
              </span>
            </div>
            {/* Logout button */}
            <motion.button
              onClick={handleSignOut}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 md:p-2 bg-white/5 border border-white/10 rounded-full hover:bg-red-500/20 hover:border-red-500/30 transition-all"
            >
              <LogOut className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </motion.button>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 md:px-6 py-1.5 md:py-2 bg-white/5 border border-white/10 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
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
              onShowPaywall={() => setShowPaywall(true)}
            />
          )}
          {stage === AppStage.PRIVACY && (
            <PrivacyPolicy key="privacy" onBack={handleLegalBack} />
          )}
          {stage === AppStage.TERMS && (
            <TermsOfService key="terms" onBack={handleLegalBack} />
          )}
        </AnimatePresence>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-[100] px-4 md:px-10 py-3 md:py-4 flex justify-between items-center border-t border-white/5 backdrop-blur-sm bg-[#050505]/80">
        <div className="hidden md:flex items-center gap-2">
          <div className="w-1 h-6 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="w-full bg-[#00f0ff]"
              animate={{ height: ['0%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <span className="text-[8px] uppercase tracking-widest text-white/20 font-bold">Active</span>
        </div>
        <div className="flex items-center gap-4 md:gap-6 pointer-events-auto">
          <button
            onClick={() => handleShowLegal(AppStage.PRIVACY)}
            className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-white/20 font-mono hover:text-[#00f0ff] transition-colors"
          >
            Privacy
          </button>
          <button
            onClick={() => handleShowLegal(AppStage.TERMS)}
            className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-white/20 font-mono hover:text-[#00f0ff] transition-colors"
          >
            Terms
          </button>
          <span className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-white/20 font-mono">
            ©2026 Ratery
          </span>
        </div>
      </footer>

      {/* Paywall Modal */}
      <AnimatePresence>
        {showPaywall && (
          <Paywall onClose={() => setShowPaywall(false)} />
        )}
      </AnimatePresence>

      {/* Payment Success Toast */}
      <AnimatePresence>
        {showPaymentSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[500] px-6 md:px-8 py-4 md:py-5 backdrop-blur-xl rounded-2xl flex items-center gap-3 md:gap-4 shadow-2xl ${
              isPro
                ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30'
                : 'bg-gradient-to-r from-[#00f0ff]/20 to-purple-500/20 border border-[#00f0ff]/30'
            }`}
          >
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${
              isPro ? 'bg-amber-500/20' : 'bg-[#00f0ff]/20'
            }`}>
              {isPro ? (
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
              ) : (
                <Crown className="w-5 h-5 md:w-6 md:h-6 text-[#00f0ff]" />
              )}
            </div>
            <div>
              <p className="font-black text-base md:text-lg text-white">
                Welcome to {isPro ? 'Pro' : 'Premium'}!
              </p>
              <p className={`text-xs md:text-sm ${isPro ? 'text-amber-400/80' : 'text-[#00f0ff]/80'}`}>
                {isPro ? 'Enjoy unlimited scans forever' : 'Enjoy 49 scans per month'}
              </p>
            </div>
            <button
              onClick={() => setShowPaymentSuccess(false)}
              className="ml-2 md:ml-4 p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <X className="w-4 h-4 md:w-5 md:h-5 text-white/60" />
            </button>
          </motion.div>
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
