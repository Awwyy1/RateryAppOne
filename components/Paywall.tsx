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
      case 'free': return <Zap className="w-6 h-6" />;
      case 'premium': return <Crown className="w-6 h-6" />;
      case 'pro': return <Sparkles className="w-6 h-6" />;
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
        className="fixed top-4 right-4 z-[500] p-3 bg-white/10 hover:bg-white/20 rounded-full text-white/60 hover:text-white transition-all"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto py-12 px-4" onClick={(e) => e.stopPropagation()}>
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/5 bg-white/5 text-[10px] uppercase tracking-[0.3em] font-bold text-[#00f0ff] mb-8"
          >
            Licensing Protocols
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">Choose Your <span className="text-[#00f0ff]">Plan</span></h2>
          <p className="text-white/40 uppercase tracking-[0.2em] text-sm font-bold mb-12">Unlock more scans and neural depth</p>

          {/* Billing Toggle */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center p-1.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl relative">
              <motion.div
                className="absolute h-[calc(100%-12px)] rounded-xl bg-white shadow-xl z-0"
                initial={false}
                animate={{
                  width: billingCycle === 'monthly' ? '92px' : '100px',
                  x: billingCycle === 'monthly' ? 0 : 92
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`relative z-10 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors ${billingCycle === 'monthly' ? 'text-black' : 'text-white/40'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`relative z-10 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors ${billingCycle === 'yearly' ? 'text-black' : 'text-white/40'}`}
              >
                Yearly
              </button>

              {/* 35% OFF Badge */}
              <motion.div
                initial={{ scale: 0.95, y: 0 }}
                animate={{ scale: [0.95, 1.05, 0.95], y: [0, -2, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute right-2 -top-9 z-[20]"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-[#00f0ff] blur-md opacity-30 rounded-lg animate-pulse" />
                  <div className="relative bg-[#00f0ff] text-black text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-tighter shadow-2xl border border-white/20 whitespace-nowrap">
                     35% OFF
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#00f0ff] rotate-45 border-r border-b border-white/10" />
                </div>
              </motion.div>
            </div>

            <AnimatePresence mode="wait">
              {billingCycle === 'yearly' ? (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 text-[#00f0ff] text-[10px] font-black uppercase tracking-[0.2em]"
                >
                  <Zap className="w-3 h-3 fill-current" />
                  Billed Annually — Maximum Efficiency
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-white/10 text-[9px] font-black uppercase tracking-[0.3em]"
                >
                  Monthly Flexibility Protocol Active
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
            className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 max-w-md mx-auto"
          >
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan) => {
            const isCurrentPlan = plan.id === currentPlan;
            const isSelected = selectedPlan === plan.id;
            const color = getPlanColor(plan.id);

            return (
              <motion.div
                key={plan.id}
                whileHover={{ y: -12 }}
                className={`relative rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-10 flex flex-col border border-white/5 transition-all duration-500 backdrop-blur-sm ${
                  plan.popular ? 'ring-1 ring-[#00f0ff]/30 bg-[#00f0ff]/[0.02]' :
                  plan.bestValue ? 'ring-1 ring-[#ffb800]/30 bg-[#ffb800]/[0.02]' : 'bg-white/[0.02]'
                }`}
              >
                {/* Badge */}
                {plan.popular && (
                  <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 text-black text-[9px] font-black px-5 py-2 rounded-full uppercase tracking-widest shadow-xl whitespace-nowrap"
                    style={{ backgroundColor: color }}
                  >
                    MOST POPULAR
                  </div>
                )}
                {plan.bestValue && (
                  <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 text-black text-[9px] font-black px-5 py-2 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-xl whitespace-nowrap"
                    style={{ backgroundColor: color }}
                  >
                    <Star className="w-3 h-3 fill-current" />
                    BEST VALUE
                  </div>
                )}

                <div className="mb-10">
                  <div className="flex items-center gap-4 mb-10">
                    <div
                      className="w-14 h-14 md:w-16 md:h-16 rounded-[1.25rem] bg-white/5 flex items-center justify-center border border-white/10"
                      style={{ color }}
                    >
                      {getPlanIcon(plan.id)}
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-none mb-1.5">{plan.name}</h3>
                      <span className="text-[10px] font-mono opacity-30 uppercase tracking-[0.3em] font-bold">{plan.level}</span>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-2">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={billingCycle}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-5xl md:text-6xl font-black tracking-tighter"
                        >
                          {plan.prices[billingCycle]}
                        </motion.span>
                      </AnimatePresence>

                      <div className="flex flex-col gap-1">
                        {plan.id !== 'free' && (
                          <span className="text-white/20 text-sm font-bold uppercase">
                            {billingCycle === 'monthly' ? '/mo' : '/yr'}
                          </span>
                        )}
                        <AnimatePresence>
                          {billingCycle === 'yearly' && plan.id !== 'free' && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="text-[#00f0ff] text-[8px] font-black uppercase tracking-tighter leading-none"
                            >
                              DISCOUNTED
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    {billingCycle === 'yearly' && plan.id !== 'free' && (
                      <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-1">Billed Annually</span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 md:space-y-5 mb-10 md:mb-14 flex-1">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 md:gap-4 text-[12px] md:text-[13px] font-bold text-white/60">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center border border-white/10 flex-shrink-0"
                        style={{ color }}
                      >
                        <Check className="w-3 h-3" />
                      </div>
                      <span className={i === 1 ? "text-white font-black" : ""}>{f}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isLoading || isCurrentPlan}
                  className={`w-full py-5 md:py-6 rounded-[1.25rem] md:rounded-[1.5rem] font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                    isCurrentPlan
                      ? 'bg-white/5 text-white/40 cursor-default border border-white/5'
                      : plan.id === 'premium'
                      ? 'bg-[#00f0ff] text-black shadow-[0_10px_40px_rgba(0,240,255,0.2)] hover:scale-[1.02]'
                      : plan.id === 'pro'
                      ? 'bg-[#ffb800] text-black shadow-[0_10px_40px_rgba(255,184,0,0.2)] hover:scale-[1.02]'
                      : 'bg-white/5 text-white/40 cursor-default border border-white/5'
                  }`}
                >
                  {isSelected && isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {plan.id !== 'free' && !isCurrentPlan && <Zap className="w-4 h-4 fill-current" />}
                      {getButtonText(plan.id)}
                    </>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-16 md:mt-20 text-center max-w-2xl mx-auto">
          <p className="text-[9px] md:text-[10px] text-white/20 font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] leading-relaxed">
            Neural audit credits reset every 30 days. Unused scans in yearly plans rollover to the next month within the active period.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Paywall;
