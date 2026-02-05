import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface AssetInputProps {
  assets: string[];
  setAssets: (assets: string[]) => void;
  disabled?: boolean;
}

export const AssetInput: React.FC<AssetInputProps> = ({ assets, setAssets, disabled }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue.trim() && !assets.includes(inputValue.trim().toUpperCase())) {
      setAssets([...assets, inputValue.trim().toUpperCase()]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const removeAsset = (assetToRemove: string) => {
    setAssets(assets.filter(a => a !== assetToRemove));
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-brand-gray uppercase tracking-widest">
        Watchlist Assets
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. EURUSD, BTC, SPX"
          disabled={disabled}
          className="flex-1 bg-brand-surface border border-brand-surfaceHighlight rounded p-3 text-sm text-white placeholder-brand-gray focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all font-mono"
        />
        <button
          onClick={handleAdd}
          disabled={disabled || !inputValue.trim()}
          className="bg-brand-surfaceHighlight hover:bg-brand-red text-white p-3 rounded border border-brand-surfaceHighlight hover:border-brand-red disabled:opacity-50 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="flex flex-wrap gap-2 min-h-[40px]">
        {assets.map((asset) => (
          <div
            key={asset}
            className="flex items-center gap-2 bg-brand-surfaceHighlight text-white px-4 py-1.5 rounded text-xs font-mono border border-brand-surfaceHighlight shadow-sm"
          >
            <span className="font-bold">{asset}</span>
            <button
              onClick={() => removeAsset(asset)}
              disabled={disabled}
              className="hover:text-brand-red focus:outline-none transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        {assets.length === 0 && (
          <span className="text-xs text-brand-gray italic py-1">Add assets to begin analysis.</span>
        )}
      </div>
    </div>
  );
};