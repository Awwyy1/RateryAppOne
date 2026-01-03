
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { AnalysisResult, MetricData } from '../types';
import { useAuth } from '../contexts/AuthContext';
import Dashboard from './Dashboard';
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
  X
} from 'lucide-react';

interface Props {
  photo: string | null;
  analysisResult: AnalysisResult | null;
  onNewScan: () => void;
  onSignOut: () => void;
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

const Cabinet: React.FC<Props> = ({ photo, analysisResult, onNewScan, onSignOut }) => {
  const [activeTab, setActiveTab] = useState<TabType>('results');
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const [saveHistory, setSaveHistory] = useState(true);
  const [selectedHistoryScan, setSelectedHistoryScan] = useState<ScanHistoryItem | null>(null);
  const [lastSavedPhoto, setLastSavedPhoto] = useState<string | null>(null);
  const { user } = useAuth();

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ratery_scan_history');
    if (saved) {
      setScanHistory(JSON.parse(saved));
    }
    const savePref = localStorage.getItem('ratery_save_history');
    if (savePref !== null) {
      setSaveHistory(savePref === 'true');
    }
  }, []);

  // Save current scan to history
  useEffect(() => {
    if (analysisResult && photo && saveHistory && photo !== lastSavedPhoto) {
      const newScan: ScanHistoryItem = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        photo,
        score: analysisResult.overallScore,
        tier: getTier(analysisResult.overallScore),
        metrics: analysisResult.metrics,
        insights: analysisResult.insights
      };

      // Update history - add new scan at the beginning
      setScanHistory(prevHistory => {
        const updated = [newScan, ...prevHistory].slice(0, 10); // Keep max 10
        localStorage.setItem('ratery_scan_history', JSON.stringify(updated));
        return updated;
      });

      // Mark this photo as saved to prevent duplicates
      setLastSavedPhoto(photo);
    }
  }, [analysisResult, photo, saveHistory, lastSavedPhoto]);

  const getTier = (score: number) => {
    if (score >= 9) return 'LEGENDARY';
    if (score >= 7) return 'EPIC';
    if (score >= 5) return 'RARE';
    if (score >= 3) return 'COMMON';
    return 'BASIC';
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'LEGENDARY': return 'from-amber-500 to-yellow-300';
      case 'EPIC': return 'from-purple-500 to-pink-400';
      case 'RARE': return 'from-blue-500 to-cyan-400';
      case 'COMMON': return 'from-green-500 to-emerald-400';
      default: return 'from-gray-500 to-gray-400';
    }
  };

  const clearHistory = () => {
    setScanHistory([]);
    localStorage.removeItem('ratery_scan_history');
  };

  const deleteScan = (id: string) => {
    const updated = scanHistory.filter(s => s.id !== id);
    setScanHistory(updated);
    localStorage.setItem('ratery_scan_history', JSON.stringify(updated));
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
                    onClick={clearHistory}
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
                            <p className={`text-[10px] font-black uppercase tracking-widest bg-gradient-to-r ${getTierColor(scan.tier)} bg-clip-text text-transparent`}>
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
                          onClick={(e) => { e.stopPropagation(); deleteScan(scan.id); }}
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
                  onClick={clearHistory}
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
