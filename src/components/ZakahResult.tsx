import { useTranslation } from 'react-i18next';
import type { ZakahResult as ZakahResultType, FetchStatus } from '../types';

interface Props {
  result: ZakahResultType | null;
  status: FetchStatus;
  onRetry: () => void;
  onManualEntry: () => void;
}

function formatUSD(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
}

export default function ZakahResult({ result, status, onRetry, onManualEntry }: Props) {
  const { t } = useTranslation();

  if (status === 'loading') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
        <div className="inline-block w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-2" />
        <p className="text-sm text-gray-500">{t('rates.loading')}</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="bg-amber-50 rounded-xl border border-amber-200 p-6 text-center">
        <p className="text-sm text-amber-800 mb-3">{t('rates.error')}</p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={onRetry}
            className="px-4 py-2 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors cursor-pointer"
          >
            {t('rates.retry')}
          </button>
          <button
            onClick={onManualEntry}
            className="px-4 py-2 text-sm border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer"
          >
            {t('rates.manual_entry')}
          </button>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
        <p className="text-sm text-gray-400">{t('result.add_assets')}</p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl shadow-sm border overflow-hidden ${
      result.isAboveNisab ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-200'
    }`}>
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700">{t('result.title')}</h2>
      </div>

      <div className="p-4 space-y-3">
        {/* Breakdown */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/70 rounded-lg p-3">
            <p className="text-xs text-gray-500">{t('result.gold_value')}</p>
            <p className="text-sm font-semibold text-amber-700">{formatUSD(result.breakdown.goldValueUSD)}</p>
          </div>
          <div className="bg-white/70 rounded-lg p-3">
            <p className="text-xs text-gray-500">{t('result.currency_value')}</p>
            <p className="text-sm font-semibold text-emerald-700">{formatUSD(result.breakdown.currencyValueUSD)}</p>
          </div>
        </div>

        {/* Total */}
        <div className="bg-white/70 rounded-lg p-3 flex justify-between items-center">
          <span className="text-sm text-gray-600">{t('result.total_wealth')}</span>
          <span className="text-base font-bold text-gray-900">{formatUSD(result.totalValueUSD)}</span>
        </div>

        {/* Nisab */}
        <div className="bg-white/70 rounded-lg p-3 flex justify-between items-center">
          <span className="text-sm text-gray-600">{t('result.nisab_threshold')}</span>
          <span className="text-sm font-medium text-gray-700">{formatUSD(result.nisabValueUSD)}</span>
        </div>

        {/* Status */}
        {result.isAboveNisab ? (
          <div className="bg-emerald-100 rounded-lg p-4 text-center">
            <p className="text-sm text-emerald-800 mb-1">{t('result.above_nisab')}</p>
            <p className="text-xs text-emerald-600 mb-2">{t('result.zakah_due')}</p>
            <p className="text-2xl font-bold text-emerald-900">{formatUSD(result.zakahAmountUSD)}</p>
          </div>
        ) : (
          <div className="bg-gray-100 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">{t('result.below_nisab')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
