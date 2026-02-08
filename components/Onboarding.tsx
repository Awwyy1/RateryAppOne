
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Users, Target, Shield, Zap, ChevronRight, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  onComplete: () => void;
}

const IconMap: Record<string, React.ReactNode> = {
  Eye: <Eye className="w-8 h-8" />,
  Users: <Users className="w-8 h-8" />,
  Target: <Target className="w-8 h-8" />,
  Shield: <Shield className="w-8 h-8" />,
  Zap: <Zap className="w-8 h-8" />
};

const STEP_ICONS = ['Eye', 'Users', 'Target', 'Shield', 'Zap'];

const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: t('onboarding.step1Title'), description: t('onboarding.step1Desc'), icon: 'Eye' },
    { title: t('onboarding.step2Title'), description: t('onboarding.step2Desc'), icon: 'Users' },
    { title: t('onboarding.step3Title'), description: t('onboarding.step3Desc'), icon: 'Target' },
    { title: t('onboarding.step4Title'), description: t('onboarding.step4Desc'), icon: 'Shield' },
    { title: t('onboarding.step5Title'), description: t('onboarding.step5Desc'), icon: 'Zap' },
  ];

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 min-h-[60vh] flex flex-col justify-center">
      <div className="flex gap-2 mb-12 justify-center">
        {steps.map((_, i) => (
          <div 
            key={i} 
            className={`h-1 rounded-full transition-all duration-500 ${
              i <= currentStep ? 'w-8 bg-sky-500' : 'w-4 bg-white/10'
            }`} 
          />
        ))}
      </div>

      {/* Fixed-height container prevents layout jumping between steps */}
      <div className="min-h-[360px] md:min-h-[380px] relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass p-8 md:p-12 rounded-3xl relative overflow-hidden group min-h-[360px] md:min-h-[380px] flex flex-col"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
               <div className="scale-[4]">
                 {IconMap[steps[currentStep].icon]}
               </div>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-400 mb-8 border border-sky-500/20">
              {IconMap[steps[currentStep].icon]}
            </div>

            <h2 className="text-3xl font-bold mb-4 tracking-tight">
              {steps[currentStep].title}
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md flex-1">
              {steps[currentStep].description}
            </p>

            <div className="flex justify-between items-center mt-8">
              <button
                onClick={prev}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 text-sm font-semibold transition-opacity ${currentStep === 0 ? 'opacity-0' : 'opacity-100'}`}
              >
                <ChevronLeft className="w-4 h-4" /> {t('onboarding.back')}
              </button>

              <button
                onClick={next}
                className="px-8 py-3 bg-white text-slate-950 rounded-xl font-bold flex items-center gap-2 hover:bg-sky-400 transition-colors"
              >
                {currentStep === steps.length - 1 ? t('onboarding.getStarted') : t('onboarding.next')}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
