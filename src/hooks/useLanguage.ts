import { useState, useEffect } from 'react';
import type { Language } from '../i18n/translations';
import { safeGetItem, safeSetItem } from '../utils/storage';

const KEY = 'gymfit_pro_language';

export function useLanguage(): [Language, (l: Language) => void] {
  const [lang, setLang] = useState<Language>(() => safeGetItem<Language>(KEY, 'es'));

  useEffect(() => {
    safeSetItem(KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  return [lang, setLang];
}
