import React from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Dna, Cpu } from 'lucide-react';
import { MetricData } from '../types';

interface Props {
  photo: string | null;
  score: number;
  metrics?: MetricData[];
  insights?: string[];
  isStatic?: boolean;
}

const NeuralIdentityCard: React.FC<Props> = ({ photo, score, metrics = [], insights = [], isStatic = false }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], isStatic ? ["0deg", "0deg"] : ["6deg", "-6deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], isStatic ? ["0deg", "0deg"] : ["-6deg", "6deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isStatic) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Calculate tier based on score
  const getTier = (score: number) => {
    if (score >= 9) return 'LEGENDARY';
    if (score >= 7) return 'EPIC';
    if (score >= 5) return 'RARE';
    if (score >= 3) return 'COMMON';
    return 'BASIC';
  };

  // Calculate average metric sync
  const getSync = () => {
    if (metrics.length === 0) return '94.2';
    const avg = metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length;
    return avg.toFixed(1);
  };

  const scoreWhole = Math.floor(score);
  const scoreDecimal = ((score % 1) * 10).toFixed(0);

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-[400px] h-[640px] mx-auto ${!isStatic && 'group'}`}
    >
      {!isStatic && (
        <div className="absolute -inset-6 bg-[#00f0ff]/10 rounded-[4rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      )}

      <div className="relative h-full w-full bg-[#080808] rounded-[3.5rem] border border-white/10 overflow-hidden flex flex-col p-8 shadow-2xl">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat z-0" />

        {/* Header Section */}
        <div className="flex justify-between items-center mb-6 z-10 shrink-0">
          <div className="flex flex-col">
            <span className="text-[13px] font-black text-[#00f0ff] tracking-[0.5em] uppercase mb-0.5 font-mono">Social DNA</span>
            <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Decoded by Ratery</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center backdrop-blur-md">
            <Dna className="w-5 h-5 text-white/40" />
          </div>
        </div>

        {/* Photo Container */}
        <div className="relative w-full h-[320px] rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#111] mb-6 shrink-0 transition-all duration-500 group-hover:border-[#00f0ff]/40">
          {photo ? (
            <div className="w-full h-full relative">
              <img
                src={photo}
                className="w-full h-full object-cover block grayscale contrast-125 brightness-110"
                style={{ objectPosition: 'center 20%' }}
                alt="DNA Scan"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

              {/* Corner Accents on Image */}
              <div className="absolute top-5 right-5 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
                 <span className="text-[8px] font-black text-white/80 uppercase tracking-widest">Scanned</span>
              </div>

              {/* Verified Badge */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between px-4 py-2.5 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-xl z-30 shadow-2xl">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] shadow-[0_0_10px_#00f0ff]" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">Verified</span>
                </div>
                <Cpu className="w-3.5 h-3.5 text-white/20" />
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-white/10">
              <Cpu className="w-12 h-12 animate-pulse" />
            </div>
          )}

          {/* Animated Scanline */}
          {!isStatic && (
            <motion.div
              animate={{ top: ['-10%', '110%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              className="absolute left-0 right-0 h-[1px] bg-[#00f0ff]/60 blur-[1px] z-20"
            />
          )}
        </div>

        {/* Vibe Score Label */}
        <div className="flex items-center gap-4 mb-4 z-10 shrink-0">
           <div className="h-px w-6 bg-white/10" />
           <h3 className="text-[9px] font-mono font-bold tracking-[0.5em] uppercase text-white/30 whitespace-nowrap">Vibe Score</h3>
           <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Score Section */}
        <div className="flex justify-between items-center mb-6 z-10 px-1 shrink-0">
          <div className="flex items-baseline leading-none">
            <span className="text-7xl font-black tracking-tighter text-white">{scoreWhole}</span>
            <span className="text-2xl font-black text-[#00f0ff] ml-0.5">.{scoreDecimal}</span>
            <span className="text-lg font-black text-white/10 ml-3 tracking-widest">/10</span>
          </div>

          <div className="relative w-16 h-16 flex items-center justify-center">
             <div className="absolute inset-0 border border-white/5 rounded-full" />
             <div className="absolute inset-2 border-2 border-[#00f0ff]/10 rounded-full animate-spin-slow" />
             <div className="w-2 h-2 bg-[#00f0ff] rounded-full shadow-[0_0_15px_#00f0ff]" />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 z-10 shrink-0">
          <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 flex flex-col gap-1.5 transition-colors hover:bg-white/[0.04]">
            <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Status</span>
            <p className="text-[13px] font-black uppercase tracking-tight text-white/90">{getTier(score)}</p>
          </div>
          <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 flex flex-col gap-1.5 transition-colors hover:bg-white/[0.04]">
            <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Match</span>
            <p className="text-[13px] font-black uppercase tracking-tight text-white/90">{getSync()}%</p>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-auto pt-6 border-t border-white/5 flex flex-col items-center gap-2 z-10 shrink-0">
           <div className="flex gap-1.5">
             {[...Array(5)].map((_, i) => (
               <div key={i} className={`w-1 h-1 rounded-full ${i === 2 ? 'bg-[#00f0ff]' : 'bg-white/10'}`} />
             ))}
           </div>
           <span className="text-[8px] font-mono tracking-[0.5em] text-white/20 uppercase font-black">ratery.cc</span>
        </div>
      </div>
    </motion.div>
  );
};

export default NeuralIdentityCard;
