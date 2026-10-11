import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-ivory-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-card max-w-md w-full text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-800 flex items-center justify-center mx-auto">
          <Sparkles className="w-8 h-8 text-gold-500" />
        </div>
        <h1 className="font-serif text-4xl font-bold text-stone-900">404</h1>
        <h2 className="font-serif text-lg font-bold text-stone-800">Page Not Found</h2>
        <p className="text-xs text-stone-500 leading-relaxed">
          The wedding hall or section you were looking for doesn't exist or has moved.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-800 text-white font-semibold text-xs hover:bg-brand-900 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to KalyanaSpace Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
