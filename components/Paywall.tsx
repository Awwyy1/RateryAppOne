import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  const { currentPlan, scansLeft, setPlan } = useSubscription();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Product IDs for Creem.io
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
      className="fixed inset-0 z-[400] bg-black/95 backdrop-blur-xl overflow-y-auto"
      onClick={onClose}
    >
      {/* Scrollable container */}
      <div className="min-h-full flex items-start md:items-center justify-center p-4 py-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative w-full max-w-4xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-0 right-0 z-20 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/60 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6 md:mb-8 pr-10">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-4xl font-black tracking-tight mb-2 md:mb-3"
            >
              Choose Your <span className="text-[#00f0ff]">Plan</span>
            </motion.h2>
            <p className="text-white/50 text-xs md:text-base">
              {scansLeft === 0 || scansLeft === 'unlimited'
                ? 'Unlock more scans and premium features'
                : `You have ${scansLeft} scan${scansLeft !== 1 ? 's' : ''} remaining`}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 md:mb-6 p-3 md:p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 max-w-md mx-auto"
            >
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-stretch">
            {PLANS.map((plan, index) => {
              const isCurrentPlan = plan.id === currentPlan;
              const isSelected = selectedPlan === plan.id;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative rounded-2xl md:rounded-3xl border overflow-visible transition-all flex flex-col ${
                    plan.popular
                      ? 'border-[#00f0ff]/50 bg-gradient-to-b from-[#00f0ff]/10 to-transparent md:scale-105 md:-my-2'
                      : plan.bestValue
                      ? 'border-amber-500/50 bg-gradient-to-b from-amber-500/10 to-transparent'
                      : 'border-white/10 bg-white/5'
                  } ${isCurrentPlan ? 'ring-2 ring-green-500/50' : ''}`}
                >
                  {/* Badge */}
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#00f0ff] text-black text-[10px] font-black uppercase tracking-widest rounded-full whitespace-nowrap z-10">
                      Popular
                    </div>
                  )}
                  {plan.bestValue && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1 whitespace-nowrap z-10">
                      <Star className="w-3 h-3" /> Best Value
                    </div>
                  )}
                  {isCurrentPlan && !plan.popular && !plan.bestValue && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-400 text-[10px] font-bold uppercase tracking-widest rounded-full whitespace-nowrap z-10">
                      Current
                    </div>
                  )}

                  <div className="p-5 md:p-8 pt-6 md:pt-10 flex flex-col flex-grow">
                    {/* Plan Icon */}
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br ${getPlanGradient(plan.id)} flex items-center justify-center mb-3 md:mb-4 shadow-lg`}>
                      {getPlanIcon(plan.id)}
                    </div>

                    {/* Plan Name */}
                    <h3 className="text-lg md:text-xl font-black mb-1">{plan.name}</h3>

                    {/* Price */}
                    <div className="flex items-baseline gap-1 mb-3 md:mb-4">
                      <span className="text-2xl md:text-4xl font-black">{plan.price}</span>
                      {plan.period && (
                        <span className="text-white/40 text-sm">{plan.period}</span>
                      )}
                    </div>

                    {/* Scans */}
                    <div className="flex items-center gap-2 mb-4 md:mb-6 text-sm">
                      {plan.scansLimit === 'unlimited' ? (
                        <>
                          <Infinity className="w-4 h-4 text-amber-400" />
                          <span className="text-amber-400 font-bold">Unlimited Scans</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 text-[#00f0ff]" />
                          <span className="text-white/70">{plan.scansLimit} {plan.scansLimit === 1 ? 'Scan' : 'Scans'}{plan.id === 'premium' ? '/month' : ''}</span>
                        </>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6 flex-grow">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
                          <Check className={`w-4 h-4 shrink-0 ${
                            plan.id === 'pro' ? 'text-amber-400' :
                            plan.id === 'premium' ? 'text-[#00f0ff]' : 'text-white/40'
                          }`} />
                          <span className="text-white/70">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button - pushed to bottom */}
                    <motion.button
                      onClick={() => handleSelectPlan(plan)}
                      disabled={isLoading || isCurrentPlan}
                      whileHover={{ scale: isCurrentPlan ? 1 : 1.02 }}
                      whileTap={{ scale: isCurrentPlan ? 1 : 0.98 }}
                      className={`w-full py-3 md:py-4 rounded-xl font-bold text-xs md:text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 mt-auto ${
                        isCurrentPlan
                          ? 'bg-white/10 text-white/40 cursor-default'
                          : plan.id === 'pro'
                          ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:shadow-lg hover:shadow-amber-500/30'
                          : plan.id === 'premium'
                          ? 'bg-gradient-to-r from-[#00f0ff] to-cyan-400 text-black hover:shadow-lg hover:shadow-[#00f0ff]/30'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {isSelected && isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : isCurrentPlan ? (
                        'Current Plan'
                      ) : plan.id === 'free' ? (
                        'Continue Free'
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          {plan.id === 'pro' ? 'Go Pro' : 'Upgrade'}
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mt-6 md:mt-8 text-white/30 text-[10px] md:text-xs">
            <div className="flex items-center gap-1 md:gap-2">
              <Check className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
              Secure Payment
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <Check className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
              Cancel Anytime
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <Check className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
              Instant Access
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Paywall;
