import React, { useState } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Dna, BarChart3, Lock, HelpCircle, X, Clock, Eye } from 'lucide-react';

interface Props {
  onStart: () => void;
}

const Landing: React.FC<Props> = ({ onStart }) => {
  const [showExplainer, setShowExplainer] = useState(false);

  // Explicitly type variants to avoid 'string' vs literal type mismatches in framer-motion transitions
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  // Explicitly type variants to avoid 'string' vs literal type mismatches in framer-motion transitions
  const item: Variants = {
    hidden: { y: 40, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', damping: 20 } }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center py-8 md:py-20"
    >
      <motion.div
        variants={item}
        className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] uppercase tracking-[0.3em] font-bold text-[#00f0ff] mb-6 md:mb-12"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f0ff] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f0ff]"></span>
        </span>
        AI-Powered DNA Scanner
      </motion.div>

      <motion.h1
        variants={item}
        className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-center leading-[0.85] mb-8 md:mb-10"
      >
        REVEAL YOUR <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/40 to-white/10">SOCIAL DNA</span>
      </motion.h1>

      <motion.p
        variants={item}
        className="max-w-2xl text-center text-white/40 text-lg md:text-xl font-medium leading-relaxed mb-12 md:mb-16 px-4"
      >
        Your face sends invisible signals every second. AI decodes them and shows how the world really sees you.
      </motion.p>

      {/* Button Container */}
      <motion.div variants={item} className="flex flex-col items-center gap-4">
        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative px-10 py-5 bg-white text-black font-extrabold rounded-full overflow-hidden transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]"
        >
          <span className="relative z-10 flex items-center gap-2 uppercase tracking-tighter text-lg">
            Scan My DNA <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-[#00f0ff] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        </motion.button>

        <button
          onClick={() => setShowExplainer(true)}
          className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm"
        >
          <HelpCircle className="w-4 h-4" />
          What is Social DNA?
        </button>
      </motion.div>

      {/* Social DNA Explainer Popup */}
      <AnimatePresence>
        {showExplainer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setShowExplainer(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-[#0a0a0a] border border-white/10 rounded-t-3xl md:rounded-3xl p-6 md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button - inside content flow for mobile */}
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                  What is Social DNA?
                </h2>
                <button
                  onClick={() => setShowExplainer(false)}
                  className="p-2 text-white/40 hover:text-white transition-colors -mr-2 -mt-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 text-white/60 leading-relaxed">
                <p>Every face tells a story before you say a word.</p>
                <p>In the first 100 milliseconds, people unconsciously read micro-signals from your face — trust, energy, warmth, power.</p>
                <p className="text-white/80">We call this combination your <span className="text-[#00f0ff] font-bold">Social DNA</span> — the unique code that shapes how the world perceives you.</p>
                <p>Our AI decodes these signals and reveals what others see but never tell you.</p>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3">
                {[
                  { icon: <Dna className="w-4 h-4" />, title: "Unique Code" },
                  { icon: <Clock className="w-4 h-4" />, title: "100ms Read" },
                  { icon: <Eye className="w-4 h-4" />, title: "Now Revealed" }
                ].map((card, i) => (
                  <div key={i} className="p-3 rounded-xl border border-white/10 bg-white/5 text-center">
                    <div className="w-8 h-8 rounded-lg bg-[#00f0ff]/10 flex items-center justify-center text-[#00f0ff] mx-auto mb-2">
                      {card.icon}
                    </div>
                    <p className="text-xs font-medium">{card.title}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Features Grid */}
      <div className="mt-12 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 w-full overflow-hidden rounded-[2rem] border border-white/10">
        {[
          { icon: <Dna className="w-6 h-6" />, title: "DNA Scan", desc: "AI reads 50+ facial markers to decode your social signals." },
          { icon: <BarChart3 className="w-6 h-6" />, title: "Vibe Score", desc: "Get your overall score from 1-10 based on first impression." },
          { icon: <Lock className="w-6 h-6" />, title: "Private and Secure", desc: "Your photo is analyzed and deleted. Never stored." }
        ].map((feat, i) => (
          <motion.div
            key={i}
            variants={item}
            className="bg-[#050505] p-12 hover:bg-white/5 transition-colors group"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#00f0ff] mb-8 group-hover:scale-110 group-hover:bg-[#00f0ff] group-hover:text-black transition-all">
              {feat.icon}
            </div>
            <h3 className="text-xl font-bold mb-4 tracking-tight">{feat.title}</h3>
            <p className="text-white/40 text-sm leading-relaxed">{feat.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Landing;
