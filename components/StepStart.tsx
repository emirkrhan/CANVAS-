import React from 'react';
import { LAYOUT_OPTIONS } from '../constants';
import { WireframeIcon } from './WireframeIcon';

interface StepStartProps {
  onNext: (choice: 'template' | 'upload') => void;
}

const StepStart: React.FC<StepStartProps> = ({ onNext }) => {
  // Duplicate options to create a seamless infinite loop
  // We need enough duplicates to fill the screen and allow for the offset reset
  const scrollItems = [...LAYOUT_OPTIONS, ...LAYOUT_OPTIONS];

  return (
    <div className="flex flex-col gap-8 w-full mx-auto">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] sm:text-5xl text-neutral-text-dark">
          Nasıl başlamak istersiniz?
        </h1>
        <p className="max-w-xl text-lg text-neutral-text-light">
          Bir dergi şablonu seçin veya AI'mızın grafiksel özet oluşturmak için tasarımınızı analiz etmesine izin verin.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 pt-6 md:grid-cols-2">
        {/* Template Option with Seamless Carousel */}
        <div 
          onClick={() => onNext('template')}
          className="group/card relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-neutral-border bg-white shadow-sm transition-all hover:border-primary hover:shadow-lg h-[400px]"
        >
          {/* Card Header */}
          <div className="flex flex-col gap-3 p-8 z-20 bg-gradient-to-b from-white via-white/95 to-transparent">
            <h3 className="text-2xl font-bold leading-tight tracking-tight text-neutral-text-dark group-hover/card:text-primary transition-colors">
              Dergi Şablonu Seç
            </h3>
            <p className="text-neutral-text-light text-sm">
              Klinik denemeler, meta-analizler ve daha fazlası için önceden tasarlanmış şablonlar.
            </p>
          </div>
          
          {/* Carousel Container */}
          <div className="absolute inset-0 top-24 flex items-center bg-background-light/30">
            {/* Gradient Masks for fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10"></div>

            {/* Scrolling Track */}
            <div className="flex gap-4 animate-scroll-ltr w-max px-4">
              {scrollItems.map((item, i) => (
                <div 
                  key={`${item.id}-${i}`}
                  className="flex flex-col items-center gap-3 w-48 shrink-0 p-4 bg-white rounded-xl border border-neutral-border shadow-sm hover:border-primary/50 hover:shadow-md transition-all duration-300"
                >
                    {/* Wireframe Thumbnail */}
                    <div className="w-full aspect-[4/3] rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden p-2">
                      <div className="w-full h-full transform transition-transform group-hover/card:scale-105 duration-500">
                            <WireframeIcon id={item.id} isActive={false} />
                      </div>
                    </div>
                    {/* Label */}
                    <span className="text-sm font-bold text-neutral-text-dark text-center line-clamp-1">
                      {item.name}
                    </span>
                </div>
              ))}
            </div>
          </div>

          {/* Hover CTA */}
          <div className="absolute bottom-6 right-6 z-20 opacity-0 transform translate-y-4 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all duration-300">
             <span className="flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 px-4 py-2 rounded-full">
                Kütüphaneye Git <span className="material-symbols-outlined text-lg">arrow_forward</span>
             </span>
          </div>
        </div>

        {/* Upload Option */}
        <div 
          onClick={() => onNext('upload')}
          className="group/card flex cursor-pointer flex-col rounded-2xl border border-neutral-border bg-white p-8 shadow-sm transition-all hover:border-primary hover:shadow-lg h-[400px]"
        >
          <div className="flex flex-col gap-3">
            <h3 className="text-2xl font-bold leading-tight tracking-tight text-neutral-text-dark group-hover/card:text-primary transition-colors">
              Tasarımını Yükle
            </h3>
            <p className="text-neutral-text-light text-sm">
              Mevcut bir dosyayı analiz edin ve AI ile düzenleyin.
            </p>
          </div>
          
          <div className="mt-auto flex flex-1 flex-col items-center justify-center gap-6 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 group-hover/card:bg-white group-hover/card:border-primary/30 transition-all duration-300 relative overflow-hidden">
             {/* Decor */}
             <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity bg-[radial-gradient(#5247e6_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
             
             <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="size-16 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 group-hover/card:text-primary group-hover/card:scale-110 transition-all duration-300">
                    <span className="material-symbols-outlined text-3xl">upload_file</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <p className="font-bold text-neutral-text-dark text-lg">Dosya Yükle</p>
                  <p className="text-xs text-neutral-text-light">PDF, PNG veya JPG</p>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      <style>{`
        /* 
           Scroll Left to Right:
           Start at -50% (showing the second set of items on the left side conceptually)
           Move to 0% (showing the first set of items)
           Since Set 1 and Set 2 are identical, the jump from 0% back to -50% is invisible.
           This makes the content appear to flow towards the Right.
        */
        @keyframes scroll-ltr {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        
        .animate-scroll-ltr {
          animation: scroll-ltr 40s linear infinite;
          /* Force hardware acceleration for smoother video-like playback */
          will-change: transform;
        }
        
        /* Pause on hover to let user read labels */
        .group\\/card:hover .animate-scroll-ltr {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default StepStart;