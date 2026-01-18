
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { AnalysisResult, MetricData } from '../types';
import { useAuth } from '../contexts/AuthContext';
import Dashboard from './Dashboard';
import { getTier, getTierGradient } from '../utils/tiers';
import {
  BarChart3,
  Clock,
  Settings,
  Plus,
  Trash2,
  LogOut,
  ChevronRight,
  Dna,
  User,
  Shield,
  Eye,
  EyeOff,
  Zap,
  ArrowLeft,
  X,
  AlertTriangle,
  CheckCircle,
  Crown,
  Sparkles,
  Infinity
} from 'lucide-react';
import { useSubscription, PLANS } from '../contexts/SubscriptionContext';

interface Props {
  photo: string | null;
  analysisResult: AnalysisResult | null;
  onNewScan: () => void;
  onSignOut: () => void;
  onShowPaywall?: () => void;
}

interface ScanHistoryItem {
  id: string;
  date: string;
  photo: string;
  score: number;
  tier: string;
  metrics: MetricData[];
  insights: string[];
}

type TabType = 'results' | 'history' | 'settings';

// Compress photo for localStorage storage (reduce size to ~50-100KB)
const compressPhoto = (base64: string, maxWidth = 400): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.6)); // 60% quality JPEG
      } else {
        resolve(base64);
      }
    };
    img.onerror = () => resolve(base64);
    img.src = base64;
  });
};

