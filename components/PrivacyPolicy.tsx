import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<Props> = ({ onBack }) => {
  const { t } = useTranslation();

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
        <ArrowLeft className="w-4 h-4" /> {t('privacy.back')}
      </button>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-[#00f0ff]" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">{t('privacy.title')}</h1>
      </div>

      <p className="text-white/30 text-xs uppercase tracking-widest font-bold mb-10">
        {t('privacy.lastUpdated')}
      </p>

      <div className="space-y-8 text-white/60 text-sm leading-relaxed">
        <section>
          <h2 className="text-white text-lg font-bold mb-3">{t('privacy.s1Title')}</h2>
          <p>{t('privacy.s1Text')}</p>
        </section>

        <section>
          <h2 className="text-white text-lg font-bold mb-3">{t('privacy.s2Title')}</h2>
          <p className="mb-3"><strong className="text-white/80">{t('privacy.s2AuthData')}</strong> {t('privacy.s2AuthText')}</p>
          <p className="mb-3"><strong className="text-white/80">{t('privacy.s2PhotoData')}</strong> {t('privacy.s2PhotoText')} <strong className="text-[#00f0ff]/80">{t('privacy.s2PhotoHighlight')}</strong> {t('privacy.s2PhotoAfter')}</p>
          <p className="mb-3"><strong className="text-white/80">{t('privacy.s2SubData')}</strong> {t('privacy.s2SubText')}</p>
          <p><strong className="text-white/80">{t('privacy.s2ScanData')}</strong> {t('privacy.s2ScanText')}</p>
        </section>

        <section>
          <h2 className="text-white text-lg font-bold mb-3">{t('privacy.s3Title')}</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>{t('privacy.s3Item1')}</li>
            <li>{t('privacy.s3Item2')}</li>
            <li>{t('privacy.s3Item3')}</li>
            <li>{t('privacy.s3Item4')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white text-lg font-bold mb-3">{t('privacy.s4Title')}</h2>
          <p>
            {t('privacy.s4Text')} <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#00f0ff] hover:underline">{t('privacy.s4LinkText')}</a>{t('privacy.s4After')}
          </p>
        </section>

        <section>
          <h2 className="text-white text-lg font-bold mb-3">{t('privacy.s5Title')}</h2>
          <p className="mb-3">{t('privacy.s5Text1')}</p>
          <p>{t('privacy.s5Text2')}</p>
        </section>

        <section>
          <h2 className="text-white text-lg font-bold mb-3">{t('privacy.s6Title')}</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong className="text-white/80">{t('privacy.s6Firebase')}</strong> {t('privacy.s6FirebaseDesc')}</li>
            <li><strong className="text-white/80">{t('privacy.s6Anthropic')}</strong> {t('privacy.s6AnthropicDesc')}</li>
            <li><strong className="text-white/80">{t('privacy.s6Creem')}</strong> {t('privacy.s6CreemDesc')}</li>
            <li><strong className="text-white/80">{t('privacy.s6Vercel')}</strong> {t('privacy.s6VercelDesc')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white text-lg font-bold mb-3">{t('privacy.s7Title')}</h2>
          <p className="mb-3">{t('privacy.s7Intro')}</p>
          <ul className="list-disc list-inside space-y-2">
            <li>{t('privacy.s7Item1')}</li>
            <li>{t('privacy.s7Item2')}</li>
            <li>{t('privacy.s7Item3')}</li>
            <li>{t('privacy.s7Item4')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white text-lg font-bold mb-3">{t('privacy.s8Title')}</h2>
          <p>{t('privacy.s8Text')}</p>
        </section>

        <section>
          <h2 className="text-white text-lg font-bold mb-3">{t('privacy.s9Title')}</h2>
          <p>{t('privacy.s9Text')}</p>
        </section>

        <section>
          <h2 className="text-white text-lg font-bold mb-3">{t('privacy.s10Title')}</h2>
          <p>
            {t('privacy.s10Text')} <span className="text-[#00f0ff]">support@ratery.cc</span>
          </p>
        </section>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicy;
