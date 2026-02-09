import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Currency } from '../types';

const CURRENCIES: Currency[] = ['EUR', 'SYP', 'TRY', 'AED', 'SAR'];

interface Props {
  onSave: (goldPrice: number, rates: Record<string, number>) => void;
  onCancel: () => void;
}

export default function ManualRatesModal({ onSave, onCancel }: Props) {
  const { t } = useTranslation();
  const [goldPrice, setGoldPrice] = useState('');
  const [currencyRates, setCurrencyRates] = useState<Record<string, string>>({
    EUR: '', SYP: '', TRY: '', AED: '', SAR: '',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const gp = parseFloat(goldPrice);
    if (!gp || gp <= 0) return;

    const rates: Record<string, number> = { USD: 1 };
    for (const c of CURRENCIES) {
      const val = parseFloat(currencyRates[c]);
      if (val && val > 0) rates[c] = val;
    }
    onSave(gp, rates);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSave} className="bg-white rounded-xl shadow-lg max-w-sm w-full p-5 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">{t('rates.manual_entry')}</h3>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">{t('rates.gold_price')} (USD)</label>
          <input
            type="number"
            min="0"
            step="any"
            value={goldPrice}
            onChange={e => setGoldPrice(e.target.value)}
            placeholder="85.00"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <p className="text-xs text-gray-400">1 USD = ?</p>
        <div className="grid grid-cols-2 gap-3">
          {CURRENCIES.map(c => (
            <div key={c}>
              <label className="block text-xs text-gray-500 mb-1">{c}</label>
              <input
                type="number"
                min="0"
                step="any"
                value={currencyRates[c]}
                onChange={e => setCurrencyRates(prev => ({ ...prev, [c]: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="flex-1 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            {t('rates.save')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            {t('rates.cancel')}
          </button>
        </div>
      </form>
    </div>
  );
}
