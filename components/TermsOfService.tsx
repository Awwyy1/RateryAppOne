import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  onBack: () => void;
}

const TermsOfService: React.FC<Props> = ({ onBack }) => {
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
        <ArrowLeft className="w-4 h-4" /> {t('terms.back')}
      </button>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/10 flex items-center justify-center">
          <FileText className="w-5 h-5 text-[#00f0ff]" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">{t('terms.title')}</h1>
      </div>

      <p className="text-white/30 text-xs uppercase tracking-widest font-bold mb-10">
        {t('terms.lastUpdated')}
      </p>

      <div className="space-y-8 text-white/60 text-sm leading-relaxed">
        <section>
          <h2 className="text-white text-lg font-bold mb-3">{t('terms.s1Title')}</h2>
          <p>{t('terms.s1Text')}</p>
        </section>

        <section>
          <h2 className="text-white text-lg font-bold mb-3">{t('terms.s2Title')}</h2>
          <p>{t('terms.s2Text')}</p>
        </section>

        <section>
          <h2 className="text-white text-lg font-bold mb-3">{t('terms.s3Title')}</h2>
          <p className="mb-3">
            <strong className="text-white/80">{t('terms.s3Disclaimer1Label')}</strong> {t('terms.s3Disclaimer1Text')}
          </p>
          <p className="mb-3">
            <strong className="text-white/80">{t('terms.s3Disclaimer2Label')}</strong> {t('terms.s3Disclaimer2Text')}
          </p>
          <p>
            <strong className="text-white/80">{t('terms.s3Disclaimer3Label')}</strong> {t('terms.s3Disclaimer3Text')}
          </p>
        </section>

        <section>
          <h2 className="text-white text-lg font-bold mb-3">{t('terms.s4Title')}</h2>
          <p className="mb-3">{t('terms.s4Text1')}</p>
          <p>{t('terms.s4Text2')}</p>
        </section>

        <section>
          <h2 className="text-white text-lg font-bold mb-3">{t('terms.s5Title')}</h2>
          <p className="mb-3">{t('terms.s5Intro')}</p>
          <ul className="list-disc list-inside space-y-2">
            <li>{t('terms.s5Item1')}</li>
            <li>{t('terms.s5Item2')}</li>
            <li>{t('terms.s5Item3')}</li>
            <li>{t('terms.s5Item4')}</li>
            <li>{t('terms.s5Item5')}</li>
            <li>{t('terms.s5Item6')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-white text-lg font-bold mb-3">{t('terms.s6Title')}</h2>
          <p className="mb-3">{t('terms.s6Text1')}</p>
          <p className="mb-3">
            <strong className="text-white/80">{t('terms.s6FreeLabel')}</strong> {t('terms.s6FreeText')}
          </p>
          <p className="mb-3">
            <strong className="text-white/80">{t('terms.s6PremiumLabel')}</strong> {t('terms.s6PremiumText')}
          </p>
          <p className="mb-3">
            <strong className="text-white/80">{t('terms.s6ProLabel')}</strong> {t('terms.s6ProText')}
          </p>
          <p>{t('terms.s6Credits')}</p>
        </section>

        <section>
          <h2 className="text-white text-lg font-bold mb-3">{t('terms.s7Title')}</h2>
          <p className="mb-3">{t('terms.s7Text1')}</p>
          <p>{t('terms.s7Text2')}</p>
        </section>

        <section>
          <h2 className="text-white text-lg font-bold mb-3">{t('terms.s8Title')}</h2>
          <p>{t('terms.s8Text')}</p>
        </section>

        <section>
          <h2 className="text-white text-lg font-bold mb-3">{t('terms.s9Title')}</h2>
          <p>{t('terms.s9Text')}</p>
        </section>

        <section>
          <h2 className="text-white text-lg font-bold mb-3">{t('terms.s10Title')}</h2>
          <p>{t('terms.s10Text')}</p>
        </section>

        <section>
          <h2 className="text-white text-lg font-bold mb-3">{t('terms.s11Title')}</h2>
          <p>
            {t('terms.s11Text')} <span className="text-[#00f0ff]">support@ratery.cc</span>
          </p>
        </section>
      </div>
    </motion.div>
  );
};

export default TermsOfService;
