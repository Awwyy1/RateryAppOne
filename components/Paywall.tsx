import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Crown, Sparkles, Star, X, Loader2, AlertCircle } from 'lucide-react';
import { useSubscription, PLANS, PlanType, BillingCycle } from '../contexts/SubscriptionContext';

interface Props {
  onClose: () => void;
  onSuccess?: () => void;
}

const Paywall: React.FC<Props> = ({ onClose, onSuccess }) => {
  const { currentPlan } = useSubscription();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelectPlan = async (planId: PlanType) => {
    if (planId === 'free' || planId === currentPlan) {
      onClose();
      return;
    }

    const plan = PLANS.find(p => p.id === planId);
    if (!plan || !plan.productIds) return;

    setIsLoading(true);
    setSelectedPlan(planId);
    setError(null);

    try {
      const productId = plan.productIds[billingCycle];
      if (!productId) {
        throw new Error('Product ID not found');
      }

      const successUrl = encodeURIComponent(`${window.location.origin}/?payment=success&plan=${planId}`);
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
      case 'free': return <Zap className="w-5 h-5" />;
      case 'premium': return <Crown className="w-5 h-5" />;
      case 'pro': return <Sparkles className="w-5 h-5" />;
    }
  };

  const getPlanColor = (planId: PlanType) => {
    switch (planId) {
      case 'free': return '#4ADE80';
      case 'premium': return '#00f0ff';
      case 'pro': return '#ffb800';
    }
  };

  const getButtonText = (planId: PlanType) => {
    if (planId === currentPlan) return 'ACTIVE PLAN';
    switch (planId) {
      case 'free': return 'ACTIVE PLAN';
      case 'premium': return 'UPGRADE NOW';
      case 'pro': return 'GET PRO ACCESS';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[400] bg-black/95 backdrop-blur-xl overflow-y-auto overscroll-contain"
      style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
    >
      {/* Background overlay for closing */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Close button */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-[500] p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white/60 hover:text-white transition-all"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Content */}
      <div className="relative max-w-5xl mx-auto py-8 px-4" onClick={(e) => e.stopPropagation()}>
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/5 text-[9px] uppercase tracking-[0.2em] font-bold text-[#00f0ff] mb-4"
          >
            Social DNA Plans
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-3">Choose Your <span className="text-[#00f0ff]">Plan</span></h2>
          <p className="text-white/40 uppercase tracking-[0.15em] text-xs font-bold mb-6">Unlock more scans and DNA markers</p>

          {/* Billing Toggle */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center p-1 bg-white/5 border border-white/10 rounded-xl backdrop-blur-xl relative">
              <motion.div
                className="absolute h-[calc(100%-8px)] rounded-lg bg-white shadow-xl z-0"
                initial={false}
                animate={{
                  width: billingCycle === 'monthly' ? '80px' : '80px',
                  x: billingCycle === 'monthly' ? 0 : 80
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`relative z-10 px-5 py-2 text-[9px] font-black uppercase tracking-widest transition-colors ${billingCycle === 'monthly' ? 'text-black' : 'text-white/40'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`relative z-10 px-5 py-2 text-[9px] font-black uppercase tracking-widest transition-colors ${billingCycle === 'yearly' ? 'text-black' : 'text-white/40'}`}
              >
                Yearly
              </button>

              {/* 35% OFF Badge */}
              <motion.div
                initial={{ scale: 0.95, y: 0 }}
                animate={{ scale: [0.95, 1.05, 0.95], y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute right-1 -top-7 z-[20]"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-[#00f0ff] blur-md opacity-30 rounded-md animate-pulse" />
                  <div className="relative bg-[#00f0ff] text-black text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-tighter shadow-xl border border-white/20 whitespace-nowrap">
                     35% OFF
                  </div>
                  <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#00f0ff] rotate-45" />
                </div>
              </motion.div>
            </div>

            <AnimatePresence mode="wait">
              {billingCycle === 'yearly' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-1.5 text-[#00f0ff] text-[9px] font-black uppercase tracking-[0.15em]"
                >
                  <Zap className="w-3 h-3 fill-current" />
                  Billed Annually — Save 35%
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 max-w-md mx-auto"
          >
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <p className="text-red-400 text-xs">{error}</p>
          </motion.div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {PLANS.map((plan) => {
            const isCurrentPlan = plan.id === currentPlan;
            const isSelected = selectedPlan === plan.id;
            const color = getPlanColor(plan.id);

            return (
              <motion.div
                key={plan.id}
                whileHover={{ y: -8 }}
                className={`relative rounded-2xl md:rounded-3xl p-5 md:p-6 flex flex-col border border-white/5 transition-all duration-500 backdrop-blur-sm ${
                  plan.popular ? 'ring-1 ring-[#00f0ff]/30 bg-[#00f0ff]/[0.02]' :
                  plan.bestValue ? 'ring-1 ring-[#ffb800]/30 bg-[#ffb800]/[0.02]' : 'bg-white/[0.02]'
                }`}
              >
                {/* Badge */}
                {plan.popular && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 text-black text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg whitespace-nowrap"
                    style={{ backgroundColor: color }}
                  >
                    MOST POPULAR
                  </div>
                )}
                {plan.bestValue && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 text-black text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-lg whitespace-nowrap"
                    style={{ backgroundColor: color }}
                  >
                    <Star className="w-2.5 h-2.5 fill-current" />
                    BEST VALUE
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10"
                      style={{ color }}
                    >
                      {getPlanIcon(plan.id)}
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight leading-none mb-1">{plan.name}</h3>
                      <span className="text-[9px] font-mono opacity-30 uppercase tracking-[0.2em] font-bold">{plan.level}</span>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-1.5">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={billingCycle}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-4xl md:text-5xl font-black tracking-tighter"
                        >
                          {plan.prices[billingCycle]}
                        </motion.span>
                      </AnimatePresence>

                      <div className="flex flex-col gap-0.5">
                        {plan.id !== 'free' && (
                          <span className="text-white/20 text-xs font-bold uppercase">
                            {billingCycle === 'monthly' ? '/mo' : '/yr'}
                          </span>
                        )}
                        <AnimatePresence>
                          {billingCycle === 'yearly' && plan.id !== 'free' && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="text-[#00f0ff] text-[7px] font-black uppercase tracking-tighter leading-none"
                            >
                              SAVE 35%
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    {billingCycle === 'yearly' && plan.id !== 'free' && (
                      <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-1">Billed Annually</span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6 flex-1">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-[11px] md:text-[12px] font-bold text-white/60">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center border border-white/10 flex-shrink-0"
                        style={{ color }}
                      >
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span className={i === 1 ? "text-white font-black" : ""}>{f}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isLoading || isCurrentPlan}
                  className={`w-full py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 ${
                    isCurrentPlan
                      ? 'bg-white/5 text-white/40 cursor-default border border-white/5'
                      : plan.id === 'premium'
                      ? 'bg-[#00f0ff] text-black shadow-[0_8px_30px_rgba(0,240,255,0.2)] hover:scale-[1.02]'
                      : plan.id === 'pro'
                      ? 'bg-[#ffb800] text-black shadow-[0_8px_30px_rgba(255,184,0,0.2)] hover:scale-[1.02]'
                      : 'bg-white/5 text-white/40 cursor-default border border-white/5'
                  }`}
                >
                  {isSelected && isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {plan.id !== 'free' && !isCurrentPlan && <Zap className="w-3.5 h-3.5 fill-current" />}
                      {getButtonText(plan.id)}
                    </>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 md:mt-10 text-center max-w-xl mx-auto">
          <p className="text-[8px] md:text-[9px] text-white/20 font-bold uppercase tracking-[0.2em] leading-relaxed">
            Scan credits reset every 30 days. Yearly plans include priority support and early access to new features.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Paywall;
