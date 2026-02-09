import { useTranslation } from 'react-i18next';
import type { ExchangeRates, GoldPrice, Currency } from '../types';

const CURRENCIES: Currency[] = ['USD', 'EUR', 'SYP', 'TRY', 'AED', 'SAR'];

interface Props {
  rates: ExchangeRates | null;
  goldPrice: GoldPrice | null;
}

export default function CurrentRates({ rates, goldPrice }: Props) {
  const { t } = useTranslation();

  if (!rates && !goldPrice) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700">{t('rates.title')}</h2>
      </div>
      <div className="p-4 space-y-3">
        {/* Gold price */}
        {goldPrice && (
          <div className="flex items-center justify-between bg-amber-50 rounded-lg px-3 py-2">
            <span className="text-xs font-medium text-amber-800">{t('rates.gold_price')}</span>
            <span className="text-sm font-semibold text-amber-900">
              ${goldPrice.pricePerGramUSD.toFixed(2)}
            </span>
          </div>
        )}

        {/* Currency rates */}
        {rates && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CURRENCIES.filter(c => c !== 'USD').map(c => (
              <div key={c} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                <span className="text-xs text-gray-500">{c}</span>
                <span className="text-xs font-medium text-gray-700">
                  {rates.rates[c]?.toFixed(c === 'SYP' ? 0 : 2) ?? '—'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Last updated */}
        {rates && rates.lastUpdated !== 'manual' && (
          <p className="text-[10px] text-gray-400 text-center">
            {t('rates.last_updated', { time: new Date(rates.lastUpdated).toLocaleDateString() })}
          </p>
        )}
      </div>
    </div>
  );
}
