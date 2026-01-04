import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSubscription, PLANS, PlanType, PlanInfo } from '../contexts/SubscriptionContext';
import {
  Crown,
  Zap,
  Infinity,
  Check,
  X,
  Loader2,
  AlertCircle,
  Star,
  Sparkles
} from 'lucide-react';

interface Props {
  onClose: () => void;
  onSuccess?: () => void;
}

const Paywall: React.FC<Props> = ({ onClose, onSuccess }) => {
  const { currentPlan, scansLeft } = useSubscription();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const PRODUCT_IDS: Record<PlanType, string> = {
    free: '',
    premium: 'prod_vyB0YRaHxUbaw15RrwYWs',
    pro: 'prod_4boIHh1LCWfxWCK12uL07D'
  };

  const handleSelectPlan = async (plan: PlanInfo) => {
    if (plan.id === 'free' || plan.id === currentPlan) {
      onClose();
      return;
    }

    setIsLoading(true);
    setSelectedPlan(plan.id);
    setError(null);

    try {
      const productId = PRODUCT_IDS[plan.id];
      const successUrl = encodeURIComponent(`${window.location.origin}/?payment=success&plan=${plan.id}`);
      const cancelUrl = encodeURIComponent(`${window.location.origin}/?payment=cancelled`);
      const paymentUrl = `https://www.creem.io/test/payment/${productId}?success_url=${successUrl}&cancel_url=${cancelUrl}`;

      window.location.href = paymentUrl;
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Could not open payment page. Please try again.');
      setIsLoading(false);
      setSelectedPlan(null);
    }
  };

  const getPlanIcon = (planId: PlanType) => {
    switch (planId) {
      case 'free': return <Zap className="w-6 h-6" />;
      case 'premium': return <Crown className="w-6 h-6" />;
      case 'pro': return <Sparkles className="w-6 h-6" />;
    }
  };

  const getPlanGradient = (planId: PlanType) => {
    switch (planId) {
      case 'free': return 'from-gray-500 to-gray-600';
      case 'premium': return 'from-[#00f0ff] to-cyan-500';
      case 'pro': return 'from-amber-400 via-yellow-500 to-amber-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[400] bg-black/90 backdrop-blur-xl overflow-y-auto"
    >
      {/* Background overlay for closing */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative min-h-screen flex items-center justify-center p-4 py-12">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-5xl bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-6 md:p-12 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button - Fixed positioning relative to modal */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-20 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header - Removed pr-10 for perfect centering */}
          <div className="text-center mb-10 md:mb-16 px-4">
            <motion.h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              Choose Your <span className="text-[#00f0ff]">Plan</span>
            </motion.h2>
            <p className="text-white/50 text-sm md:text-lg max-w-md mx-auto">
              {scansLeft === 0 || scansLeft === 'unlimited'
                ? 'Unlock more scans and premium features'
                : `You have ${scansLeft} scan${scansLeft !== 1 ? 's' : ''} remaining`}
            </p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 max-w-md mx-auto"
              >
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-4 items-stretch">
            {PLANS.map((plan, index) => {
              const isCurrentPlan = plan.id === currentPlan;
              const isSelected = selectedPlan === plan.id;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative rounded-[2rem] border transition-all flex flex-col group ${
                    plan.popular
                      ? 'border-[#00f0ff]/40 bg-white/[0.03] lg:scale-105 lg:z-10 shadow-[0_0_40px_-15px_rgba(0,240,255,0.3)]'
                      : plan.bestValue
                      ? 'border-amber-500/40 bg-white/[0.03] shadow-[0_0_40px_-15px_rgba(245,158,11,0.2)]'
                      : 'border-white/10 bg-white/[0.02]'
                  } ${isCurrentPlan ? 'ring-2 ring-green-500/40' : ''}`}
                >
                  {/* Badges */}
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#00f0ff] text-black text-[10px] font-black uppercase tracking-tighter rounded-full z-10 shadow-lg shadow-[#00f0ff]/20">
                      Most Popular
                    </div>
                  )}
                  {plan.bestValue && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-[10px] font-black uppercase tracking-tighter rounded-full flex items-center gap-1 z-10 shadow-lg shadow-amber-500/20">
                      <Star className="w-3 h-3 fill-black" /> Best Value
                    </div>
                  )}

                  <div className="p-8 flex flex-col flex-grow">
                    {/* Icon & Name */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getPlanGradient(plan.id)} flex items-center justify-center shadow-inner`}>
                        {getPlanIcon(plan.id)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{plan.name}</h3>
                        <p className="text-white/30 text-xs uppercase tracking-widest font-bold">Level {index + 1}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-4xl font-black tracking-tight">{plan.price}</span>
                      {plan.period && (
                        <span className="text-white/40 text-sm font-medium">{plan.period}</span>
                      )}
                    </div>

                    {/* Features List - flex-grow pushes button to bottom */}
                    <ul className="space-y-4 mb-8 flex-grow">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <div className={`mt-0.5 shrink-0 p-0.5 rounded-full ${
                            plan.id === 'pro' ? 'bg-amber-500/20 text-amber-400' :
                            plan.id === 'premium' ? 'bg-[#00f0ff]/20 text-[#00f0ff]' : 'bg-white/10 text-white/40'
                          }`}>
                            <Check className="w-3 h-3" />
                          </div>
                          <span className="text-white/70 leading-tight">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <motion.button
                      onClick={() => handleSelectPlan(plan)}
                      disabled={isLoading || isCurrentPlan}
                      whileHover={!isCurrentPlan ? { scale: 1.02, y: -2 } : {}}
                      whileTap={!isCurrentPlan ? { scale: 0.98 } : {}}
                      className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 ${
                        isCurrentPlan
                          ? 'bg-green-500/10 text-green-500 border border-green-500/20 cursor-default'
                          : plan.id === 'pro'
                          ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-xl shadow-amber-500/20'
                          : plan.id === 'premium'
                          ? 'bg-gradient-to-r from-[#00f0ff] to-cyan-400 text-black shadow-xl shadow-[#00f0ff]/20'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {isSelected && isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : isCurrentPlan ? (
                        'Active Plan'
                      ) : (
                        <>
                          <Zap className={`w-4 h-4 ${plan.id === 'free' ? 'hidden' : ''}`} />
                          {plan.id === 'free' ? 'Continue Free' : plan.id === 'pro' ? 'Get Pro Access' : 'Upgrade Now'}
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Footer Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mt-12 pt-8 border-t border-white/5 text-white/30 text-[10px] uppercase font-bold tracking-[0.2em]">
            <div className="flex items-center gap-2 italic">
              <Check className="w-4 h-4 text-green-500" /> Secure Payment
            </div>
            <div className="flex items-center gap-2 italic">
              <Check className="w-4 h-4 text-green-500" /> Cancel Anytime
            </div>
            <div className="flex items-center gap-2 italic">
              <Check className="w-4 h-4 text-green-500" /> Instant Setup
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Paywall;
