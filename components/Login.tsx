import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, UserCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  onSuccess: () => void;
}

const Login: React.FC<Props> = ({ onSuccess }) => {
  const { signInWithGoogle, loading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setError(null);
    try {
      await signInWithGoogle();
      onSuccess();
    } catch (err: unknown) {
      console.error('Sign in error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to sign in. Please try again.');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md mx-auto"
    >
      <div className="text-center mb-12">
        <motion.div
          className="w-20 h-20 mx-auto mb-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
          animate={{
            boxShadow: ['0 0 0 0 rgba(0, 240, 255, 0)', '0 0 30px 10px rgba(0, 240, 255, 0.1)', '0 0 0 0 rgba(0, 240, 255, 0)']
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Lock className="w-8 h-8 text-[#00f0ff]" />
        </motion.div>

        <h2 className="text-3xl font-bold tracking-tight mb-4">Secure Access Required</h2>
        <p className="text-white/40 text-sm leading-relaxed max-w-sm mx-auto">
          Authenticate to unlock the Neural Perception Engine. Your session data remains encrypted and private.
        </p>
      </div>

      <div className="glass p-8 rounded-[2rem] border border-white/5">
        <div className="space-y-6">
          {/* Google Sign In Button */}
          <motion.button
            onClick={handleGoogleSignIn}
            disabled={isSigningIn || loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 px-6 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-[#00f0ff] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSigningIn ? (
              <>
                <motion.div
                  className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <span className="text-xs uppercase tracking-widest">Authenticating...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-xs uppercase tracking-widest">Continue with Google</span>
              </>
            )}
          </motion.button>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
            >
              <p className="text-red-400 text-xs text-center">{error}</p>
            </motion.div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold">Security Protocols</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Security Features */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-[#00f0ff]" />
              </div>
              <div>
                <p className="text-xs font-bold text-white/80">End-to-End Encryption</p>
                <p className="text-[10px] text-white/30">AES-256 bit protection</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <UserCheck className="w-4 h-4 text-[#00f0ff]" />
              </div>
              <div>
                <p className="text-xs font-bold text-white/80">Session Isolation</p>
                <p className="text-[10px] text-white/30">Data purged after analysis</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <p className="text-center mt-8 text-[10px] text-white/20 max-w-xs mx-auto">
        By continuing, you agree to our Terms of Service and acknowledge our Privacy Policy.
      </p>
    </motion.div>
  );
};

export default Login;
