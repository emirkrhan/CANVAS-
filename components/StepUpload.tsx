import React, { useState } from 'react';
import { SavedProject } from '../types';

interface StepUploadProps {
  onNext: () => void;
  onUrlSubmit: (url: string) => void;
  onBack: () => void;
  onTemplateSelect: () => void;
  projects?: SavedProject[];
  onSelectProject?: (project: SavedProject) => void;
}

type UploadMode = 'main' | 'link' | 'text';

const StepUpload: React.FC<StepUploadProps> = ({ onNext, onUrlSubmit, onBack, onTemplateSelect, projects = [], onSelectProject }) => {
  const [mode, setMode] = useState<UploadMode>('main');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Disabled functionality
    // if (e.target.files && e.target.files.length > 0) {
    //   onNext();
    // }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    // Disabled dragging visual feedback
    // setIsDragging(true);
  };
  
  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Disabled drop functionality
    // if (e.dataTransfer.files.length > 0) {
    //     onNext();
    // }
  };

  const renderRecentProjects = () => (
    <div className="flex flex-col h-full animate-fade-in-up">
        <h2 className="text-lg font-bold text-neutral-text-dark mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">history</span>
            Tüm Grafik Özetlerim
        </h2>
        {projects.length === 0 ? (
             <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 border border-neutral-border border-dashed rounded-lg h-48">
                <span className="material-symbols-outlined text-gray-300 text-4xl mb-2">folder_open</span>
                <p className="text-sm font-bold text-gray-500">Henüz kayıtlı projeniz yok.</p>
                <p className="text-xs text-gray-400">Yeni bir özet oluşturarak başlayın.</p>
             </div>
        ) : (
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[500px]">
                {projects.map((project) => (
                    <div 
                        key={project.id}
                        onClick={() => onSelectProject && onSelectProject(project)}
                        className="group flex items-center gap-3 p-3 rounded-lg bg-white border border-neutral-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
                    >
                        <div className="size-10 rounded-md bg-purple-50 text-[#8B5CF6] flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-xl">slideshow</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sm text-neutral-text-dark truncate group-hover:text-primary transition-colors">
                                {project.title || "Adsız Proje"}
                            </h3>
                            <p className="text-[10px] text-neutral-text-light flex items-center gap-1.5">
                                <span className="font-medium text-gray-500 line-clamp-1">{project.citation || "Kaynak belirtilmedi"}</span>
                                <span className="size-0.5 rounded-full bg-gray-300"></span>
                                <span>{new Date(project.lastModified).toLocaleDateString()}</span>
                            </p>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 p-1.5 text-neutral-text-light hover:text-primary hover:bg-primary/5 rounded-full transition-all">
                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                        </button>
                    </div>
                ))}
            </div>
        )}
    </div>
  );

  const renderDashboardContent = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-border p-6 h-full flex flex-col">
       <div className="mb-4">
           <h2 className="text-xl font-black text-neutral-text-dark tracking-tight">Yeni Özet Başlat</h2>
           <p className="text-sm text-neutral-text-light">Araştırmanızdan profesyonel bir grafiksel özet oluşturun.</p>
       </div>

      {/* Drop Zone - DISABLED */}
      <div 
        className={`
            relative flex-1 flex flex-col items-center justify-center rounded-xl border-2 border-dashed 
            px-6 py-8 transition-all duration-300 ease-out min-h-[160px]
            border-gray-200 bg-gray-50/50 opacity-60 cursor-not-allowed
        `}
      >
        <div className="absolute top-3 right-3 z-20">
            <span className="bg-gray-200 text-gray-500 text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wide">Yakında</span>
        </div>
        <input 
            type="file" 
            className="absolute inset-0 cursor-not-allowed opacity-0 z-10" 
            onChange={handleFileUpload}
            accept=".pdf,.docx,.txt,.md,.png,.jpg"
            disabled={true}
        />
        <div className={`
            mb-3 flex size-12 items-center justify-center rounded-lg bg-white shadow-sm text-gray-300 
        `}>
          <span className="material-symbols-outlined text-2xl">cloud_upload</span>
        </div>
        <p className="mb-1 text-base font-bold text-gray-400 text-center">
          Makalenizin PDF'ini sürükleyin
        </p>
        <p className="text-[10px] font-medium text-gray-400 text-center max-w-[200px]">
          PDF, DOCX ve Resim desteği
        </p>
      </div>

      <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
              <span className="bg-white px-2 text-[10px] font-bold text-gray-400 uppercase tracking-wide">Veya şununla başla</span>
          </div>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
            { id: 'drive', label: 'Drive', icon: 'add_to_drive', color: 'text-blue-600', bg: 'bg-blue-50', onClick: () => {}, disabled: true },
            { id: 'link', label: 'Web Sitesi', icon: 'link', color: 'text-purple-600', bg: 'bg-purple-50', onClick: () => setMode('link'), disabled: false },
            { id: 'text', label: 'Özet Metni', icon: 'content_paste', color: 'text-green-600', bg: 'bg-green-50', onClick: () => setMode('text'), disabled: true },
            { id: 'template', label: 'Boş Şablon', icon: 'dashboard', color: 'text-orange-600', bg: 'bg-orange-50', onClick: onTemplateSelect, disabled: true }
        ].map((item) => (
            <button 
                key={item.id}
                onClick={item.onClick}
                disabled={item.disabled}
                className={`
                    group flex items-center gap-2.5 rounded-lg border border-neutral-border bg-white p-2.5 text-left shadow-sm transition-all duration-200 
                    ${item.disabled 
                        ? 'opacity-60 cursor-not-allowed' 
                        : 'hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5'
                    }
                `}
            >
                <div className={`flex size-7 items-center justify-center rounded-md ${item.disabled ? 'bg-gray-100 text-gray-400' : `${item.bg} ${item.color}`} shrink-0`}>
                    <span className="material-symbols-outlined text-base">{item.icon}</span>
                </div>
                <span className={`font-bold text-xs ${item.disabled ? 'text-gray-400' : 'text-neutral-text-dark'}`}>{item.label}</span>
                
                {item.disabled && (
                    <span className="ml-auto bg-gray-100 text-gray-400 text-[9px] font-bold px-1.5 py-0.5 rounded border border-gray-200">
                        Yakında
                    </span>
                )}
            </button>
        ))}
      </div>
    </div>
  );

  const renderLinkInput = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-border p-6 h-full flex flex-col animate-fade-in-up">
        <div className="flex flex-col gap-2 text-center mb-6">
            <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-purple-50 text-purple-600 mb-1">
                <span className="material-symbols-outlined text-xl">link</span>
            </div>
            <h3 className="text-lg font-bold text-neutral-text-dark">Link Ekle</h3>
            <p className="text-xs text-neutral-text-light">Bir JAMA makalesine veya bilimsel makaleye URL yapıştırın.</p>
        </div>
        
        <div className="flex-1 flex flex-col justify-center gap-4">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <span className="material-symbols-outlined text-lg">link</span>
                </div>
                <input 
                    type="url" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://jamanetwork.com/..."
                    className="w-full rounded-lg border-neutral-border pl-10 pr-4 py-3 text-sm shadow-sm focus:border-primary focus:ring-primary transition-all"
                    autoFocus
                />
            </div>
            
            <div className="flex gap-2">
                <button 
                    onClick={() => setMode('main')}
                    className="flex-1 flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold text-neutral-text-light hover:text-neutral-text-dark hover:bg-white transition-all hover:shadow-md border border-transparent hover:border-gray-200"
                >
                    <span className="material-symbols-outlined text-base">arrow_back</span>
                    İptal
                </button>
                <button 
                    onClick={() => onUrlSubmit(url)}
                    disabled={!url}
                    className="flex-[2] flex items-center justify-center gap-2 rounded-full px-6 py-2.5 bg-primary text-white text-xs font-bold shadow-lg shadow-primary/30 transition-all hover:bg-primary-dark hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Devam Et <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
            </div>
        </div>
    </div>
  );

  const renderTextInput = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-border p-6 h-full flex flex-col animate-fade-in-up">
        <div className="flex items-center gap-2 mb-3">
             <div className="flex size-8 items-center justify-center rounded-full bg-green-50 text-green-600">
                <span className="material-symbols-outlined text-base">content_paste</span>
            </div>
            <div>
                <h3 className="text-base font-bold text-neutral-text-dark">Metin Yapıştır</h3>
            </div>
        </div>
        
        <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Metni buraya yapıştırın..."
            className="flex-1 w-full rounded-lg border-neutral-border p-3 text-xs leading-relaxed shadow-inner focus:border-primary focus:ring-primary resize-none mb-3"
            autoFocus
        />
        
        <div className="flex gap-2">
            <button 
                onClick={() => setMode('main')}
                className="flex-1 flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold text-neutral-text-light hover:text-neutral-text-dark hover:bg-white transition-all hover:shadow-md border border-transparent hover:border-gray-200"
            >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                İptal
            </button>
            <button 
                onClick={onNext}
                disabled={!text}
                 className="flex-[2] flex items-center justify-center gap-2 rounded-full px-6 py-2.5 bg-primary text-white text-xs font-bold shadow-lg shadow-primary/30 transition-all hover:bg-primary-dark hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Analiz Et <span className="material-symbols-outlined text-base">auto_awesome</span>
            </button>
        </div>
    </div>
  );

  return (
    <div className="w-full animate-fade-in">
        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[420px]">
            
            {/* Left Side: Recent Projects */}
            <div className="lg:col-span-5 xl:col-span-4">
                {renderRecentProjects()}
            </div>

            {/* Right Side: Upload / Actions */}
            <div className="lg:col-span-7 xl:col-span-8">
                {mode === 'main' && renderDashboardContent()}
                {mode === 'link' && renderLinkInput()}
                {mode === 'text' && renderTextInput()}
            </div>
        </div>
    </div>
  );
};

export default StepUpload;