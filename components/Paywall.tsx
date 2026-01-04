import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSubscription } from '../contexts/SubscriptionContext';
import {
  Crown,
  Zap,
  Infinity,
  Download,
  BarChart3,
  Sparkles,
  Shield,
  Check,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface Props {
  onClose: () => void;
  onSuccess?: () => void;
}

const Paywall: React.FC<Props> = ({ onClose, onSuccess }) => {
  const { freeScansLeft, setPremium } = useSubscription();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const features = [
    { icon: <Infinity className="w-5 h-5" />, text: 'Unlimited DNA Scans' },
    { icon: <BarChart3 className="w-5 h-5" />, text: 'Detailed Analytics & Insights' },
    { icon: <Download className="w-5 h-5" />, text: 'Premium DNA Card Designs' },
    { icon: <Sparkles className="w-5 h-5" />, text: 'Early Access to New Features' },
    { icon: <Shield className="w-5 h-5" />, text: 'Priority Support' },
  ];

  const handleSubscribe = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Use Creem.io test payment page directly
      // The product ID is already configured in the URL
      const productId = 'prod_vyB0YRaHxUbaw15RrwYWs';
      const successUrl = encodeURIComponent(`${window.location.origin}/?payment=success`);
      const cancelUrl = encodeURIComponent(`${window.location.origin}/?payment=cancelled`);

      // Creem.io test payment URL with return parameters
      const paymentUrl = `https://www.creem.io/test/payment/${productId}?success_url=${successUrl}&cancel_url=${cancelUrl}`;

      // Redirect to payment page
      window.location.href = paymentUrl;
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Could not open payment page. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[400] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25 }}
        className="relative w-full max-w-lg my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Card */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-[#0a0a0a] to-[#050505]">
          {/* Close button - inside card, always visible */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/60 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Premium glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/10 via-transparent to-purple-500/10 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent" />

          <div className="relative p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#00f0ff] to-purple-500 flex items-center justify-center shadow-lg shadow-[#00f0ff]/30"
              >
                <Crown className="w-10 h-10 text-white" />
              </motion.div>

              <h2 className="text-3xl font-black tracking-tight mb-2">
                Unlock <span className="text-[#00f0ff]">Premium</span>
              </h2>
              <p className="text-white/50 text-sm">
                {freeScansLeft === 0
                  ? "You've used all free scans"
                  : `${freeScansLeft} free scan${freeScansLeft !== 1 ? 's' : ''} remaining`}
              </p>
            </div>

            {/* Price */}
            <div className="text-center mb-8">
              <div className="inline-flex items-baseline gap-1">
                <span className="text-5xl font-black">$4.99</span>
                <span className="text-white/40 text-lg">/month</span>
              </div>
              <p className="text-white/30 text-xs mt-2 uppercase tracking-widest">Cancel anytime</p>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/20 flex items-center justify-center text-[#00f0ff]">
                    {feature.icon}
                  </div>
                  <span className="text-white/80 font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}

            {/* CTA Button */}
            <motion.button
              onClick={handleSubscribe}
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-5 bg-gradient-to-r from-[#00f0ff] to-cyan-400 text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-[#00f0ff]/30 transition-all disabled:opacity-50 text-lg uppercase tracking-wider"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="w-6 h-6" />
                  Upgrade Now
                </>
              )}
            </motion.button>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 mt-6 text-white/30 text-xs">
              <div className="flex items-center gap-1">
                <Check className="w-4 h-4 text-green-500" />
                Secure Payment
              </div>
              <div className="flex items-center gap-1">
                <Check className="w-4 h-4 text-green-500" />
                Instant Access
              </div>
            </div>

            {/* Skip option */}
            {freeScansLeft > 0 && (
              <button
                onClick={onClose}
                className="w-full mt-4 py-3 text-white/40 hover:text-white/60 text-sm font-medium transition-all"
              >
                Maybe later ({freeScansLeft} free scan{freeScansLeft !== 1 ? 's' : ''} left)
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Paywall;
