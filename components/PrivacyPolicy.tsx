import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<Props> = ({ onBack }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto py-8"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-white/40 hover:text-white text-xs uppercase tracking-widest font-bold mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-[#00f0ff]" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">Privacy Policy</h1>
      </div>

      <p className="text-white/30 text-xs uppercase tracking-widest font-bold mb-10">
        Last updated: February 6, 2026
      </p>

      <div className="space-y-8 text-white/60 text-sm leading-relaxed">
        <section>
          <h2 className="text-white text-lg font-bold mb-3">1. Introduction</h2>
          <p>
            Ratery ("we", "our", "us") operates the ratery.cc website and AI-powered facial perception analysis service. This Privacy Policy explains how we collect, use, and protect your information when you use our Service.
          </p>
        </section>

        <section>
          <h2 className="text-white text-lg font-bold mb-3">2. Information We Collect</h2>
          <p className="mb-3"><strong className="text-white/80">Authentication Data:</strong> When you sign in with Google, we receive your name, email address, and profile photo from Google. This data is processed by Firebase Authentication and is used solely to identify your account.</p>
          <p className="mb-3"><strong className="text-white/80">Photos You Upload:</strong> When you use the scan feature, your photo is sent to our server for AI analysis. <strong className="text-[#00f0ff]/80">Photos are processed in real-time and are NOT stored on our servers.</strong> After analysis is complete, the photo is immediately discarded from server memory.</p>
          <p className="mb-3"><strong className="text-white/80">Subscription Data:</strong> We store your subscription plan type and scan usage counts in Firebase Firestore, linked to your anonymous user ID. We do not store payment card details — all payments are processed by our third-party payment provider (Creem.io).</p>
          <p><strong className="text-white/80">Scan Results:</strong> Your scan results (scores, metrics, insights) are stored locally in your browser's localStorage. We do not store scan results on our servers.</p>
        </section>

        <section>
          <h2 className="text-white text-lg font-bold mb-3">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>To authenticate you and maintain your session</li>
            <li>To perform AI facial perception analysis on photos you submit</li>
            <li>To track your subscription plan and enforce scan limits</li>
            <li>To process payments through our payment provider</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white text-lg font-bold mb-3">4. AI Processing</h2>
          <p>
            Photos are analyzed using the Anthropic Claude Vision API to generate perception metrics. Your photo is sent to Anthropic's servers for processing and is subject to <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#00f0ff] hover:underline">Anthropic's Privacy Policy</a>. Anthropic does not use API-submitted data to train their models. Photos are not retained after analysis.
          </p>
        </section>

        <section>
          <h2 className="text-white text-lg font-bold mb-3">5. Data Storage and Security</h2>
          <p className="mb-3">
            We store minimal data on our servers: your user ID, subscription plan, and scan count. This data is stored in Google Firebase Firestore with security rules that ensure each user can only access their own data.
          </p>
          <p>
            Scan results and photos are stored only in your browser's localStorage. Clearing your browser data will remove this information. We cannot recover it.
          </p>
        </section>

        <section>
          <h2 className="text-white text-lg font-bold mb-3">6. Third-Party Services</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong className="text-white/80">Google Firebase:</strong> Authentication and data storage</li>
            <li><strong className="text-white/80">Anthropic Claude API:</strong> AI photo analysis</li>
            <li><strong className="text-white/80">Creem.io:</strong> Payment processing</li>
            <li><strong className="text-white/80">Vercel:</strong> Application hosting</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white text-lg font-bold mb-3">7. Your Rights</h2>
          <p className="mb-3">You have the right to:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Delete your scan history at any time (clear localStorage)</li>
            <li>Request deletion of your account data by contacting us</li>
            <li>Not provide a photo — the service is opt-in only</li>
            <li>Export your scan data from your browser</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white text-lg font-bold mb-3">8. Children's Privacy</h2>
          <p>
            Our Service is not intended for anyone under the age of 16. We do not knowingly collect personal information from children under 16. If you believe a child has provided us with personal data, please contact us.
          </p>
        </section>

        <section>
          <h2 className="text-white text-lg font-bold mb-3">9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify users of any material changes by posting the new policy on this page with an updated date.
          </p>
        </section>

        <section>
          <h2 className="text-white text-lg font-bold mb-3">10. Contact</h2>
          <p>
            If you have questions about this Privacy Policy, contact us at: <span className="text-[#00f0ff]">support@ratery.cc</span>
          </p>
        </section>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicy;
