
import React, { useState, useRef } from 'react';
// Import Variants to correctly type motion configurations and ensure literal types like 'spring' are preserved
import { motion, Variants, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { MOCK_RESULTS, INSIGHTS, MARKERS_BY_PLAN } from '../constants';
import { AnalysisResult, MetricData } from '../types';
import RadarChart from './RadarChart';
import NeuralIdentityCard from './NeuralIdentityCard';
import { getTier, getTierInfo, getNextTier } from '../utils/tiers';
import { Download, Share2, Target, Zap, Shield, Cpu, Check, X, Dna, TrendingUp, Lock, Crown } from 'lucide-react';
import { useSubscription } from '../contexts/SubscriptionContext';

interface Props {
  photo: string | null;
  analysisResult: AnalysisResult | null;
}

const Dashboard: React.FC<Props> = ({ photo, analysisResult }) => {
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied' | 'shared'>('idle');
  const [isDownloading, setIsDownloading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<MetricData | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const { currentPlan } = useSubscription();

  // Use real analysis results if available, otherwise fall back to mocks
  const metrics = analysisResult?.metrics || MOCK_RESULTS;
  const insights = analysisResult?.insights || INSIGHTS;
  const overallScore = analysisResult?.overallScore || 8.4;

  // Determine how many markers to show based on plan
  const visibleMarkersCount = MARKERS_BY_PLAN[currentPlan] || 3;
  const isMarkerVisible = (index: number) => index < visibleMarkersCount;

  // Get tier info for display
  const tierInfo = getTierInfo(getTier(overallScore));
  const nextTierInfo = getNextTier(overallScore);

  // Share text for social media
  const getShareText = () => `Just decoded my Social DNA. Vibe Score: ${overallScore.toFixed(1)}/10. Status: ${getTier(overallScore)}. What is YOUR Social DNA?`;
  const shareUrl = 'https://ratery.cc';

  // Open share modal
  const handleShare = () => {
    setShowShareModal(true);
  };

  // Share to Twitter/X
  const shareToTwitter = () => {
    const text = encodeURIComponent(getShareText());
    const url = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=600,height=400');
    setShowShareModal(false);
    setShareStatus('shared');
    setTimeout(() => setShareStatus('idle'), 2000);
  };

  // Share to Instagram (copy to clipboard since IG doesn't have web share API)
  const shareToInstagram = async () => {
    try {
      await navigator.clipboard.writeText(`${getShareText()}\n\n${shareUrl}`);
      setShareStatus('copied');
      setShowShareModal(false);
      // Open Instagram
      window.open('https://instagram.com', '_blank');
      setTimeout(() => setShareStatus('idle'), 3000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  // Share to Threads
  const shareToThreads = () => {
    const text = encodeURIComponent(`${getShareText()}\n\n${shareUrl}`);
    window.open(`https://www.threads.net/intent/post?text=${text}`, '_blank', 'width=600,height=400');
    setShowShareModal(false);
    setShareStatus('shared');
    setTimeout(() => setShareStatus('idle'), 2000);
  };

  // Open download modal with card preview
  const handleDownload = () => {
    setShowDownloadModal(true);
  };

  // Actually download the card as PNG
  const downloadCard = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#080808',
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `ratery-dna-card-${Date.now()}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }, 'image/png');

    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Explicitly type variants to avoid 'string' vs literal type mismatches in framer-motion transitions
  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  // Explicitly type variants to avoid 'string' vs literal type mismatches in framer-motion transitions
  const bentoItem: Variants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', damping: 25 } }
  };

  return (
    <motion.div
      ref={reportRef}
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-20"
    >
      {/* Subject Identity - Card 1 */}
      <motion.div variants={bentoItem} className="md:col-span-4 lg:col-span-3 flex flex-col gap-6">
        <div className="glass p-6 rounded-[2.5rem] relative group overflow-hidden border-white/5">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10" />

          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-6 border border-white/5 shadow-2xl">
            {photo && <img src={photo} alt="Subject" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />}
            <div className="absolute top-4 left-4 flex gap-2 z-20">
              <span className="px-2 py-1 bg-black/50 backdrop-blur-md rounded text-[8px] font-mono font-bold border border-white/10 uppercase">DNA Verified</span>
            </div>
            {analysisResult && (
              <div className="absolute bottom-4 right-4 z-20">
                <span className="px-2 py-1 bg-[#00f0ff]/20 backdrop-blur-md rounded text-[8px] font-mono font-bold border border-[#00f0ff]/30 uppercase text-[#00f0ff]">DNA Decoded</span>
              </div>
            )}
          </div>

          <div className="space-y-4 relative z-20">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mb-1">Vibe Score</p>
                <p className="text-5xl font-black tracking-tighter">{overallScore.toFixed(1)}<span className="text-sm font-bold text-white/20">/10</span></p>
              </div>
              <div className="w-12 h-12 rounded-full border border-[#00f0ff]/30 flex items-center justify-center bg-[#00f0ff]/5">
                <Target className="w-6 h-6 text-[#00f0ff]" />
              </div>
            </div>

            {/* Status/Tier Display */}
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
              <div>
                <p className="text-[8px] uppercase tracking-widest text-white/40 font-bold">Status</p>
                <p className="text-lg font-black" style={{ color: tierInfo.color }}>{tierInfo.name}</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] uppercase tracking-widest text-white/40 font-bold">Match</p>
                <p className="text-lg font-black text-white">{(overallScore * 10).toFixed(1)}%</p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-2">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full py-4 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-[#00f0ff] transition-all text-xs uppercase tracking-widest disabled:opacity-50"
              >
                {isDownloading ? (
                  <>
                    <motion.div
                      className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" /> Download DNA Card
                  </>
                )}
              </button>
              <button
                onClick={handleShare}
                className="w-full py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-xs uppercase tracking-widest"
              >
                {shareStatus === 'copied' ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" /> Copied to Clipboard
                  </>
                ) : shareStatus === 'shared' ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" /> Shared!
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" /> Share My DNA
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Analysis Radar - Card 2 */}
      <motion.div variants={bentoItem} className="md:col-span-8 lg:col-span-6 flex flex-col">
        <div className="glass p-5 md:p-10 rounded-[2rem] md:rounded-[2.5rem] flex-1 flex flex-col min-h-[400px] md:min-h-[500px] border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6 md:mb-8">
            <div>
              <h2 className="text-xl md:text-3xl font-black tracking-tighter mb-1 md:mb-2">Your DNA Markers</h2>
              <p className="text-white/30 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                {visibleMarkersCount} of {metrics.length} markers unlocked
              </p>
            </div>
            <div className="flex gap-2 md:gap-4 p-1.5 md:p-2 bg-black/20 rounded-lg md:rounded-xl border border-white/5">
              <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1">
                <div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]" />
                <span className="text-[8px] md:text-[9px] uppercase tracking-widest font-black text-white">You</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1">
                <div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-white/10" />
                <span className="text-[8px] md:text-[9px] uppercase tracking-widest font-black text-white/40">Baseline</span>
              </div>
            </div>
          </div>

          <div className="flex-1 relative">
            <RadarChart metrics={metrics} />
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-3 gap-2 md:gap-4">
            {metrics.slice(0, 3).map((res, i) => (
              <div key={i}>
                <p className="text-[8px] md:text-[9px] uppercase tracking-widest text-white/30 font-bold mb-2">{res.label}</p>
                <p className="text-lg md:text-xl font-black tracking-tighter">{res.value}%</p>
                <div className="w-full h-1 bg-white/5 mt-2 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#00f0ff]"
                    initial={{ width: 0 }}
                    animate={{ width: `${res.value}%` }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Side Details - Card 3 & 4 */}
      <motion.div variants={bentoItem} className="md:col-span-12 lg:col-span-3 flex flex-col gap-6">
        <div className="glass p-8 rounded-[2.5rem] border-white/5 flex-1">
          <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-2 text-[#00f0ff]">
            <Zap className="w-4 h-4" /> DNA Insights
          </h3>
          <div className="space-y-8">
            {insights.map((insight, i) => (
              <motion.div
                key={i}
                className="group cursor-default"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
              >
                <p className="text-xs text-white/40 leading-relaxed group-hover:text-white transition-colors">
                  {insight}
                </p>
                <div className="w-0 group-hover:w-full h-px bg-[#00f0ff]/30 mt-4 transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="glass p-8 rounded-[2.5rem] bg-[#00f0ff]/5 border-[#00f0ff]/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black uppercase tracking-[0.3em]">Scan Status</h3>
            <Cpu className="w-4 h-4 text-[#00f0ff]" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-[10px] font-mono font-bold text-white/40">
              <span>DNA_SCANNER</span>
              <span className="text-[#00f0ff]">ACTIVE</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono font-bold text-white/40">
              <span>ACCURACY</span>
              <span className="text-[#00f0ff]">{analysisResult ? '99.2%' : '94.2%'}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono font-bold text-white/40">
              <span>AI_STATUS</span>
              <span className="text-green-500">{analysisResult ? 'DECODED' : 'READY'}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Detailed Metrics Section */}
      <motion.div variants={bentoItem} className="md:col-span-12">
        <div className="glass p-4 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border-white/5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
            <h3 className="text-xs md:text-sm font-black uppercase tracking-[0.2em] md:tracking-[0.3em] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#00f0ff]" /> Detailed Breakdown
            </h3>
            <div className="flex items-center gap-2 text-[10px] text-white/40">
              <span className="px-2 py-1 bg-[#00f0ff]/10 rounded-lg text-[#00f0ff] font-bold">
                {visibleMarkersCount}/{metrics.length} Markers Unlocked
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {metrics.map((metric, i) => {
              const isVisible = isMarkerVisible(i);

              return (
                <motion.div
                  key={metric.label}
                  onClick={() => isVisible && setSelectedMetric(metric)}
                  className={`p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all min-h-[140px] md:min-h-[160px] flex flex-col cursor-pointer ${
                    isVisible
                      ? 'bg-white/5 border-white/5 hover:border-[#00f0ff]/30 hover:bg-white/[0.08] group'
                      : 'bg-white/[0.02] border-white/[0.03] relative overflow-hidden cursor-default'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={isVisible ? { scale: 1.02 } : {}}
                  whileTap={isVisible ? { scale: 0.98 } : {}}
                >
                  {isVisible ? (
                    <>
                      <p className="text-[8px] md:text-[9px] uppercase tracking-widest text-white/30 font-bold mb-2">{metric.label}</p>
                      <div className="flex items-end gap-1 md:gap-2 mb-2 md:mb-3">
                        <span className="text-2xl md:text-3xl font-black text-white group-hover:text-[#00f0ff] transition-colors">{metric.value}</span>
                        <span className="text-[10px] md:text-xs text-white/20 mb-1">/ 100</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2 md:mb-3">
                        <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-[#00f0ff]"
                            initial={{ width: 0 }}
                            animate={{ width: `${metric.value}%` }}
                            transition={{ duration: 1, delay: 0.5 + i * 0.05 }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-[7px] md:text-[8px] text-white/20 mt-auto">
                        <span>vs {metric.benchmark}</span>
                        <span className={metric.value >= metric.benchmark ? 'text-green-500' : 'text-amber-500'}>
                          {metric.value >= metric.benchmark ? '↑' : '↓'} {Math.abs(metric.value - metric.benchmark)}
                        </span>
                      </div>
                      <p className="text-[8px] text-[#00f0ff]/60 mt-2 font-medium">Tap for details</p>
                    </>
                  ) : (
                    <>
                      {/* Locked marker */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
                      <p className="text-[8px] md:text-[9px] uppercase tracking-widest text-white/15 font-bold mb-2">???</p>
                      <div className="flex items-end gap-1 md:gap-2 mb-2 md:mb-3">
                        <span className="text-2xl md:text-3xl font-black text-white/10">??</span>
                        <span className="text-[10px] md:text-xs text-white/10 mb-1">/ 100</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2 md:mb-3">
                        <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full w-1/2 bg-white/5" />
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-1 text-[8px] text-white/20 mt-auto">
                        <Lock className="w-3 h-3" />
                        <span>Locked</span>
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Upgrade prompt if not all markers visible */}
          {visibleMarkersCount < metrics.length && (
            <motion.div
              className="mt-6 md:mt-8 p-4 md:p-6 bg-gradient-to-r from-[#00f0ff]/5 to-purple-500/5 rounded-xl md:rounded-2xl border border-[#00f0ff]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#00f0ff]/10 flex items-center justify-center shrink-0">
                  <Crown className="w-5 h-5 md:w-6 md:h-6 text-[#00f0ff]" />
                </div>
                <div>
                  <p className="font-bold text-sm md:text-base text-white">Unlock All {metrics.length} DNA Markers</p>
                  <p className="text-[10px] md:text-xs text-white/40">
                    {currentPlan === 'free'
                      ? 'Upgrade to Premium for 7 markers, or Pro for all 16'
                      : 'Upgrade to Pro for all 16 DNA markers'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[9px] md:text-[10px] text-[#00f0ff] font-bold uppercase tracking-widest">
                <Zap className="w-3 h-3" />
                <span>{metrics.length - visibleMarkersCount} markers locked</span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Share Modal */}
      {showShareModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowShareModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass p-8 rounded-[2rem] max-w-sm w-full mx-4 border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Share Your DNA</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-white/40 text-sm mb-6">
              Share your Vibe Score of {overallScore.toFixed(1)}/10 with friends!
            </p>

            <div className="space-y-3">
              {/* Twitter/X */}
              <button
                onClick={shareToTwitter}
                className="w-full py-4 px-6 bg-black border border-white/10 rounded-2xl flex items-center gap-4 hover:bg-white/5 transition-all group"
              >
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm">X (Twitter)</p>
                  <p className="text-[10px] text-white/40">Tweet your score</p>
                </div>
              </button>

              {/* Instagram */}
              <button
                onClick={shareToInstagram}
                className="w-full py-4 px-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-white/10 rounded-2xl flex items-center gap-4 hover:from-purple-600/30 hover:to-pink-600/30 transition-all group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm">Instagram</p>
                  <p className="text-[10px] text-white/40">Copy & share to story</p>
                </div>
              </button>

              {/* Threads */}
              <button
                onClick={shareToThreads}
                className="w-full py-4 px-6 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 hover:bg-white/10 transition-all group"
              >
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.89 3.589 12c.027 3.107.718 5.49 2.056 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.187.408-2.281 1.332-3.08.88-.76 2.106-1.168 3.546-1.18 1.018-.01 1.953.125 2.791.402.022-.468.015-.91-.022-1.322-.174-1.934-1.381-2.966-3.386-2.897-1.218.024-2.18.428-2.86 1.2l-1.493-1.262c1.056-1.218 2.577-1.876 4.394-1.9h.03c2.866-.063 4.828 1.56 5.073 4.265.038.423.05.882.035 1.39.486.282.922.62 1.306 1.016.836.86 1.385 1.974 1.633 3.31.397 2.146-.012 4.308-1.15 6.082-1.138 1.775-2.98 3.005-5.326 3.555-1.017.238-2.1.353-3.232.343zm.026-14.618c-.927.008-1.667.243-2.204.698-.519.438-.782 1.018-.746 1.64.035.643.36 1.19.917 1.543.59.374 1.373.544 2.2.477 1.05-.066 1.873-.47 2.449-1.2.436-.556.718-1.274.843-2.133-.727-.202-1.506-.346-2.295-.346-.39 0-.78.027-1.164.082v-.761z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm">Threads</p>
                  <p className="text-[10px] text-white/40">Share to Threads</p>
                </div>
              </button>
            </div>

            <p className="text-center text-[10px] text-white/20 mt-6">
              Your Vibe Score: {overallScore.toFixed(1)}/10
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* Download Modal with Card Preview */}
      {showDownloadModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowDownloadModal(false)}
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-start justify-center overflow-y-auto py-4"
        >
          {/* Content */}
          <div
            className="flex flex-col items-center w-full max-w-lg px-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Back Button - always visible at top */}
            <button
              onClick={() => setShowDownloadModal(false)}
              className="self-start mb-4 flex items-center gap-2 px-4 py-3 bg-white text-black font-bold rounded-xl hover:bg-[#00f0ff] transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Results
            </button>

            {/* Card Preview */}
            <div ref={cardRef} className="transform scale-[0.6] sm:scale-[0.7] md:scale-[0.8] origin-top">
              <NeuralIdentityCard
                photo={photo}
                score={overallScore}
                metrics={metrics}
                insights={insights}
                isStatic={true}
              />
            </div>

            {/* Download Button */}
            <motion.button
              onClick={downloadCard}
              disabled={isDownloading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 px-8 py-4 bg-[#00f0ff] text-black font-black rounded-2xl flex items-center gap-3 hover:bg-white transition-all disabled:opacity-50 text-sm uppercase tracking-widest shadow-lg shadow-[#00f0ff]/20"
            >
              {isDownloading ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download Card
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Metric Detail Popup */}
      <AnimatePresence>
        {selectedMetric && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedMetric(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md max-h-[80vh] overflow-y-auto bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#00f0ff] font-bold mb-2">DNA Marker</p>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                    {selectedMetric.label}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedMetric(null)}
                  className="p-2 text-white/40 hover:text-white transition-colors -mr-2 -mt-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Score Display */}
              <div className="flex items-end gap-3 mb-6">
                <span className="text-5xl font-black text-[#00f0ff]">{selectedMetric.value}</span>
                <span className="text-xl text-white/30 mb-2">/ 100</span>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-6">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#00f0ff] to-[#00f0ff]/50"
                  initial={{ width: 0 }}
                  animate={{ width: `${selectedMetric.value}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Benchmark Comparison */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl mb-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Benchmark</p>
                  <p className="text-lg font-bold">{selectedMetric.benchmark}</p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                  selectedMetric.value >= selectedMetric.benchmark
                    ? 'bg-green-500/10 text-green-500'
                    : 'bg-amber-500/10 text-amber-500'
                }`}>
                  <TrendingUp className={`w-4 h-4 ${selectedMetric.value < selectedMetric.benchmark ? 'rotate-180' : ''}`} />
                  <span className="font-bold text-sm">
                    {selectedMetric.value >= selectedMetric.benchmark ? '+' : ''}{selectedMetric.value - selectedMetric.benchmark}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-3">Analysis</p>
                <p className="text-white/70 leading-relaxed">
                  {selectedMetric.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;
