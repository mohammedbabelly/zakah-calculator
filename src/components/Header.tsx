import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="bg-emerald-700 text-white py-6 px-4 mb-6">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('app.title')}</h1>
          <p className="text-emerald-100 text-sm mt-1">{t('app.subtitle')}</p>
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
