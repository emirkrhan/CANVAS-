import React from 'react';

interface StepCustomizeProps {
  onNext: () => void;
  onBack: () => void;
}

const StepCustomize: React.FC<StepCustomizeProps> = ({ onNext, onBack }) => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight text-neutral-text-dark">Çalışma alanınızı özelleştirin</h1>
        <p className="text-lg text-neutral-text-light">Renkler, simgeler ve düzen yoğunluğu için varsayılanları ayarlayın</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Color Palette */}
        <div className="flex flex-col gap-4 p-6 bg-white border border-neutral-border rounded-xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 bg-primary/10 rounded-lg text-primary">
              <span className="material-symbols-outlined">palette</span>
            </div>
            <h3 className="text-lg font-bold text-neutral-text-dark">Renk Paleti</h3>
          </div>
          <p className="text-sm text-neutral-text-light">Dergi marka renklerini kullanın veya özel bir palet seçin.</p>
          <div className="flex flex-col gap-3 pt-2">
            <label className="flex items-center gap-3 p-3 rounded-lg border-2 border-primary bg-primary/5 cursor-pointer">
              <input type="radio" name="color-palette" defaultChecked className="text-primary focus:ring-primary/50" />
              <span className="font-medium text-neutral-text-dark">Dergi Marka Renklerini Kullan</span>
            </label>
            <label className="flex items-center gap-3 p-3 rounded-lg border-2 border-neutral-border hover:border-primary/50 cursor-pointer">
              <input type="radio" name="color-palette" className="text-primary focus:ring-primary/50" />
              <span className="font-medium text-neutral-text-dark">Özel Palet Kullan</span>
            </label>
          </div>
        </div>

        {/* Icon Library */}
        <div className="flex flex-col gap-4 p-6 bg-white border border-neutral-border rounded-xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 bg-primary/10 rounded-lg text-primary">
              <span className="material-symbols-outlined">shapes</span>
            </div>
            <h3 className="text-lg font-bold text-neutral-text-dark">Simge Kütüphanesi Önceliği</h3>
          </div>
          <p className="text-sm text-neutral-text-light">Tasarımınıza en uygun simge stilini önceliklendirin.</p>
          <div className="pt-2">
            <select className="w-full rounded-lg border-neutral-border text-neutral-text-dark focus:border-primary focus:ring-primary">
              <option>Modern Çizgi Sanatı</option>
              <option>Detaylı Bilimsel</option>
              <option>Basit Glifler</option>
              <option>Katı Dolgu</option>
            </select>
          </div>
        </div>

        {/* Text & Spacing */}
        <div className="flex flex-col gap-4 p-6 bg-white border border-neutral-border rounded-xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 bg-primary/10 rounded-lg text-primary">
              <span className="material-symbols-outlined">space_dashboard</span>
            </div>
            <h3 className="text-lg font-bold text-neutral-text-dark">Metin ve Boşluk</h3>
          </div>
          <p className="text-sm text-neutral-text-light">Yoğunluğu kompakttan feraha ayarlayın.</p>
          <div className="flex flex-col gap-2 pt-2">
            <input type="range" min="0" max="100" defaultValue="50" className="w-full h-2 bg-neutral-border rounded-lg appearance-none cursor-pointer accent-primary" />
            <div className="flex justify-between text-xs text-neutral-text-light">
              <span>Kompakt</span>
              <span>Rahat</span>
              <span>Ferah</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start gap-4 p-6 bg-white border border-neutral-border rounded-xl">
        <h3 className="text-lg font-bold text-neutral-text-dark">Akıllı Varsayılanlar</h3>
        <label className="flex items-center gap-x-3 cursor-pointer">
          <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
          <p className="text-base text-neutral-text-dark">Bu ayarları gelecekteki projelerim için varsayılan olarak kaydet</p>
        </label>
      </div>

      <div className="flex justify-between border-t border-neutral-border pt-6 mt-4">
        <button 
          onClick={onBack}
          className="flex min-w-[84px] items-center justify-center rounded-lg h-12 px-6 bg-background-light text-neutral-text-dark text-base font-bold hover:bg-gray-200"
        >
          Geri
        </button>
        <button 
          onClick={onNext}
          className="flex min-w-[84px] items-center justify-center rounded-lg h-12 px-6 bg-primary text-white text-base font-bold hover:bg-primary/90"
        >
          Oluşturmaya Başla
        </button>
      </div>
    </div>
  );
};

export default StepCustomize;