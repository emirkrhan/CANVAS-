import React, { useEffect, useState } from 'react';
import { ExtractedData } from '../types';
import { extractArticleData } from '../services/apiService';

interface StepAnalysisProps {
  onComplete: (data?: ExtractedData) => void;
  url?: string | null;
}

const StepAnalysis: React.FC<StepAnalysisProps> = ({ onComplete, url }) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Fake progress animation function
    const animateProgress = () => {
        const interval = setInterval(() => {
            if (!isMounted) {
                clearInterval(interval);
                return;
            }
            setProgress((prev) => {
                // Stall at 90% if loading
                if (prev >= 90) return prev;
                return prev + 1;
            });
        }, 50);
        return interval;
    };

    const runAnalysis = async () => {
        const interval = animateProgress();

        if (url) {
            try {
                const data = await extractArticleData(url);
                if (isMounted) {
                    clearInterval(interval);
                    setProgress(100);
                    setTimeout(() => onComplete(data), 800);
                }
            } catch (err) {
                if (isMounted) {
                    clearInterval(interval);
                    setError(err instanceof Error ? err.message : 'Analysis failed');
                }
            }
        } else {
            // Mock simulation for demo/no-url path
            setTimeout(() => {
                if (isMounted) {
                    clearInterval(interval);
                    setProgress(100);
                    setTimeout(() => onComplete(), 800);
                }
            }, 3000);
        }
    };

    runAnalysis();

    return () => { isMounted = false; };
  }, [onComplete, url]);

  if (error) {
      return (
          <div className="flex flex-col items-center justify-center gap-4 w-full h-96 text-center animate-fade-in">
              <div className="size-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl">error</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-text-dark">Bir Hata Oluştu</h3>
              <p className="text-neutral-text-light max-w-md">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-bold"
              >
                  Tekrar Dene
              </button>
          </div>
      )
  }

  return (
    <div className="flex flex-col gap-8 w-full mx-auto animate-fade-in-up">
      {/* Page Heading */}
      <div className="flex flex-col gap-4 text-center mb-4">
          <p className="text-4xl font-black leading-tight tracking-tight text-neutral-text-dark sm:text-5xl">
            {url ? 'Yayınınız analiz ediliyor...' : 'Demo analiz başlatılıyor...'}
          </p>
          <p className="text-lg text-neutral-text-light max-w-3xl mx-auto">
            Yapay zekamız anahtar içeriği çıkarıyor, şekilleri tanımlıyor ve mükemmel grafiksel özeti oluşturmak için verileri yapılandırıyor.
          </p>
      </div>

      {/* File Info Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-white/20 p-6 flex items-center gap-5 relative overflow-hidden group hover:shadow-xl transition-shadow">
        <div className="absolute top-0 right-0 p-3 opacity-10">
            <span className="material-symbols-outlined text-9xl">description</span>
        </div>
        <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-purple-500 text-white shadow-lg shadow-primary/30 shrink-0">
            <span className="material-symbols-outlined text-3xl">{url ? 'link' : 'article'}</span>
        </div>
        <div className="flex-1 min-w-0 z-10">
            <h3 className="font-bold text-lg text-neutral-text-dark truncate">
                {url ? url : 'kuantum_dolaniklik_incelemesi_2023.pdf'}
            </h3>
            <p className="text-sm text-neutral-text-light">{url ? 'Web Sitesi Analizi' : '2.4 MB • PDF Belgesi'}</p>
        </div>
        <div className="z-10">
             <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-100 flex items-center gap-1">
                <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>
                İşleniyor
             </div>
        </div>
      </div>

      {/* Main Progress Bar */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <p className="text-sm font-bold uppercase tracking-widest text-neutral-text-light">Genel İlerleme</p>
          <p className="text-2xl font-black text-primary">{progress}%</p>
        </div>
        <div className="rounded-full bg-gray-100 h-4 overflow-hidden shadow-inner p-0.5">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-primary to-purple-500 relative transition-all duration-200 ease-out shadow-sm" 
            style={{ width: `${progress}%` }}
          >
            <div className="progress-shimmer absolute inset-0 opacity-40"></div>
          </div>
        </div>
        <p className="text-right text-xs font-medium text-neutral-text-light/70">
          {progress < 100 ? 'Analiz devam ediyor...' : 'Tamamlandı!'}
        </p>
      </div>

      {/* Detailed Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Steps Timeline */}
        <div className="flex flex-col gap-5">
            {[
                { label: 'Belge Yapısı Ayrıştırılıyor', icon: 'verified', threshold: 25 },
                { label: 'Metin ve Anahtar Kelimeler Çıkarılıyor', icon: 'text_fields', threshold: 50 },
                { label: 'Şekiller ve Tablolar Tanımlanıyor', icon: 'image_search', threshold: 75 },
                { label: 'Düzen Önerileri Oluşturuluyor', icon: 'auto_awesome_mosaic', threshold: 95 }
            ].map((step, idx) => {
                const isCompleted = progress > step.threshold;
                const isCurrent = progress <= step.threshold && progress > (step.threshold - 25);
                const isPending = progress <= (step.threshold - 25);

                return (
                    <div 
                        key={idx}
                        className={`
                            flex items-center gap-4 px-5 py-4 rounded-xl border transition-all duration-500
                            ${isCurrent 
                                ? 'bg-white border-primary shadow-lg scale-[1.02] shadow-primary/5' 
                                : isCompleted 
                                    ? 'bg-white border-neutral-border opacity-70' 
                                    : 'bg-transparent border-transparent opacity-50'
                            }
                        `}
                    >
                        <div className={`
                            flex items-center justify-center rounded-xl shrink-0 size-12 transition-colors duration-500
                            ${isCompleted ? 'bg-green-100 text-green-600' : isCurrent ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-gray-100 text-gray-400'}
                        `}>
                            <span className="material-symbols-outlined">
                                {isCompleted ? 'check' : step.icon}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <p className={`text-base font-bold transition-colors ${isCurrent ? 'text-primary' : 'text-neutral-text-dark'}`}>
                                {step.label}
                            </p>
                            <p className="text-xs font-medium text-neutral-text-light">
                                {isCompleted ? 'Tamamlandı' : isCurrent ? 'Devam Ediyor...' : 'Beklemede'}
                            </p>
                        </div>
                        {isCurrent && (
                            <div className="ml-auto">
                                <span className="flex size-3 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full size-3 bg-primary"></span>
                                </span>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>

        {/* Right Column: AI Insights Panel */}
        <div className="flex flex-col h-full">
            <div className="bg-gradient-to-b from-primary/5 to-transparent border border-primary/10 rounded-2xl p-6 h-full flex flex-col gap-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 border-b border-primary/10 pb-4">
                  <span className="material-symbols-outlined text-primary animate-pulse-slow">psychology</span>
                  <h3 className="text-lg font-bold text-neutral-text-dark">Yapay Zeka Görüşleri</h3>
              </div>
              
              <ul className="space-y-4 flex-1">
                {progress > 15 && (
                    <li className="flex gap-3 animate-slide-in-right">
                        <span className="material-symbols-outlined text-green-500 text-sm mt-0.5">check_circle</span>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-bold text-neutral-text-dark">Belge Türü Tanımlandı</span>
                            <span className="text-xs text-neutral-text-light">İçerik başarıyla tanımlandı.</span>
                        </div>
                    </li>
                )}
                {progress > 45 && (
                    <li className="flex gap-3 animate-slide-in-right" style={{animationDelay: '0.1s'}}>
                        <span className="material-symbols-outlined text-green-500 text-sm mt-0.5">check_circle</span>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-bold text-neutral-text-dark">Anahtar Bulgular Çıkarıldı</span>
                            <span className="text-xs text-neutral-text-light">Özet bölümleri ve metadata ayrıştırıldı.</span>
                        </div>
                    </li>
                )}
                 {progress > 80 && (
                    <li className="flex gap-3 animate-slide-in-right" style={{animationDelay: '0.2s'}}>
                        <span className="material-symbols-outlined text-green-500 text-sm mt-0.5">check_circle</span>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-bold text-neutral-text-dark">Görsel Varlıklar Hazır</span>
                            <span className="text-xs text-neutral-text-light">İkon önerileri oluşturuldu.</span>
                        </div>
                    </li>
                )}
              </ul>

              <div className="text-xs text-center text-primary/60 font-medium bg-primary/5 py-2 rounded-lg">
                  Gemini 1.5 Pro tarafından desteklenmektedir
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StepAnalysis;