const Cabinet: React.FC<Props> = ({ photo, analysisResult, onNewScan, onSignOut, onShowPaywall }) => {
  const [activeTab, setActiveTab] = useState<TabType>('results');
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const [saveHistory, setSaveHistory] = useState(true);
  const [selectedHistoryScan, setSelectedHistoryScan] = useState<ScanHistoryItem | null>(null);
  const [lastSavedPhoto, setLastSavedPhoto] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<'all' | string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { user } = useAuth();
  const { currentPlan, isPremium, isPro, scansLeft, monthlyScansUsed, getCurrentPlanInfo, setPlan } = useSubscription();

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ratery_scan_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Validate data structure
        if (Array.isArray(parsed)) {
          setScanHistory(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to load scan history, clearing corrupted data');
      localStorage.removeItem('ratery_scan_history');
    }
    const savePref = localStorage.getItem('ratery_save_history');
    if (savePref !== null) {
      setSaveHistory(savePref === 'true');
    }
  }, []);

  // Save current scan to history (with compressed photo)
  useEffect(() => {
    if (analysisResult && photo && saveHistory && photo !== lastSavedPhoto) {
      // Mark as saved immediately to prevent duplicate saves
      setLastSavedPhoto(photo);

      // Compress and save asynchronously
      compressPhoto(photo).then(compressedPhoto => {
        const newScan: ScanHistoryItem = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          photo: compressedPhoto,
          score: analysisResult.overallScore,
          tier: getTier(analysisResult.overallScore),
          metrics: analysisResult.metrics,
          insights: analysisResult.insights
        };

        // Update history - add new scan at the beginning
        setScanHistory(prevHistory => {
          const updated = [newScan, ...prevHistory].slice(0, 10); // Keep max 10
          try {
            localStorage.setItem('ratery_scan_history', JSON.stringify(updated));
          } catch (e) {
            // localStorage quota exceeded - remove oldest scans
            console.warn('localStorage quota exceeded, trimming history');
            const trimmed = updated.slice(0, 5);
            localStorage.setItem('ratery_scan_history', JSON.stringify(trimmed));
            return trimmed;
          }
          return updated;
        });
      });
    }
  }, [analysisResult, photo, saveHistory, lastSavedPhoto]);

  // Using imported getTier from utils/tiers.ts
  // getTierColor now uses getTierGradient from utils

  // Show confirmation before clearing
  const requestClearHistory = () => {
    setDeleteTarget('all');
    setShowDeleteConfirm(true);
  };

  // Show confirmation before deleting single scan
  const requestDeleteScan = (id: string) => {
    setDeleteTarget(id);
    setShowDeleteConfirm(true);
  };

  // Actually perform the deletion
  const confirmDelete = () => {
    if (deleteTarget === 'all') {
      setScanHistory([]);
      localStorage.removeItem('ratery_scan_history');
      setSuccessMessage('All scan history has been deleted');
    } else if (deleteTarget) {
      const updated = scanHistory.filter(s => s.id !== deleteTarget);
      setScanHistory(updated);
      localStorage.setItem('ratery_scan_history', JSON.stringify(updated));
      setSuccessMessage('Scan deleted successfully');
    }
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
    setShowSuccessToast(true);
    // Auto-hide toast after 3 seconds
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
  };

  const toggleSaveHistory = () => {
    const newValue = !saveHistory;
    setSaveHistory(newValue);
    localStorage.setItem('ratery_save_history', String(newValue));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const item: Variants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', damping: 25 } }
  };

  const tabs = [
    { id: 'results' as TabType, label: 'Results', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'history' as TabType, label: 'History', icon: <Clock className="w-4 h-4" /> },
    { id: 'settings' as TabType, label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full"
    >
      {/* Tab Navigation */}
      <motion.div variants={item} className="mb-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'text-black'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-[#00f0ff] rounded-xl"
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </span>
              </button>
            ))}
          </div>

          {/* New Scan Button */}
          <motion.button
            onClick={onNewScan}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-white text-black font-black rounded-xl flex items-center gap-2 hover:bg-[#00f0ff] transition-all text-xs uppercase tracking-widest shadow-lg shadow-white/10"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Scan</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Dashboard photo={photo} analysisResult={analysisResult} />
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* History Header */}
            <div className="glass p-6 rounded-[2rem] border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black tracking-tight mb-1">Scan History</h2>
                  <p className="text-white/40 text-xs uppercase tracking-widest">
                    {scanHistory.length} {scanHistory.length === 1 ? 'scan' : 'scans'} saved
                  </p>
                </div>
                {scanHistory.length > 0 && (
                  <button
                    onClick={requestClearHistory}
                    className="px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-xl text-xs uppercase tracking-widest font-bold transition-all flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </button>
                )}
              </div>

              {scanHistory.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                    <Clock className="w-8 h-8 text-white/20" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white/60">No scans yet</h3>
                  <p className="text-white/30 text-sm mb-6">Your DNA scan history will appear here</p>
                  <button
                    onClick={onNewScan}
                    className="px-6 py-3 bg-[#00f0ff] text-black font-black rounded-xl text-xs uppercase tracking-widest"
                  >
                    Start First Scan
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {scanHistory.map((scan, index) => (
                    <motion.div
                      key={scan.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedHistoryScan(scan)}
                      className="group relative bg-white/5 rounded-2xl border border-white/10 overflow-hidden hover:border-[#00f0ff]/30 transition-all cursor-pointer"
                    >
                      {/* Photo */}
                      <div className="aspect-square relative">
                        <img
                          src={scan.photo}
                          alt={`Scan ${index + 1}`}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                        {/* View Analytics Hint */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                          <div className="px-4 py-2 bg-[#00f0ff]/90 text-black font-bold rounded-xl text-xs uppercase tracking-widest backdrop-blur-md">
                            View Analytics
                          </div>
                        </div>

                        {/* Score Badge */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                          <div>
                            <p className="text-3xl font-black">{scan.score.toFixed(1)}</p>
                            <p className={`text-[10px] font-black uppercase tracking-widest bg-gradient-to-r ${getTierGradient(scan.tier)} bg-clip-text text-transparent`}>
                              {scan.tier}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-white/40 uppercase tracking-wider">
                              {formatDate(scan.date)}
                            </p>
                          </div>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={(e) => { e.stopPropagation(); requestDeleteScan(scan.id); }}
                          className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-md rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/30"
                        >
                          <Trash2 className="w-4 h-4 text-white/60" />
                        </button>
                      </div>
                    </motion.div>
                  ))}

                  {/* New Scan Card */}
                  <motion.button
                    onClick={onNewScan}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: scanHistory.length * 0.05 }}
                    className="aspect-square bg-white/5 rounded-2xl border-2 border-dashed border-white/10 hover:border-[#00f0ff]/50 transition-all flex flex-col items-center justify-center gap-4 group"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/5 group-hover:bg-[#00f0ff]/10 flex items-center justify-center transition-all">
                      <Plus className="w-8 h-8 text-white/30 group-hover:text-[#00f0ff] transition-all" />
                    </div>
                    <span className="text-white/30 group-hover:text-white/60 text-xs uppercase tracking-widest font-bold transition-all">
                      New Scan
                    </span>
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Account Section */}
            <div className="glass p-8 rounded-[2rem] border border-white/5">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-[#00f0ff]" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-widest">Account</h3>
              </div>

              <div className="space-y-6">
                {/* User Info */}
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-14 h-14 rounded-xl" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-white/40" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">{user?.displayName || 'User'}</p>
                    <p className="text-white/40 text-sm truncate">{user?.email}</p>
                  </div>
                  <div className="px-3 py-1 bg-green-500/20 rounded-lg">
                    <span className="text-green-400 text-[10px] font-bold uppercase tracking-widest">Active</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Total Scans</p>
                    <p className="text-2xl font-black">{scanHistory.length}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Best Score</p>
                    <p className="text-2xl font-black text-[#00f0ff]">
                      {scanHistory.length > 0
                        ? Math.max(...scanHistory.map(s => s.score)).toFixed(1)
                        : '—'
                      }
                    </p>
                  </div>
                </div>

                {/* Sign Out */}
                <button
                  onClick={onSignOut}
                  className="w-full py-4 bg-red-500/10 border border-red-500/20 text-red-400 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all text-xs uppercase tracking-widest"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>

            {/* Subscription Section */}
            <div className={`glass p-8 rounded-[2rem] border ${
              isPro ? 'border-amber-500/20' : isPremium ? 'border-[#00f0ff]/20' : 'border-white/5'
            }`}>
              <div className="flex items-center gap-3 mb-8">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isPro ? 'bg-amber-500/10' : 'bg-[#00f0ff]/10'
                }`}>
                  {isPro ? (
                    <Sparkles className="w-5 h-5 text-amber-400" />
                  ) : isPremium ? (
                    <Crown className="w-5 h-5 text-[#00f0ff]" />
                  ) : (
                    <Zap className="w-5 h-5 text-[#00f0ff]" />
                  )}
                </div>
                <h3 className="text-lg font-black uppercase tracking-widest">Subscription</h3>
              </div>

              <div className="space-y-6">
                {/* Current Plan */}
                <div className={`p-5 rounded-2xl border ${
                  isPro
                    ? 'bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border-amber-500/30'
                    : isPremium
                    ? 'bg-gradient-to-br from-[#00f0ff]/10 to-purple-500/5 border-[#00f0ff]/30'
                    : 'bg-white/5 border-white/10'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Current Plan</p>
                      <p className={`text-2xl font-black ${
                        isPro ? 'text-amber-400' : isPremium ? 'text-[#00f0ff]' : 'text-white'
                      }`}>
                        {getCurrentPlanInfo().name}
                      </p>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      isPro
                        ? 'bg-amber-500/20 text-amber-400'
                        : isPremium
                        ? 'bg-[#00f0ff]/20 text-[#00f0ff]'
                        : 'bg-white/10 text-white/60'
                    }`}>
                      {getCurrentPlanInfo().price}{getCurrentPlanInfo().period}
                    </div>
                  </div>

                  {/* Scans Info */}
                  <div className="flex items-center gap-3 text-sm">
                    {scansLeft === 'unlimited' ? (
                      <>
                        <Infinity className="w-4 h-4 text-amber-400" />
                        <span className="text-amber-400 font-bold">Unlimited Scans</span>
                      </>
                    ) : isPremium ? (
                      <>
                        <Zap className="w-4 h-4 text-[#00f0ff]" />
                        <span className="text-white/70">
                          <span className="font-bold text-[#00f0ff]">{scansLeft}</span> scans remaining this month
                        </span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 text-white/40" />
                        <span className="text-white/70">
                          <span className="font-bold">{scansLeft}</span> free scan{Number(scansLeft) !== 1 ? 's' : ''} left
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Upgrade Button */}
                {!isPro && onShowPaywall && (
                  <button
                    onClick={onShowPaywall}
                    className={`w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                      isPremium
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:shadow-lg hover:shadow-amber-500/30'
                        : 'bg-gradient-to-r from-[#00f0ff] to-cyan-400 text-black hover:shadow-lg hover:shadow-[#00f0ff]/30'
                    }`}
                  >
                    {isPremium ? (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Upgrade to Pro
                      </>
                    ) : (
                      <>
                        <Crown className="w-4 h-4" />
                        Upgrade Plan
                      </>
                    )}
                  </button>
                )}

                {/* Plan Features */}
                <div className="space-y-2">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Plan Features</p>
                  <ul className="space-y-2">
                    {getCurrentPlanInfo().features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className={`w-4 h-4 shrink-0 ${
                          isPro ? 'text-amber-400' : isPremium ? 'text-[#00f0ff]' : 'text-white/40'
                        }`} />
                        <span className="text-white/70">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Test Mode - Manual Plan Switch */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-3">Test Mode</p>
                  <div className="flex flex-wrap gap-2">
                    {PLANS.map((plan) => (
                      <button
                        key={plan.id}
                        onClick={() => setPlan(plan.id)}
                        className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                          currentPlan === plan.id
                            ? plan.id === 'pro'
                              ? 'bg-amber-500 text-black'
                              : plan.id === 'premium'
                              ? 'bg-[#00f0ff] text-black'
                              : 'bg-white/20 text-white'
                            : 'bg-white/5 text-white/40 hover:bg-white/10'
                        }`}
                      >
                        {plan.name}
                      </button>
                    ))}
                  </div>
                  <p className="text-[9px] text-white/20 mt-2">Для тестирования функций разных планов</p>
                </div>
              </div>
            </div>

            {/* Privacy Section */}
            <div className="glass p-8 rounded-[2rem] border border-white/5">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#00f0ff]" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-widest">Privacy</h3>
              </div>

              <div className="space-y-4">
                {/* Save History Toggle */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                    {saveHistory ? (
                      <Eye className="w-5 h-5 text-[#00f0ff]" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-white/40" />
                    )}
                    <div>
                      <p className="font-bold text-sm">Save Scan History</p>
                      <p className="text-white/40 text-xs">Store scans locally on this device</p>
                    </div>
                  </div>
                  <button
                    onClick={toggleSaveHistory}
                    className={`w-14 h-8 rounded-full transition-all relative ${
                      saveHistory ? 'bg-[#00f0ff]' : 'bg-white/10'
                    }`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-lg ${
                      saveHistory ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                </div>

                {/* Clear Data */}
                <button
                  onClick={requestClearHistory}
                  className="w-full py-4 bg-white/5 border border-white/10 text-white/60 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-xs uppercase tracking-widest"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All Data
                </button>

                {/* Privacy Info */}
                <div className="p-4 bg-[#00f0ff]/5 rounded-2xl border border-[#00f0ff]/20">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-[#00f0ff] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm mb-1 text-[#00f0ff]">Your Privacy Matters</p>
                      <p className="text-white/50 text-xs leading-relaxed">
                        Photos are processed by AI and immediately deleted. We never store your images on our servers.
                        History is saved only on your device.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="lg:col-span-2 glass p-8 rounded-[2rem] border border-white/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/10 flex items-center justify-center">
                  <Dna className="w-5 h-5 text-[#00f0ff]" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-widest">About Ratery</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5 group hover:border-[#00f0ff]/30 transition-all">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Version</p>
                  <p className="font-bold group-hover:text-[#00f0ff] transition-all">1.0.0</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5 group hover:border-[#00f0ff]/30 transition-all">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">AI Model</p>
                  <p className="font-bold group-hover:text-[#00f0ff] transition-all">Claude Vision</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5 group hover:border-[#00f0ff]/30 transition-all">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Built By</p>
                  <p className="font-bold group-hover:text-[#00f0ff] transition-all">Ratery Intelligence</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={cancelDelete}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative w-full max-w-md bg-[#0a0a0a] rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="p-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black">
                      {deleteTarget === 'all' ? 'Delete All Data?' : 'Delete Scan?'}
                    </h3>
                    <p className="text-white/40 text-sm">This action cannot be undone</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-white/60 text-sm leading-relaxed">
                  {deleteTarget === 'all'
                    ? 'Are you sure you want to delete all your scan history? This will permanently remove all saved scans from your device.'
                    : 'Are you sure you want to delete this scan? This will permanently remove it from your history.'
                  }
                </p>
              </div>

              {/* Actions */}
              <div className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
                <motion.button
                  onClick={cancelDelete}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-2xl text-sm uppercase tracking-widest hover:bg-white/20 transition-all"
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={confirmDelete}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-4 bg-red-500 text-white font-bold rounded-2xl text-sm uppercase tracking-widest hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {deleteTarget === 'all' ? 'Delete All' : 'Delete'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[500] px-6 py-4 bg-green-500/20 border border-green-500/30 backdrop-blur-xl rounded-2xl flex items-center gap-3 shadow-2xl"
          >
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="font-bold text-white">{successMessage}</p>
              <p className="text-green-400/60 text-xs">Data removed from device</p>
            </div>
            <button
              onClick={() => setShowSuccessToast(false)}
              className="ml-4 p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <X className="w-4 h-4 text-white/60" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Scan Analytics Modal */}
      <AnimatePresence>
        {selectedHistoryScan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-[#050505] overflow-y-auto"
          >
            {/* Header with Back Button - positioned below app header */}
            <div className="sticky top-0 z-10 bg-[#050505]/95 backdrop-blur-md border-b border-white/10 px-6 py-4 mt-20">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <motion.button
                  onClick={() => setSelectedHistoryScan(null)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 px-5 py-3 bg-white/10 hover:bg-[#00f0ff]/20 border border-white/20 hover:border-[#00f0ff]/50 rounded-xl transition-all text-sm font-bold"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to History
                </motion.button>
                <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-widest">
                  <Clock className="w-4 h-4" />
                  {formatDate(selectedHistoryScan.date)}
                </div>
                <motion.button
                  onClick={() => setSelectedHistoryScan(null)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-white/10 hover:bg-red-500/20 border border-white/20 hover:border-red-500/50 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Analytics Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
              <Dashboard
                photo={selectedHistoryScan.photo}
                analysisResult={{
                  overallScore: selectedHistoryScan.score,
                  metrics: selectedHistoryScan.metrics,
                  insights: selectedHistoryScan.insights
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Cabinet;
