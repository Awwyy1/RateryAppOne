
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalysisResult } from '../types';

interface Props {
  photo: string | null;
  onComplete: (result: AnalysisResult) => void;
}

const Scanning: React.FC<Props> = ({ photo, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('INITIALIZING...');
  const [tickerData, setTickerData] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiComplete, setApiComplete] = useState(false);

  // Generate random hex-like data for the top ticker
  useEffect(() => {
    const chars = '0123456789ABCDEF<>[]_/$@#!';
    const interval = setInterval(() => {
      let result = '';
      for (let i = 0; i < 60; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setTickerData(result);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Call the analysis API
  useEffect(() => {
    if (!photo) return;

    const analyzePhoto = async () => {
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: photo }),
        });

        if (!response.ok) {
          throw new Error('Analysis failed');
        }

        const result = await response.json();
        setAnalysisResult(result);
        setApiComplete(true);
      } catch (err) {
        console.error('Analysis error:', err);
        setError('Failed to analyze image. Please try again.');
        // Fallback result in case of error
        setAnalysisResult({
          overallScore: 7.5,
          metrics: [
            { label: 'Trustworthiness', value: 75, benchmark: 72, description: 'Unable to fully analyze.' },
            { label: 'Charisma', value: 70, benchmark: 65, description: 'Unable to fully analyze.' },
            { label: 'Intelligence', value: 80, benchmark: 78, description: 'Unable to fully analyze.' },
            { label: 'Approachability', value: 68, benchmark: 70, description: 'Unable to fully analyze.' },
            { label: 'Authority', value: 72, benchmark: 68, description: 'Unable to fully analyze.' },
            { label: 'Energy', value: 70, benchmark: 60, description: 'Unable to fully analyze.' }
          ],
          insights: [
            'Analysis encountered an issue. Results may be limited.',
            'Try uploading a clearer headshot for better results.',
            'Ensure your face is well-lit and clearly visible.'
          ]
        });
        setApiComplete(true);
      }
    };

    analyzePhoto();
  }, [photo]);

  // Progress animation - runs faster initially, then waits for API
  useEffect(() => {
    const statusUpdates = [
      'CORE_SYNC_ESTABLISHED',
      'EXTRACTING_FACIAL_GEOMETRY',
      'ANALYZING_MICRO_EXPRESSIONS',
      'CALIBRATING_SOCIAL_WEIGHTS',
      'GENERATING_PERCEPTION_MAP',
      'FINALIZING_AUDIT_REPORT'
    ];

    const timer = setInterval(() => {
      setProgress(prev => {
        // If API is done and we're past 80%, go to 100%
        if (apiComplete && prev >= 80) {
          return Math.min(prev + 5, 100);
        }
        // If API not done, slow down at 80%
        if (!apiComplete && prev >= 80) {
          return 80;
        }
        // Normal progress
        return prev + 1;
      });
    }, 45);

    const statusInterval = setInterval(() => {
      const statusIndex = Math.floor((progress / 100) * (statusUpdates.length - 1));
      setStatus(statusUpdates[statusIndex] || statusUpdates[0]);
    }, 800);

    return () => {
      clearInterval(timer);
      clearInterval(statusInterval);
    };
  }, [progress, apiComplete]);

  // Complete when both progress and API are done
  useEffect(() => {
    if (progress >= 100 && analysisResult) {
      const timer = setTimeout(() => {
        onComplete(analysisResult);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, analysisResult, onComplete]);

  // Biometric markers logic
  const markers = useMemo(() => {
    return [...Array(15)].map((_, i) => ({
      id: i,
      top: Math.random() * 70 + 15,
      left: Math.random() * 70 + 15,
      delay: Math.random() * 2
    }));
  }, []);

  return (
    <div className="flex flex-col items-center py-4 max-w-6xl mx-auto w-full">
      {/* TOP SYSTEM TICKER */}
      <div className="w-full mb-12 flex items-center gap-4 overflow-hidden border-y border-white/5 py-2 font-mono">
        <span className="text-[#00f0ff] text-[10px] font-bold whitespace-nowrap">SYSTEM_STREAM:</span>
        <span className="text-white/20 text-[10px] tracking-[0.5em] whitespace-nowrap truncate">
          {tickerData}
        </span>
        <span className="text-[#00f0ff] text-[10px] font-bold whitespace-nowrap px-2 bg-white/5">
          {new Date().toISOString()}
        </span>
      </div>

      <div className="relative flex flex-col md:flex-row gap-12 items-center justify-center w-full">

        {/* LEFT HUD DATA */}
        <div className="hidden lg:flex flex-col gap-8 w-48 font-mono">
          <div className="space-y-1">
            <p className="text-[8px] text-white/30 uppercase tracking-widest">Neural_Load</p>
            <p className="text-xs text-[#00f0ff] font-bold">{(Math.random() * 100).toFixed(2)}%</p>
            <div className="w-full h-0.5 bg-white/5"><motion.div className="h-full bg-[#00f0ff]" animate={{ width: ['0%', '100%', '30%'] }} transition={{ duration: 2, repeat: Infinity }} /></div>
          </div>
          <div className="space-y-1">
            <p className="text-[8px] text-white/30 uppercase tracking-widest">Symmetry_Dev</p>
            <p className="text-xs text-white">0.00{Math.floor(Math.random() * 999)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[8px] text-white/30 uppercase tracking-widest">Packet_Loss</p>
            <p className="text-xs text-red-500">0.00%</p>
          </div>
        </div>

        {/* CENTER SCANNER */}
        <div className="relative group">
          {/* HUD Brackets */}
          <div className="absolute -top-6 -left-6 w-12 h-12 border-t border-l border-[#00f0ff]/50 rounded-tl-2xl" />
          <div className="absolute -top-6 -right-6 w-12 h-12 border-t border-r border-[#00f0ff]/50 rounded-tr-2xl" />
          <div className="absolute -bottom-6 -left-6 w-12 h-12 border-b border-l border-[#00f0ff]/50 rounded-bl-2xl" />
          <div className="absolute -bottom-6 -right-6 w-12 h-12 border-b border-r border-[#00f0ff]/50 rounded-br-2xl" />

          <div className="relative w-[340px] md:w-[420px] aspect-[3/4] rounded-3xl overflow-hidden bg-black shadow-[0_0_100px_rgba(0,240,255,0.05)] border border-white/10">
            {photo && (
              <>
                <motion.img
                  src={photo}
                  className="w-full h-full object-cover grayscale opacity-40 brightness-110"
                  animate={{
                    filter: progress % 10 === 0 ? ['grayscale(1) brightness(1)', 'grayscale(0) brightness(1.5)', 'grayscale(1) brightness(1)'] : 'grayscale(1) brightness(1)',
                    scale: progress % 25 === 0 ? [1, 1.02, 1] : 1
                  }}
                  transition={{ duration: 0.1 }}
                />
                {/* Chromatic Aberration Layers */}
                <motion.img
                  src={photo}
                  className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-20 contrast-150"
                  style={{ filter: 'hue-rotate(90deg) grayscale(1)' }}
                  animate={{ x: [-2, 2, -2], y: [1, -1, 1] }}
                  transition={{ duration: 0.2, repeat: Infinity }}
                />
              </>
            )}

            {/* Matrix/Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20"
              style={{ backgroundImage: 'linear-gradient(transparent 50%, rgba(0, 240, 255, 0.1) 50%)', backgroundSize: '100% 4px' }} />

            {/* SCANNING BEAM */}
            <motion.div
              animate={{ top: ['-5%', '105%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-16 z-20 pointer-events-none"
            >
              <div className="w-full h-[2px] bg-[#00f0ff] shadow-[0_0_30px_#00f0ff,0_0_60px_#00f0ff]" />
              <div className="w-full h-full bg-gradient-to-b from-[#00f0ff]/20 to-transparent" />
            </motion.div>

            {/* BIOMETRIC POINTS */}
            {markers.map((m) => (
              <motion.div
                key={m.id}
                className="absolute z-30 flex items-start gap-1"
                style={{ top: `${m.top}%`, left: `${m.left}%` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: m.delay }}
              >
                <div className="w-1 h-1 bg-[#00f0ff] rounded-full shadow-[0_0_10px_#00f0ff]" />
                <div className="flex flex-col">
                  <span className="text-[6px] font-mono text-[#00f0ff] leading-none">X: {m.left.toFixed(1)}</span>
                  <span className="text-[6px] font-mono text-[#00f0ff] leading-none">Y: {m.top.toFixed(1)}</span>
                </div>
              </motion.div>
            ))}

            {/* COORDINATE CROSSHAIR */}
            <motion.div
              className="absolute w-full h-px bg-white/5 z-10"
              animate={{ top: ['20%', '80%', '20%'] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <motion.div
              className="absolute h-full w-px bg-white/5 z-10"
              animate={{ left: ['20%', '80%', '20%'] }}
              transition={{ duration: 7, repeat: Infinity }}
            />

            {/* API Status Indicator */}
            {apiComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-4 right-4 z-40 flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-lg backdrop-blur-sm"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[8px] font-mono text-green-400 uppercase">AI Analysis Complete</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* RIGHT HUD DATA */}
        <div className="hidden lg:flex flex-col gap-8 w-48 font-mono text-right">
          <div className="space-y-1">
            <p className="text-[8px] text-white/30 uppercase tracking-widest">Protocol_ID</p>
            <p className="text-xs text-white">#RT-{Math.floor(progress * 742)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[8px] text-white/30 uppercase tracking-widest">Buffer_State</p>
            <p className="text-xs text-[#00f0ff] font-bold">{progress > 80 ? 'STABLE' : 'SYNCING...'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[8px] text-white/30 uppercase tracking-widest">AES_256_LINK</p>
            <p className="text-xs text-green-500">ENCRYPTED</p>
          </div>
        </div>
      </div>

      {/* FOOTER CONTROLS */}
      <div className="mt-20 w-full max-w-xl">
        <div className="flex justify-between items-end mb-6 font-mono">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
              <span className="text-[#00f0ff] text-[10px] uppercase tracking-widest font-bold">Process_Monitor</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-white/90 uppercase">{status}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-white/20 text-[10px] uppercase tracking-widest font-bold mb-1">Audit_Completeness</span>
            <span className="text-5xl font-black text-[#00f0ff] tabular-nums leading-none tracking-tighter">
              {progress}<span className="text-lg text-[#00f0ff]/40">%</span>
            </span>
          </div>
        </div>

        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden relative border border-white/5">
          <motion.div
            className="absolute inset-0 bg-[#00f0ff]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
          <motion.div
            className="absolute inset-0 bg-white/20"
            animate={{ left: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            style={{ width: '30%' }}
          />
        </div>

        <div className="mt-8 flex justify-between items-center text-[10px] font-mono text-white/20 uppercase tracking-[0.4em]">
          <div className="flex gap-6">
            <span>BIT_RATE: 12.4GB/S</span>
            <span>UPLINK: ACTIVE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 bg-red-500 rounded-full animate-ping" />
            <span>LIVE_FEED</span>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center"
          >
            <p className="text-amber-400 text-xs">{error}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Scanning;
