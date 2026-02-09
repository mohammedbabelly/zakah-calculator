import { useTranslation } from 'react-i18next';
import type { Asset, ExchangeRates, GoldPrice } from '../types';
import { goldAssetToUSD, currencyToUSD } from '../utils/zakah';

interface Props {
  assets: Asset[];
  rates: ExchangeRates | null;
  goldPrice: GoldPrice | null;
  onRemoveAsset: (id: string) => void;
  onClearAll: () => void;
}

function formatUSD(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

export default function AssetList({ assets, rates, goldPrice, onRemoveAsset, onClearAll }: Props) {
  const { t, i18n } = useTranslation();

  if (assets.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        {t('asset.no_assets')}
      </div>
    );
  }

  const formatAmount = (value: number, currency: string) => {
    try {
      return new Intl.NumberFormat(i18n.language === 'ar' ? 'ar-u-nu-latn' : 'en-US', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
      }).format(value);
    } catch {
      return `${currency} ${value.toLocaleString()}`;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700">{t('asset.your_assets')}</h2>
        <button
          onClick={onClearAll}
          className="text-xs text-red-500 hover:text-red-700 transition-colors cursor-pointer"
        >
          {t('asset.clear_all')}
        </button>
      </div>
      <ul className="divide-y divide-gray-100">
        {assets.map(asset => {
          let label: string;
          let usdValue: number | null = null;

          if (asset.type === 'gold') {
            label = `${asset.weightGrams}${t('gram')} ${t(`gold.${asset.karat}`)}`;
            if (goldPrice) {
              usdValue = goldAssetToUSD(asset, goldPrice.pricePerGramUSD);
            }
          } else {
            label = formatAmount(asset.amount, asset.currency);
            if (rates) {
              usdValue = currencyToUSD(asset.amount, asset.currency, rates.rates);
            }
          }

          return (
            <li key={asset.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
              <div>
                <span className="text-sm text-gray-800">{label}</span>
                {usdValue !== null && (
                  <span className="text-xs text-gray-400 ms-2">
                    ≈ {formatUSD(usdValue)}
                  </span>
                )}
              </div>
              <button
                onClick={() => onRemoveAsset(asset.id)}
                className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer p-1"
                title={t('asset.remove')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"/>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
