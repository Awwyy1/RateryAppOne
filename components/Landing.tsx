import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowUpRight, Dna, BarChart3, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  onStart: () => void;
}

const Landing: React.FC<Props> = ({ onStart }) => {
  const { t } = useTranslation();

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
        {t('landing.badge')}
      </motion.div>

      <motion.h1
        variants={item}
        className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-center leading-[0.85] mb-8 md:mb-10"
      >
        {t('landing.title1')} <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/40 to-white/10">{t('landing.title2')}</span>
      </motion.h1>

      <motion.p
        variants={item}
        className="max-w-2xl text-center text-white/40 text-lg md:text-xl font-medium leading-relaxed mb-12 md:mb-16 px-4"
      >
        {t('landing.subtitle')}
      </motion.p>

      {/* Scan Button */}
      <motion.div variants={item}>
        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative px-10 py-5 bg-white text-black font-extrabold rounded-full overflow-hidden transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]"
        >
          <span className="relative z-10 flex items-center gap-2 uppercase tracking-tighter text-lg">
            {t('landing.scan')} <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-[#00f0ff] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        </motion.button>
      </motion.div>

      {/* Features Grid */}
      <div className="mt-12 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 w-full overflow-hidden rounded-[2rem] border border-white/10">
        {[
          { icon: <Dna className="w-6 h-6" />, title: t('landing.feat1Title'), desc: t('landing.feat1Desc') },
          { icon: <BarChart3 className="w-6 h-6" />, title: t('landing.feat2Title'), desc: t('landing.feat2Desc') },
          { icon: <Lock className="w-6 h-6" />, title: t('landing.feat3Title'), desc: t('landing.feat3Desc') }
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
