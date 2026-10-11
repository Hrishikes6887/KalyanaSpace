import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Languages } from 'lucide-react';

export const LanguageSwitcher: React.FC<{ variant?: 'minimal' | 'pill' }> = ({ variant = 'pill' }) => {
  const { language, setLanguage } = useLanguage();

  if (variant === 'minimal') {
    return (
      <div className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 bg-white/80 border border-stone-200/80 rounded-full px-2.5 py-1 backdrop-blur-xs">
        <Languages className="w-3.5 h-3.5 text-emerald-700" />
        <button
          onClick={() => setLanguage('en')}
          className={`hover:text-emerald-800 transition-colors ${language === 'en' ? 'text-emerald-800 font-bold underline underline-offset-4' : 'text-stone-500'}`}
        >
          EN
        </button>
        <span className="text-stone-300">|</span>
        <button
          onClick={() => setLanguage('kn')}
          className={`hover:text-emerald-800 transition-colors ${language === 'kn' ? 'text-emerald-800 font-bold underline underline-offset-4' : 'text-stone-500'}`}
        >
          ಕನ್ನಡ
        </button>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center p-0.5 rounded-lg border border-stone-200 bg-stone-50 text-xs">
      <button
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 rounded-md font-medium transition-all ${
          language === 'en'
            ? 'bg-white text-emerald-800 shadow-xs font-semibold'
            : 'text-stone-500 hover:text-stone-800'
        }`}
      >
        English
      </button>
      <button
        onClick={() => setLanguage('kn')}
        className={`px-2.5 py-1 rounded-md font-medium transition-all ${
          language === 'kn'
            ? 'bg-white text-emerald-800 shadow-xs font-semibold'
            : 'text-stone-500 hover:text-stone-800'
        }`}
      >
        ಕನ್ನಡ
      </button>
    </div>
  );
};
