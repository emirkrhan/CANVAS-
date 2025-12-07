import React from 'react';
import { LAYOUT_OPTIONS } from '../constants';
import { LayoutOption } from '../types';
import { WireframeIcon } from './WireframeIcon';

interface StepLayoutProps {
  onSelect: (layout: LayoutOption) => void;
  onBack: () => void;
  selectedLayoutId?: string;
}

const StepLayout: React.FC<StepLayoutProps> = ({ onSelect, onBack, selectedLayoutId }) => {
  return (
    <div className="flex flex-col gap-3 animate-fade-in-up pb-2 max-w-5xl mx-auto w-full">
      <div className="flex flex-col gap-0.5 text-center">
        <h1 className="text-xl font-black leading-tight tracking-[-0.033em] text-neutral-text-dark">
          Düzen Yapısını Seçin
        </h1>
        <p className="text-xs text-neutral-text-light font-medium max-w-xl mx-auto">
          Veri hikayenizle en iyi eşleşen taslağı seçin.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 mx-auto w-full">
        {LAYOUT_OPTIONS.map((layout, index) => {
            const isSelected = selectedLayoutId === layout.id;
            const isEnabled = layout.id === 'clinical-trial';

            return (
              <div
                key={layout.id}
                onClick={() => isEnabled && onSelect(layout)}
                className={`
                    group flex flex-col items-center gap-1.5 transition-all
                    ${isEnabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}
                `}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Wireframe Card */}
                <div className={`
                    w-full aspect-[3/2] rounded-lg border-2 transition-all duration-300 flex items-center justify-center relative bg-white overflow-hidden
                    ${isEnabled 
                        ? (isSelected 
                            ? 'border-primary ring-2 ring-primary/10 shadow-lg scale-[1.02]' 
                            : 'border-neutral-200 hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5')
                        : 'border-neutral-200 bg-gray-50'
                    }
                `}>
                    {!isEnabled && (
                        <div className="absolute top-2 right-2 bg-gray-200 text-gray-500 text-[8px] font-bold px-1 py-0.5 rounded-sm uppercase tracking-wide z-10">
                            Yakında
                        </div>
                    )}
                    <div className={`w-full h-full flex items-center justify-center p-0.5 ${!isEnabled ? 'opacity-50 grayscale' : ''}`}>
                         {/* Icon fills container more tightly */}
                         <div className="w-full h-full">
                            <WireframeIcon id={layout.id} isActive={isSelected} />
                         </div>
                    </div>
                </div>
                
                {/* Title Only - Description removed to save space as requested */}
                <div className="text-center">
                  <h3 className={`text-xs font-bold transition-colors ${isEnabled ? (isSelected ? 'text-primary' : 'text-neutral-text-dark group-hover:text-primary') : 'text-neutral-text-light'}`}>
                      {layout.name}
                  </h3>
                </div>
              </div>
            );
        })}
      </div>

      <div className="flex justify-center pt-1">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold text-neutral-text-light hover:text-neutral-text-dark hover:bg-white transition-all hover:shadow-sm"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Geri Dön
        </button>
      </div>
    </div>
  );
};

export default StepLayout;