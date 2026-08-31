import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';

const LANGUAGES = ['uk', 'en'] as const;

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex items-center gap-1">
      {LANGUAGES.map((lng) => (
        <Button
          key={lng}
          variant={i18n.resolvedLanguage === lng ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => i18n.changeLanguage(lng)}
        >
          {lng.toUpperCase()}
        </Button>
      ))}
    </div>
  );
}
