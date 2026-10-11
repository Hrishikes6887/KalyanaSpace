import { en } from './en';
import { kn } from './kn';

export type Language = 'en' | 'kn';

export const translations = {
  en,
  kn,
};

export type TranslationKey = keyof typeof en;
