'use client';

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import '@/lib/i18n';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'sv' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2"
    >
      <Languages className="h-4 w-4" />
      {i18n.language.toUpperCase()}
    </Button>
  );
};

export default LanguageSwitcher;
