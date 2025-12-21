
import React from 'react';
// Import Variants to correctly type motion configurations and ensure literal types like 'spring' are preserved
import { motion, Variants } from 'framer-motion';
import { MOCK_RESULTS, INSIGHTS } from '../constants';
import { AnalysisResult } from '../types';
import RadarChart from './RadarChart';
import { Download, Share2, Target, Zap, Shield, Cpu, ExternalLink } from 'lucide-react';

interface Props {
  photo: string | null;
  analysisResult: AnalysisResult | null;
}

const Dashboard: React.FC<Props> = ({ photo, analysisResult }) => {
  // Use real analysis results if available, otherwise fall back to mocks
  const metrics = analysisResult?.metrics || MOCK_RESULTS;
  const insights = analysisResult?.insights || INSIGHTS;
  const overallScore = analysisResult?.overallScore || 8.4;

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
              <span className="px-2 py-1 bg-black/50 backdrop-blur-md rounded text-[8px] font-mono font-bold border border-white/10 uppercase">Identity Verified</span>
            </div>
            {analysisResult && (
              <div className="absolute bottom-4 right-4 z-20">
                <span className="px-2 py-1 bg-[#00f0ff]/20 backdrop-blur-md rounded text-[8px] font-mono font-bold border border-[#00f0ff]/30 uppercase text-[#00f0ff]">AI Analyzed</span>
              </div>
            )}
          </div>

          <div className="space-y-4 relative z-20">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mb-1">Impact Score</p>
                <p className="text-5xl font-black tracking-tighter">{overallScore.toFixed(1)}<span className="text-sm font-bold text-white/20">/10</span></p>
              </div>
              <div className="w-12 h-12 rounded-full border border-[#00f0ff]/30 flex items-center justify-center bg-[#00f0ff]/5">
                <Target className="w-6 h-6 text-[#00f0ff]" />
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-2">
              <button className="w-full py-4 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-[#00f0ff] transition-all text-xs uppercase tracking-widest">
                <Download className="w-4 h-4" /> Download Audit
              </button>
              <button className="w-full py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-xs uppercase tracking-widest">
                <Share2 className="w-4 h-4" /> Share Results
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Analysis Radar - Card 2 */}
      <motion.div variants={bentoItem} className="md:col-span-8 lg:col-span-6 flex flex-col">
        <div className="glass p-10 rounded-[2.5rem] flex-1 flex flex-col min-h-[500px] border-white/5">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-black tracking-tighter mb-2">Social Blueprint</h2>
              <p className="text-white/30 text-xs font-bold uppercase tracking-widest">Multidimensional consensus mapping</p>
            </div>
            <div className="flex gap-4 p-2 bg-black/20 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 px-3 py-1">
                <div className="w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]" />
                <span className="text-[9px] uppercase tracking-widest font-black text-white">Subject</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1">
                <div className="w-2 h-2 rounded-full bg-white/10" />
                <span className="text-[9px] uppercase tracking-widest font-black text-white/40">Baseline</span>
              </div>
            </div>
          </div>

          <div className="flex-1 relative">
            <RadarChart metrics={metrics} />
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-3 gap-4">
            {metrics.slice(0, 3).map((res, i) => (
              <div key={i}>
                <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-2">{res.label}</p>
                <p className="text-xl font-black tracking-tighter">{res.value}%</p>
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
            <Zap className="w-4 h-4" /> Strategy
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
            <h3 className="text-sm font-black uppercase tracking-[0.3em]">System Health</h3>
            <Cpu className="w-4 h-4 text-[#00f0ff]" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-[10px] font-mono font-bold text-white/40">
              <span>ANALYSIS_NODES</span>
              <span className="text-[#00f0ff]">ONLINE</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono font-bold text-white/40">
              <span>VERBATIM_CONF</span>
              <span className="text-[#00f0ff]">{analysisResult ? '99.2%' : '94.2%'}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono font-bold text-white/40">
              <span>AI_ENGINE</span>
              <span className="text-green-500">{analysisResult ? 'CLAUDE' : 'STANDBY'}</span>
            </div>
            <div className="pt-4">
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 transition-all rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                View Full Logs <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Detailed Metrics Section */}
      <motion.div variants={bentoItem} className="md:col-span-12">
        <div className="glass p-8 rounded-[2.5rem] border-white/5">
          <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#00f0ff]" /> Detailed Breakdown
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {metrics.map((metric, i) => (
              <motion.div
                key={metric.label}
                className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-[#00f0ff]/30 transition-all group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-2">{metric.label}</p>
                <div className="flex items-end gap-2 mb-3">
                  <span className="text-3xl font-black text-white group-hover:text-[#00f0ff] transition-colors">{metric.value}</span>
                  <span className="text-xs text-white/20 mb-1">/ 100</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#00f0ff]"
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.value}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center text-[8px] text-white/20">
                  <span>Benchmark: {metric.benchmark}</span>
                  <span className={metric.value >= metric.benchmark ? 'text-green-500' : 'text-amber-500'}>
                    {metric.value >= metric.benchmark ? '↑' : '↓'} {Math.abs(metric.value - metric.benchmark)}
                  </span>
                </div>
                <p className="text-[10px] text-white/30 mt-3 leading-relaxed">{metric.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
