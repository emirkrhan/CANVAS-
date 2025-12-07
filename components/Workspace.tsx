import React, { useState, useEffect, useRef } from 'react';
import { polishText } from '../services/geminiService';
import { Section, WorkspaceSection, SavedProject, SectionLayout, ExtractedData } from '../types';
import PptxGenJS from 'pptxgenjs';
import html2canvas from 'html2canvas';
import { LAYOUT_OPTIONS } from '../constants';
import { WireframeIcon } from './WireframeIcon';

interface WorkspaceProps {
  initialImage?: string;
  layoutId?: string;
  initialProject?: SavedProject | null;
  analyzedData?: ExtractedData;
  onSaveProject: (project: SavedProject) => void;
  onBack: () => void;
  onNew: () => void;
}

// Canvas Dimensions
const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 720;
const HEADER_HEIGHT = 150; // 60px color bar + 90px title area
const FOOTER_HEIGHT = 30;

// Helper to get the correct API key source
const processImageForPPTX = async (url: string): Promise<string> => {
    try {
        const response = await fetch(url, { mode: 'cors' });
        const blob = await response.blob();
        return new Promise((resolve) => {
            const img = new Image();
            const objectUrl = URL.createObjectURL(blob);
            img.onload = () => {
                URL.revokeObjectURL(objectUrl);
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0);
                    resolve(canvas.toDataURL('image/png'));
                } else {
                    resolve(url);
                }
            };
            img.onerror = () => {
                URL.revokeObjectURL(objectUrl);
                resolve(url);
            };
            img.crossOrigin = 'Anonymous';
            img.src = objectUrl;
        });
    } catch (e) {
        console.warn("Could not process image for PPTX transparency:", e);
        return url;
    }
};

interface LayoutTemplate {
    title: string;
    citation: string;
    sections: WorkspaceSection[];
}

const LAYOUT_TEMPLATES: Record<string, LayoutTemplate> = {
    'clinical-trial': {
        title: 'Transepidermal Water Loss in Oral Food Challenges in Children With Peanut Allergy',
        citation: 'Freigeh GE et al. JAMA Netw Open. 2025;8(11):e2543371.',
        // 4 + 1 Layout (2x2 Left Grid + 1 Large Right Column)
        sections: [
            {
                id: 'population',
                title: 'POPULATION',
                content: '40 Children with history of peanut reaction undergoing oral food challenge (OFC). Mean age, 31.8 mos.',
                icon: 'groups', // Material Symbol
                rect: { x: 50, y: 160, w: 380, h: 255 },
                layout: 'right'
            },
            {
                id: 'intervention',
                title: 'INTERVENTION',
                content: 'Peanut OFC with stopping rules based on a 1 g/m²/h rise in TEWL plus one objective symptom.',
                icon: 'cardiology', // Material Symbol
                rect: { x: 450, y: 160, w: 380, h: 255 }
            },
            {
                id: 'findings',
                title: 'FINDINGS',
                content: 'The TEWL group had significantly lower rates of anaphylaxis compared with the control group (P=.02).',
                icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCs1U5LZXNuYJQvgDABxio2bIZt-pbrev5F4ez7Ls8afQoVXK5-_uQeFPrZA3RZ9Oddj_Vveut5Gpt5z4dKne1jI8LYPnOuwfkqfUxJRce0MJY648lmaiWoocYnY-CewB8jQP8qIEoV7SHq94M4ZiGosfzxfhIdWS7n7-0m0DNRYBmrnDEYVu96ZQpivEYB88X7IMFhVoQneMNIrtaqX4GI7O-fyCkF2Y8uTC3FEq_-_QhWasG7t2Poz9xEc-oZyP91ToTTNRIw838', // Bar chart placeholder
                rect: { x: 850, y: 160, w: 380, h: 530 },
                imageScale: 1.1,
                layout: 'bottom'
            },
            {
                id: 'settings',
                title: 'SETTINGS / LOCATIONS',
                content: '1 Academic medical center',
                icon: 'apartment', // Material Symbol
                rect: { x: 50, y: 435, w: 380, h: 255 }
            },
            {
                id: 'outcome',
                title: 'PRIMARY OUTCOME',
                content: 'Anaphylaxis rate defined as a Consortium of Food Allergy Research (CoFAR) score ≥2.',
                rect: { x: 450, y: 435, w: 380, h: 255 }
            }
        ]
    },
    'meta-analysis': {
        title: 'Astım İçin İmmünoterapinin Etkinliği: Sistematik İnceleme',
        citation: 'Smith J ve ark. JAMA. 2024;331(15):1234-1245.',
        // 3 Column Standard
        sections: [
            {
                id: 'sources',
                title: 'VERİ KAYNAKLARI',
                content: 'Başlangıçtan Ocak 2024\'e kadar MEDLINE, Embase ve Cochrane Merkezi Kontrollü Denemeler Kaydı.',
                icon: 'database',
                rect: { x: 140, y: 160, w: 320, h: 500 }
            },
            {
                id: 'methods',
                title: 'ÇALIŞMA SEÇİMİ',
                content: 'Pediatrik astım hastalarında immünoterapiyi plasebo ile karşılaştıran randomize klinik çalışmalar.',
                icon: 'filter_alt',
                rect: { x: 480, y: 160, w: 320, h: 500 }
            },
            {
                id: 'synthesis',
                title: 'VERİ SENTEZİ',
                content: '64 çalışma (N=4500). Subkutan immünoterapi astım semptomlarını önemli ölçüde azalttı (SMD -0.45; %95 GA -0.6 ila -0.3).',
                icon: 'analytics',
                statistics: 'SMD -0.45',
                rect: { x: 820, y: 160, w: 320, h: 500 }
            }
        ]
    },
    'longitudinal-study': {
        title: 'Kardiyovasküler Riskin Boylamsal Yörüngeleri',
        citation: 'Doe A ve ark. JAMA Cardiol. 2024;9(2):100-110.',
        // UPDATED: 3 Perfect Squares (320x320)
        sections: [
            {
                id: 'baseline',
                title: 'BAŞLANGIÇ (Yıl 0)',
                content: 'KVH olmayan 1500 katılımcı. Ortalama yaş 45 yıl. %50 Kadın.',
                icon: 'groups',
                rect: { x: 140, y: 265, w: 320, h: 320 }, // Centered Vertically in 530px space (105px margin top/bottom relative to safe area)
                layout: 'left'
            },
            {
                id: 'followup',
                title: 'TAKİP (Yıl 5)',
                content: 'Kan basıncı, lipitler ve yaşam tarzı faktörlerinin değerlendirilmesi.',
                icon: 'monitor_heart',
                rect: { x: 480, y: 265, w: 320, h: 320 },
                layout: 'left'
            },
            {
                id: 'outcome',
                title: 'SONUÇ (Yıl 10)',
                content: 'Erken hipertansiyon başlangıcı ile ilişkili yüksek risk skoru (HR 1.5).',
                statistics: 'HR 1.5',
                rect: { x: 820, y: 265, w: 320, h: 320 },
                layout: 'left'
            }
        ]
    },
    'comparative-study': {
        title: 'Hipertansiyonda İlaç A ile İlaç B Karşılaştırması',
        citation: 'Deneme Araştırmacıları. JAMA. 2024;330:500.',
        // 2x2 Grid
        sections: [
            {
                id: 'group-a',
                title: 'GRUP A (Yeni İlaç)',
                content: 'N=500. 10mg günlük dozda yeni inhibitör aldı.',
                icon: 'medication',
                rect: { x: 160, y: 160, w: 460, h: 240 },
                layout: 'left'
            },
            {
                id: 'group-b',
                title: 'GRUP B (Standart Bakım)',
                content: 'N=500. Standart ACE inhibitörü tedavisi aldı.',
                icon: 'healing',
                rect: { x: 660, y: 160, w: 460, h: 240 },
                layout: 'left'
            },
            {
                id: 'result-a',
                title: 'SONUÇLAR GRUP A',
                content: 'Ortalama SBP düşüşü: 15 mmHg. Advers olaylar: %5.',
                chartData: [{label: 'Başlangıç', value: 140}, {label: 'Bitiş', value: 125}],
                rect: { x: 160, y: 420, w: 460, h: 240 },
                layout: 'right'
            },
            {
                id: 'result-b',
                title: 'SONUÇLAR GRUP B',
                content: 'Ortalama SBP düşüşü: 12 mmHg. Advers olaylar: %8.',
                chartData: [{label: 'Başlangıç', value: 140}, {label: 'Bitiş', value: 128}],
                rect: { x: 660, y: 420, w: 460, h: 240 },
                layout: 'right'
            }
        ]
    },
    'cycle-process': {
        title: 'Döngü / Süreç Diyagramı',
        citation: 'Yazar Adı ve ark. Dergi. 2024.',
        // UPDATED: Center Square (280x280) + 4 Surrounding Boxes
        sections: [
            {
                id: 'center',
                title: 'MERKEZ',
                content: 'Sürecin ana odak noktası veya döngünün kalbi.',
                icon: 'hub',
                rect: { x: 500, y: 285, w: 280, h: 280 } // Center Square
            },
            {
                id: 'step1',
                title: 'ADIM 1',
                content: 'Hazırlık.',
                icon: 'assignment',
                rect: { x: 160, y: 170, w: 280, h: 180 } // Top Left
            },
             {
                id: 'step2',
                title: 'ADIM 2',
                content: 'Uygulama.',
                icon: 'build',
                rect: { x: 840, y: 170, w: 280, h: 180 } // Top Right
            },
             {
                id: 'step3',
                title: 'ADIM 3',
                content: 'Analiz.',
                icon: 'analytics',
                rect: { x: 840, y: 500, w: 280, h: 180 } // Bottom Right
            },
             {
                id: 'step4',
                title: 'ADIM 4',
                content: 'İterasyon.',
                icon: 'update',
                rect: { x: 160, y: 500, w: 280, h: 180 } // Bottom Left
            }
        ]
    },
    'blank-canvas': {
        title: 'Yeni Grafiksel Özet Projesi',
        citation: 'Yazar Adı ve ark. Dergi. 2024.',
        sections: [
            {
                id: 'main',
                title: 'TASARLAMAYA BAŞLA',
                content: 'Bu bölümü düzenlemek veya araç çubuğunu kullanarak yeni öğeler eklemek için buraya tıklayın.',
                icon: 'edit_square',
                rect: { x: 140, y: 170, w: 1000, h: 500 }
            }
        ]
    }
};

interface SectionCardProps {
    section: WorkspaceSection;
    isSelected: boolean;
    onSectionClick: (id: string) => void;
    onUpdateRect: (id: string, rect: { x: number; y: number; w: number; h: number }) => void;
}

const SectionCard: React.FC<SectionCardProps> = ({ section, isSelected, onSectionClick, onUpdateRect }) => {
    const scale = section.imageScale || 1;
    const textScale = section.textScale || 1;
    const { x, y, w, h } = section.rect;
    const layout = section.layout || 'bottom';
    const isHorizontal = layout === 'left' || layout === 'right';
    const isImageFirst = layout === 'top' || layout === 'left';
    const isUrlIcon = section.icon && (section.icon.startsWith('http') || section.icon.startsWith('data:'));

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault(); 
        e.stopPropagation();
        if (!isSelected) { onSectionClick(section.id); }
        const startX = e.clientX;
        const startY = e.clientY;
        const startRect = { ...section.rect };
        let hasMoved = false;
        const onMouseMove = (moveEvent: MouseEvent) => {
            const dx = moveEvent.clientX - startX;
            const dy = moveEvent.clientY - startY;
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved = true;
            let newX = startRect.x + dx;
            let newY = startRect.y + dy;
            const MIN_Y = HEADER_HEIGHT;
            const MAX_Y = CANVAS_HEIGHT - FOOTER_HEIGHT; 
            newX = Math.max(0, Math.min(newX, CANVAS_WIDTH - startRect.w));
            newY = Math.max(MIN_Y, Math.min(newY, MAX_Y - startRect.h));
            onUpdateRect(section.id, { ...startRect, x: newX, y: newY });
        };
        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            if (!hasMoved) { onSectionClick(section.id); }
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const handleResize = (e: React.MouseEvent, type: string) => {
        e.stopPropagation(); e.preventDefault();
        const startX = e.clientX; const startY = e.clientY; const startRect = { ...section.rect };
        const onMouseMove = (moveEvent: MouseEvent) => {
            const dx = moveEvent.clientX - startX; const dy = moveEvent.clientY - startY;
            let newRect = { ...startRect };
            if (type.includes('e')) { newRect.w = Math.min(Math.max(50, startRect.w + dx), CANVAS_WIDTH - startRect.x); }
            if (type.includes('w')) { const effectiveDx = Math.min(Math.max(dx, -startRect.x), startRect.w - 50); newRect.x = startRect.x + effectiveDx; newRect.w = startRect.w - effectiveDx; }
            if (type.includes('s')) { newRect.h = Math.min(Math.max(50, startRect.h + dy), (CANVAS_HEIGHT - FOOTER_HEIGHT) - startRect.y); }
            if (type.includes('n')) { const effectiveDy = Math.min(Math.max(dy, -(startRect.y - HEADER_HEIGHT)), startRect.h - 50); newRect.y = startRect.y + effectiveDy; newRect.h = startRect.h - effectiveDy; }
            onUpdateRect(section.id, newRect);
        };
        const onMouseUp = () => { document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); };
        document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp);
    };

    const Handle = ({ cursor, position, type }: { cursor: string; position: string; type: string }) => (
        <div onMouseDown={(e) => handleResize(e, type)} className={`absolute w-4 h-4 bg-white border-2 border-[#8B5CF6] rounded-full z-50 ${cursor} ${position} shadow-md hover:scale-125 transition-transform`} />
    );

    const VisualContent = () => (
        <>
            {section.chartData ? (
                <div className={`flex items-end justify-around gap-2 bg-gray-50 rounded p-2 ${isHorizontal ? 'h-full w-full' : 'h-32 w-full mt-2'}`}>
                {section.chartData.map((d, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 w-full">
                        <div className="w-full bg-[#8B5CF6] opacity-80 rounded-t" style={{ height: `${d.value * 2}%` }}></div>
                        <span className="text-[10px] text-gray-500 font-medium">{d.label}</span>
                    </div>
                ))}
                </div>
            ) : section.icon ? (
                <div className={`flex items-center justify-center min-h-[40px] overflow-hidden ${isHorizontal ? 'w-full h-full' : 'flex-1'}`}>
                {isUrlIcon ? (
                        <img src={section.icon} alt={section.title} className="object-contain opacity-80 transition-transform origin-center" style={{ transform: `scale(${scale})`, maxHeight: '100%', maxWidth: '100%' }} />
                ) : (
                    <span className="material-symbols-outlined text-6xl text-gray-600 opacity-80" style={{ transform: `scale(${scale})` }}>{section.icon}</span>
                )}
                </div>
            ) : null}
            {!section.content && !section.chartData && !section.icon && (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-2 min-h-[100px]">
                <div className="flex gap-2"><span className="material-symbols-outlined text-2xl">image</span><span className="material-symbols-outlined text-2xl">text_fields</span></div>
                <span className="text-xs font-bold text-center">İçerik Ekle</span>
                </div>
            )}
        </>
    );

    const TextContent = () => (
        <div className={`text-neutral-text-dark text-sm leading-relaxed overflow-hidden whitespace-pre-wrap ${isHorizontal ? 'w-full' : ''}`} style={{ fontSize: `${0.875 * textScale}rem`, lineHeight: '1.5' }}>
            {section.content}
        </div>
    );

    return (
      <div 
        onMouseDown={handleMouseDown} 
        onClick={(e) => e.stopPropagation()} 
        style={{ left: x, top: y, width: w, height: h }} 
        className={`absolute flex flex-col cursor-move group pointer-events-auto ${isSelected ? 'z-20' : 'z-10 hover:z-20'}`}
      >
        {isSelected && (
            <>
                <Handle cursor="cursor-nw-resize" position="-top-3 -left-3" type="nw" />
                <Handle cursor="cursor-n-resize" position="-top-3 left-1/2 -translate-x-1/2" type="n" />
                <Handle cursor="cursor-ne-resize" position="-top-3 -right-3" type="ne" />
                <Handle cursor="cursor-e-resize" position="top-1/2 -right-3 -translate-y-1/2" type="e" />
                <Handle cursor="cursor-se-resize" position="-bottom-3 -right-3" type="se" />
                <Handle cursor="cursor-s-resize" position="-bottom-3 left-1/2 -translate-x-1/2" type="s" />
                <Handle cursor="cursor-sw-resize" position="-bottom-3 -left-3" type="sw" />
                <Handle cursor="cursor-w-resize" position="top-1/2 -left-3 -translate-y-1/2" type="w" />
            </>
        )}
        <div className={`w-full h-full rounded-lg border-2 transition-shadow overflow-hidden bg-white flex flex-col p-4 ${isSelected ? 'border-[#8B5CF6] shadow-xl bg-purple-50' : 'border-gray-200 hover:border-purple-300 hover:shadow-md'}`}>
            <div className="text-[#8B5CF6] font-bold text-xs uppercase mb-2 tracking-wide pointer-events-none select-none shrink-0">{section.title}</div>
            <div className={`flex-1 flex gap-3 overflow-hidden pointer-events-none select-none ${isHorizontal ? 'flex-row items-stretch' : 'flex-col'}`}>
               {isImageFirst && <div className={`${isHorizontal ? 'flex-1' : 'flex-1 flex flex-col'}`}><VisualContent /></div>}
               {section.content && <div className={`${isHorizontal ? 'flex-1 overflow-y-auto' : ''}`}><TextContent /></div>}
               {!isImageFirst && <div className={`${isHorizontal ? 'flex-1' : 'flex-1 flex flex-col'}`}><VisualContent /></div>}
            </div>
            {section.statistics && (
                 <div className="mt-auto pt-2 border-t border-purple-100 shrink-0"><span className="text-[#8B5CF6] font-black text-lg">{section.statistics}</span></div>
            )}
        </div>
      </div>
    );
};

interface EditPanelProps {
    isOpen: boolean;
    section?: WorkspaceSection | null;
    onClose: () => void;
    onSave: (section: WorkspaceSection) => void;
    onPreviewUpdate: (section: WorkspaceSection) => void;
    onOpenIconLibrary: () => void;
    documentSettings: {
        title: string;
        citation: string;
        headerColor: string;
        currentLayoutId: string;
        onUpdate: (title: string, citation: string) => void;
        onColorChange: (color: string) => void;
        onLayoutChange: (layoutId: string) => void;
    };
}

const EditPanel: React.FC<EditPanelProps> = ({ 
    isOpen, section, onClose, onSave, onPreviewUpdate, onOpenIconLibrary, documentSettings 
}) => {
    const [isPolishing, setIsPolishing] = useState(false);
    if (!isOpen) return null;
    const handleMagicPolish = async () => { 
        if (!section || !section.content) return;
        setIsPolishing(true);
        try {
            const polished = await polishText(section.content, "Summarize this text for a graphical abstract section. Keep it concise (under 30 words) and scientific.");
            onPreviewUpdate({ ...section, content: polished });
        } catch (e) {
            console.error(e);
        } finally {
            setIsPolishing(false);
        }
    };
    const updateLayout = (newLayout: SectionLayout) => { 
        if(section) {
            const updated = { ...section, layout: newLayout };
            onPreviewUpdate(updated);
            onSave(updated);
        }
    }

    if (!section) {
        return (
             <div className="flex flex-col h-full bg-white">
                <div className="p-4 border-b border-gray-200 bg-gray-50"><h3 className="font-bold text-neutral-text-dark">Belge Ayarları</h3></div>
                <div className="p-4 flex flex-col gap-6 overflow-y-auto flex-1">
                    <div className="flex flex-col gap-2"><label className="text-xs font-bold text-gray-500 uppercase">Makale Başlığı</label><textarea value={documentSettings.title} onChange={(e) => documentSettings.onUpdate(e.target.value, documentSettings.citation)} className="w-full rounded-lg border-gray-300 text-sm p-2 focus:ring-[#8B5CF6] focus:border-[#8B5CF6]" rows={3} /></div>
                    <div className="flex flex-col gap-2"><label className="text-xs font-bold text-gray-500 uppercase">Alıntı / Kaynak</label><input type="text" value={documentSettings.citation} onChange={(e) => documentSettings.onUpdate(documentSettings.title, e.target.value)} className="w-full rounded-lg border-gray-300 text-sm p-2 focus:ring-[#8B5CF6] focus:border-[#8B5CF6]" /></div>
                    <div className="flex flex-col gap-2"><label className="text-xs font-bold text-gray-500 uppercase">Tema Rengi</label><div className="flex flex-wrap gap-2">{['#C62828', '#1565C0', '#2E7D32', '#F9A825', '#6A1B9A', '#455A64'].map(c => (<button key={c} onClick={() => documentSettings.onColorChange(c)} className={`size-8 rounded-full border-2 transition-transform hover:scale-110 ${documentSettings.headerColor === c ? 'border-gray-900 scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />))}<input type="color" value={documentSettings.headerColor} onChange={(e) => documentSettings.onColorChange(e.target.value)} className="size-8 p-0 border-0 rounded-full overflow-hidden cursor-pointer" /></div></div>
                    <div className="flex flex-col gap-2"><label className="text-xs font-bold text-gray-500 uppercase">Düzen Değiştir</label><div className="grid grid-cols-2 gap-2">{LAYOUT_OPTIONS.map((layout) => { const isEnabled = layout.id === 'clinical-trial'; const isSelected = documentSettings.currentLayoutId === layout.id; return (<div key={layout.id} onClick={() => isEnabled && documentSettings.onLayoutChange(layout.id)} className={`group flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all duration-200 relative ${isEnabled ? 'cursor-pointer hover:border-[#8B5CF6] hover:bg-purple-50 hover:shadow-sm' : 'cursor-not-allowed opacity-50 bg-gray-50'} ${isSelected ? 'border-[#8B5CF6] bg-purple-50 ring-1 ring-[#8B5CF6]' : 'border-gray-200 bg-white'}`}><div className="w-full aspect-[3/2] flex items-center justify-center p-1"><div className="w-full h-full"><WireframeIcon id={layout.id} isActive={isSelected} /></div></div><span className={`text-[10px] font-bold text-center leading-tight ${isSelected ? 'text-[#8B5CF6]' : 'text-gray-600'}`}>{layout.name}</span>{!isEnabled && (<div className="absolute top-1 right-1 size-1.5 bg-gray-300 rounded-full" />)}</div>); })}</div><p className="text-[10px] text-gray-400">Düzen değiştirmek mevcut içeriği sıfırlayabilir.</p></div>
                </div>
             </div>
        );
    }
    return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center"><h3 className="font-bold text-neutral-text-dark">Bölüm Düzenle</h3><button onClick={onClose} className="text-gray-400 hover:text-gray-700"><span className="material-symbols-outlined">close</span></button></div>
            <div className="p-4 flex flex-col gap-6 overflow-y-auto flex-1">
                 <div className="flex flex-col gap-2"><label className="text-xs font-bold text-gray-500 uppercase">Başlık</label><input type="text" value={section.title} onChange={(e) => onPreviewUpdate({...section, title: e.target.value})} onBlur={() => onSave(section)} className="w-full rounded-lg border-gray-300 text-sm p-2 font-bold focus:ring-[#8B5CF6] focus:border-[#8B5CF6]" /></div>
                 <div className="flex flex-col gap-2"><div className="flex justify-between items-center"><label className="text-xs font-bold text-gray-500 uppercase">İçerik</label><button onClick={handleMagicPolish} disabled={isPolishing} className="text-[10px] flex items-center gap-1 text-[#8B5CF6] font-bold hover:bg-purple-50 px-2 py-1 rounded"><span className="material-symbols-outlined text-sm">auto_awesome</span>{isPolishing ? 'İyileştiriliyor...' : 'AI ile Yaz'}</button></div><textarea value={section.content} onChange={(e) => onPreviewUpdate({...section, content: e.target.value})} onBlur={() => onSave(section)} className="w-full rounded-lg border-gray-300 text-sm p-2 focus:ring-[#8B5CF6] focus:border-[#8B5CF6] min-h-[100px]" /></div>
                 <div className="flex flex-col gap-2"><label className="text-xs font-bold text-gray-500 uppercase">Görsel</label>{section.chartData ? (<div className="p-3 bg-gray-50 rounded-lg border border-gray-200"><p className="text-xs font-bold mb-2">Grafik Verileri</p>{section.chartData.map((d, i) => (<div key={i} className="flex gap-2 mb-2 items-center"><input className="w-1/2 text-xs p-1 border rounded" value={d.label} onChange={(e) => { const newData = [...section.chartData!]; newData[i].label = e.target.value; onPreviewUpdate({...section, chartData: newData}); }} onBlur={() => onSave(section)} /><input className="w-1/2 text-xs p-1 border rounded" type="number" value={d.value} onChange={(e) => { const newData = [...section.chartData!]; newData[i].value = Number(e.target.value); onPreviewUpdate({...section, chartData: newData}); }} onBlur={() => onSave(section)} /></div>))}</div>) : (<div className="flex items-center gap-4"><div onClick={onOpenIconLibrary} className="size-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#8B5CF6] hover:bg-purple-50 transition-colors">{section.icon ? (section.icon.startsWith('http') || section.icon.startsWith('data:') ? (<img src={section.icon} className="w-full h-full object-contain p-1" alt="" />) : (<span className="material-symbols-outlined text-3xl text-gray-600">{section.icon}</span>)) : (<span className="material-symbols-outlined text-gray-400">add_photo_alternate</span>)}</div><button onClick={onOpenIconLibrary} className="text-sm font-bold text-[#8B5CF6] hover:underline">Simge/Resim Değiştir</button></div>)}</div>
                 <div className="flex flex-col gap-2 pt-2 border-t border-gray-100"><label className="text-xs font-bold text-gray-500 uppercase">İçerik Düzeni</label><div className="flex gap-2"><button onClick={() => updateLayout('top')} className={`flex-1 p-2 rounded-lg border flex items-center justify-center transition-colors hover:bg-gray-50 ${section.layout === 'top' ? 'border-[#8B5CF6] bg-purple-50 text-[#8B5CF6]' : 'border-gray-200 text-gray-400'}`} title="Görsel Üstte"><span className="material-symbols-outlined">vertical_align_top</span></button><button onClick={() => updateLayout('bottom')} className={`flex-1 p-2 rounded-lg border flex items-center justify-center transition-colors hover:bg-gray-50 ${(section.layout === 'bottom' || !section.layout) ? 'border-[#8B5CF6] bg-purple-50 text-[#8B5CF6]' : 'border-gray-200 text-gray-400'}`} title="Görsel Altta"><span className="material-symbols-outlined">vertical_align_bottom</span></button><button onClick={() => updateLayout('left')} className={`flex-1 p-2 rounded-lg border flex items-center justify-center transition-colors hover:bg-gray-50 ${section.layout === 'left' ? 'border-[#8B5CF6] bg-purple-50 text-[#8B5CF6]' : 'border-gray-200 text-gray-400'}`} title="Görsel Solda"><span className="material-symbols-outlined">align_horizontal_left</span></button><button onClick={() => updateLayout('right')} className={`flex-1 p-2 rounded-lg border flex items-center justify-center transition-colors hover:bg-gray-50 ${section.layout === 'right' ? 'border-[#8B5CF6] bg-purple-50 text-[#8B5CF6]' : 'border-gray-200 text-gray-400'}`} title="Görsel Sağda"><span className="material-symbols-outlined">align_horizontal_right</span></button></div></div>
                 <div className="flex flex-col gap-4 pt-2 border-t border-gray-100"><div><div className="flex justify-between mb-1"><label className="text-xs font-bold text-gray-500 uppercase">Görsel Boyutu</label><span className="text-xs text-gray-400">{Math.round((section.imageScale || 1) * 100)}%</span></div><input type="range" min="0.5" max="2" step="0.1" value={section.imageScale || 1} onChange={(e) => onPreviewUpdate({...section, imageScale: parseFloat(e.target.value)})} onMouseUp={() => onSave(section)} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#8B5CF6]" /></div><div><div className="flex justify-between mb-1"><label className="text-xs font-bold text-gray-500 uppercase">Metin Boyutu</label><span className="text-xs text-gray-400">{Math.round((section.textScale || 1) * 100)}%</span></div><input type="range" min="0.7" max="1.5" step="0.1" value={section.textScale || 1} onChange={(e) => onPreviewUpdate({...section, textScale: parseFloat(e.target.value)})} onMouseUp={() => onSave(section)} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#8B5CF6]" /></div></div>
            </div>
        </div>
    );
};

const Workspace: React.FC<WorkspaceProps> = ({ onBack, layoutId = 'clinical-trial', initialProject, analyzedData, onSaveProject, onNew }) => {
  const [currentLayoutId, setCurrentLayoutId] = useState(initialProject ? initialProject.layoutId : layoutId);
  const initializeState = () => { 
      if (initialProject) { 
          return { sections: initialProject.sections, title: initialProject.title, citation: initialProject.citation, headerColor: initialProject.headerColor }; 
      } else { 
          const template = LAYOUT_TEMPLATES[currentLayoutId] || LAYOUT_TEMPLATES['clinical-trial']; 
          let initialSections = template.sections.map(s => ({...s})); // Deep Copy
          let title = template.title; 
          let citation = template.citation; 
          
          if (analyzedData) { 
              title = analyzedData.metadata.title; 
              const author = analyzedData.metadata.authors?.[0] || 'Unknown'; 
              const journal = analyzedData.metadata.journal || 'Journal'; 
              const year = analyzedData.metadata.publishDate ? new Date(analyzedData.metadata.publishDate).getFullYear() : '2024'; 
              citation = `${author} et al. ${journal}. ${year}.`; 
              
              // Smart mapping to ensure all data is inserted
              analyzedData.sections.forEach((apiSection, index) => {
                  if (index < initialSections.length) {
                      initialSections[index] = {
                          ...initialSections[index],
                          title: apiSection.title ? apiSection.title.toUpperCase() : initialSections[index].title,
                          content: apiSection.description,
                          icon: apiSection.recommendedIcons?.[0]?.url || initialSections[index].icon
                      };
                  } else {
                      // Overflow: Append to the last section
                      const lastIndex = initialSections.length - 1;
                      const lastSection = initialSections[lastIndex];
                      const newTitle = apiSection.title ? apiSection.title.toUpperCase() : 'SECTION';
                      const newContent = `\n\n${newTitle}:\n${apiSection.description}`;
                      
                      initialSections[lastIndex] = {
                          ...lastSection,
                          content: lastSection.content + newContent
                      };
                  }
              });
          } 
          return { sections: initialSections, title: title, citation: citation, headerColor: '#C62828' }; 
      } 
  };
  const initialState = initializeState();
  const [sections, setSections] = useState<WorkspaceSection[]>(initialState.sections);
  const [previewSection, setPreviewSection] = useState<WorkspaceSection | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [isIconLibraryOpen, setIsIconLibraryOpen] = useState(false);
  const [isExportImageModalOpen, setIsExportImageModalOpen] = useState(false);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [zoom, setZoom] = useState(0.75);
  const [history, setHistory] = useState<WorkspaceSection[][]>([initialState.sections]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [documentTitle, setDocumentTitle] = useState(initialState.title);
  const [citation, setCitation] = useState(initialState.citation);
  const [headerColor, setHeaderColor] = useState(initialState.headerColor);
  const [sidebarWidth, setSidebarWidth] = useState(350);

  const handleResizeSidebar = (e: React.MouseEvent) => { e.preventDefault(); const startX = e.clientX; const startWidth = sidebarWidth; const onMouseMove = (me: MouseEvent) => { const currentX = me.clientX; const diff = startX - currentX; const newWidth = Math.max(300, Math.min(800, startWidth + diff)); setSidebarWidth(newWidth); }; const onMouseUp = () => { document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); document.body.style.cursor = 'default'; }; document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp); document.body.style.cursor = 'ew-resize'; };
  useEffect(() => { if (!initialProject) { setCurrentLayoutId(layoutId); } }, [layoutId, initialProject]);
  
  useEffect(() => { 
      if (!initialProject) { 
          const template = LAYOUT_TEMPLATES[currentLayoutId] || LAYOUT_TEMPLATES['clinical-trial']; 
          let nextSections = template.sections.map(s => ({...s})); // Deep Copy
          
          if (analyzedData) { 
              setDocumentTitle(analyzedData.metadata.title);
              const author = analyzedData.metadata.authors?.[0] || 'Unknown'; 
              const journal = analyzedData.metadata.journal || 'Journal'; 
              const year = analyzedData.metadata.publishDate ? new Date(analyzedData.metadata.publishDate).getFullYear() : '2024'; 
              setCitation(`${author} et al. ${journal}. ${year}.`);
              
              analyzedData.sections.forEach((apiSection, index) => {
                  if (index < nextSections.length) {
                      nextSections[index] = {
                          ...nextSections[index],
                          title: apiSection.title ? apiSection.title.toUpperCase() : nextSections[index].title,
                          content: apiSection.description,
                          icon: apiSection.recommendedIcons?.[0]?.url || nextSections[index].icon
                      };
                  } else {
                       const lastIndex = nextSections.length - 1;
                       const lastSection = nextSections[lastIndex];
                       const newTitle = apiSection.title ? apiSection.title.toUpperCase() : 'SECTION';
                       const newContent = `\n\n${newTitle}:\n${apiSection.description}`;
                       nextSections[lastIndex] = {
                           ...lastSection,
                           content: lastSection.content + newContent
                       };
                  }
              });
          } else { 
              setDocumentTitle(template.title); 
              setCitation(template.citation); 
          } 
          setSections(nextSections); 
          setPreviewSection(null); 
          setHistory([nextSections]); 
          setHistoryIndex(0); 
          setSelectedSectionId(null); 
      } 
  }, [currentLayoutId, initialProject, analyzedData]);

  const selectedSection = sections.find(s => s.id === selectedSectionId);
  const handleSectionClick = (id: string) => { setPreviewSection(null); setSelectedSectionId(id); };
  const updateSection = (updatedSection: WorkspaceSection) => { const cleanedSection = { ...updatedSection }; if (updatedSection.icon && updatedSection.icon !== sections.find(s=>s.id===updatedSection.id)?.icon) { delete cleanedSection.chartData; } const newSections = sections.map(s => s.id === cleanedSection.id ? { ...s, ...cleanedSection } : s); const newHistory = history.slice(0, historyIndex + 1); newHistory.push(newSections); setHistory(newHistory); setHistoryIndex(newHistory.length - 1); setSections(newSections); setPreviewSection(null); };
  const handleRectUpdate = (id: string, newRect: { x: number; y: number; w: number; h: number }) => { const newSections = sections.map(s => s.id === id ? { ...s, rect: newRect } : s); setSections(newSections); };
  const handlePreviewUpdate = (draftSection: WorkspaceSection) => { setPreviewSection({ ...draftSection }); };
  const updateDocumentMeta = (title: string, cite: string) => { setDocumentTitle(title); setCitation(cite); }
  const handleUndo = () => { if (historyIndex > 0) { setHistoryIndex(historyIndex - 1); setSections(history[historyIndex - 1]); setPreviewSection(null); } };
  const handleRedo = () => { if (historyIndex < history.length - 1) { setHistoryIndex(historyIndex + 1); setSections(history[historyIndex + 1]); setPreviewSection(null); } };
  const handleSaveProjectInternal = () => { const projectData: SavedProject = { id: initialProject ? initialProject.id : crypto.randomUUID(), title: documentTitle, citation: citation, layoutId: currentLayoutId, sections: sections, headerColor: headerColor, lastModified: Date.now() }; onSaveProject(projectData); setShowSaveNotification(true); setTimeout(() => setShowSaveNotification(false), 3000); };

  const renderIcon = (slide: any, section: any, x: number, y: number, w: number, h: number) => {
       if ((section as any).isUrl) {
            slide.addImage({ 
                path: section.icon, 
                x, y, w, h
            });
        } else {
             slide.addText("(Symbol: " + section.icon + ")", {
                 x, y, w, h,
                 align: 'center', valign: 'middle', fontSize: 8, color: '999999'
             });
        }
  }

  const handleExportPPTX = async () => {
    try {
        const pres = new PptxGenJS();
        pres.layout = 'LAYOUT_16x9'; 
        pres.title = documentTitle;
        
        const slide = pres.addSlide();
        slide.background = { color: 'FFFFFF' }; 
        
        const pxToInch = (px: number) => px / 128; 

        slide.addShape('rect', { 
            x: 0, y: 0, w: '100%', h: pxToInch(60), 
            fill: { color: headerColor.replace('#', '') } 
        });
        
        slide.addText("JAMA Cardiology", { 
            x: pxToInch(32), y: 0, w: '50%', h: pxToInch(60), 
            fontSize: 18, bold: true, color: 'FFFFFF', fontFace: 'Arial',
            valign: 'middle'
        });

        const titleAreaY = 60;
        
        slide.addText(documentTitle, { 
            x: pxToInch(32), y: pxToInch(titleAreaY + 15), w: pxToInch(1280 - 64), h: pxToInch(40), 
            fontSize: 14, bold: true, color: '111111', fontFace: 'Arial', valign: 'top',
            shrinkText: true 
        });
        
        slide.addText(citation, { 
            x: pxToInch(32), y: pxToInch(titleAreaY + 55), w: pxToInch(1280 - 64), h: pxToInch(20), 
            fontSize: 10, italic: true, color: '666666', fontFace: 'Arial', valign: 'top' 
        });

        const footerY = 720 - 30;
        slide.addShape('line', {
             x: 0, y: pxToInch(footerY), w: '100%', h: 0,
             line: { color: 'E5E7EB', width: 1 }
        });
        slide.addShape('rect', {
            x: 0, y: pxToInch(footerY), w: '100%', h: pxToInch(30),
            fill: { color: 'F9FAFB' }
        });

        slide.addText("© 2025 JAMA Network", {
            x: pxToInch(32), y: pxToInch(footerY), w: '40%', h: pxToInch(30),
            fontSize: 8, color: '9CA3AF', valign: 'middle'
        });
        slide.addText("Created with NanoAbstract", {
            x: pxToInch(1280 - 32 - 200), y: pxToInch(footerY), w: pxToInch(200), h: pxToInch(30),
            fontSize: 8, color: '9CA3AF', valign: 'middle', align: 'right'
        });

        const canvasStartX = 0; 

        const processedSections = await Promise.all(sections.map(async (section) => {
            if (section.icon && !section.chartData) {
                const isUrl = section.icon.startsWith('http') || section.icon.startsWith('data:');
                if (isUrl) {
                     const pngIcon = await processImageForPPTX(section.icon);
                     return { ...section, icon: pngIcon, isUrl: true };
                } else {
                     return { ...section, isUrl: false };
                }
            }
            return section;
        }));

        processedSections.forEach(section => {
            const { x, y, w, h } = section.rect;
            const pptxX = canvasStartX + pxToInch(x);
            const pptxY = pxToInch(y); 
            const pptxW = pxToInch(w);
            const pptxH = pxToInch(h);

            slide.addShape('rect', { 
                x: pptxX, y: pptxY, w: pptxW, h: pptxH, 
                fill: { color: 'FFFFFF' }, 
                line: { color: 'E0E0E0', width: 1 } 
            });

            const padding = pxToInch(16);
            
            slide.addText(section.title.toUpperCase(), { 
                x: pptxX + padding, 
                y: pptxY + padding, 
                w: pptxW - (padding * 2), 
                h: pxToInch(20), 
                fontSize: 9, 
                bold: true, 
                color: '8B5CF6', 
                fontFace: 'Arial', 
                valign: 'top'
            });

            const currentContentY = pptxY + padding + pxToInch(20); 
            const availableHeight = pptxH - (padding * 2) - pxToInch(20);
            const availableWidth = pptxW - (padding * 2);
            
            const layout = section.layout || 'bottom';
            const isHorizontal = layout === 'left' || layout === 'right';
            
            if (isHorizontal) {
                const halfW = availableWidth / 2;
                if (layout === 'left') {
                    if (section.icon) {
                         const imgSize = Math.min(halfW, availableHeight);
                         const imgX = pptxX + padding + (halfW - imgSize)/2;
                         const imgY = currentContentY + (availableHeight - imgSize)/2;
                         renderIcon(slide, section, imgX, imgY, imgSize, imgSize);
                    }
                    slide.addText(section.content, { 
                        x: pptxX + padding + halfW, y: currentContentY, w: halfW, h: availableHeight, 
                        fontSize: 10, color: '333333', valign: 'top', fontFace: 'Arial', wrap: true, shrinkText: true
                    });
                } else {
                     slide.addText(section.content, { 
                        x: pptxX + padding, y: currentContentY, w: halfW, h: availableHeight, 
                        fontSize: 10, color: '333333', valign: 'top', fontFace: 'Arial', wrap: true, shrinkText: true
                    });
                     if (section.icon) {
                         const imgSize = Math.min(halfW, availableHeight);
                         const imgX = pptxX + padding + halfW + (halfW - imgSize)/2;
                         const imgY = currentContentY + (availableHeight - imgSize)/2;
                         renderIcon(slide, section, imgX, imgY, imgSize, imgSize);
                    }
                }
            } else {
                const isImageFirst = layout === 'top';
                const imgH = availableHeight * 0.4;
                const textH = availableHeight * 0.6;

                if (isImageFirst) {
                    if (section.icon) {
                        const imgSize = Math.min(availableWidth, imgH);
                        const imgX = pptxX + padding + (availableWidth - imgSize)/2;
                        const imgY = currentContentY + (imgH - imgSize)/2;
                        renderIcon(slide, section, imgX, imgY, imgSize, imgSize);
                    }
                    slide.addText(section.content, { 
                        x: pptxX + padding, y: currentContentY + imgH, w: availableWidth, h: textH, 
                        fontSize: 10, color: '333333', valign: 'top', fontFace: 'Arial', wrap: true, shrinkText: true
                    });
                } else {
                    slide.addText(section.content, { 
                        x: pptxX + padding, y: currentContentY, w: availableWidth, h: textH, 
                        fontSize: 10, color: '333333', valign: 'top', fontFace: 'Arial', wrap: true, shrinkText: true
                    });
                    if (section.icon) {
                         const imgSize = Math.min(availableWidth, imgH);
                         const imgX = pptxX + padding + (availableWidth - imgSize)/2;
                         const imgY = currentContentY + textH + (imgH - imgSize)/2;
                         renderIcon(slide, section, imgX, imgY, imgSize, imgSize);
                    }
                }
            }
        });
        
        pres.writeFile({ fileName: `${documentTitle.replace(/[^a-z0-9]/gi, '_')}.pptx` });

    } catch (error) {
        console.error("Export failed", error);
        alert("Failed to generate PPTX.");
    }
  };

  const handleExportImage = async (format: 'png' | 'jpeg', dpi: number) => {
    const element = document.getElementById('workspace-canvas');
    if (!element) return;
    setIsExportImageModalOpen(false);
    try {
        const scale = dpi / 96;
        const canvas = await html2canvas(element, { scale, useCORS: true, allowTaint: true, backgroundColor: '#ffffff' });
        const link = document.createElement('a');
        link.download = `abstract_${dpi}dpi.${format}`;
        link.href = canvas.toDataURL(`image/${format}`, format === 'jpeg' ? 0.9 : 1.0);
        link.click();
    } catch (error) {
        console.error("Image export failed", error);
        alert("Failed to export image.");
    }
  };

  const [iconTab, setIconTab] = useState<'images' | 'symbols'>('images');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && selectedSection) {
          const reader = new FileReader();
          reader.onload = (ev) => {
              const result = ev.target?.result as string;
              handlePreviewUpdate({ ...selectedSection, icon: result });
              updateSection({ ...selectedSection, icon: result });
              setIsIconLibraryOpen(false);
          };
          reader.readAsDataURL(file);
      }
  };

  const scientificSymbols = [
      'science', 'biotech', 'microbiology', 'genetics', 'neurology', 
      'cardiology', 'gastroenterology', 'psychology', 'medical_services', 'vaccines',
      'healing', 'medication', 'pill', 'prescriptions', 'emergency_home',
      'stethoscope', 'monitor_heart', 'ecg_heart', 'blood_pressure', 'skeleton',
      'labs', 'experiment', 'test_tube', 'flask', 'crucible',
      'analytics', 'data_exploration', 'finance', 'monitoring', 'query_stats',
      'pie_chart', 'bar_chart', 'show_chart', 'timeline', 'donut_large',
      'group', 'diversity_3', 'person', 'people', 'public',
      'school', 'menu_book', 'import_contacts', 'article', 'description',
      'check_circle', 'warning', 'info', 'help', 'add_circle',
      'favorite', 'star', 'bolt', 'eco', 'water_drop'
  ];

  const genericImages = [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAKjTxLxRTdliOPw3Yl75kMqrFjVnZBOhp9aURMvWx1pSMjzfcI9LAnV9gTp30U_Ubr91w2VW-KJiFDYKg87zXp5oVUrYe5OLsLjX5z5O6G6U60AcJEP3nAvYIqq00nJSHWTyiJF_qGlsuDI7emDmVOk8rv8zNEOwtRGOTT7TwedWvmHqY3prOepSOUlKeAnVFDnXZWGskK6u10xjMVKYD988ecPzT0T4c7TF1J1pLNoZkS9f3vf0Sc4aSNfcu0bocix7vHWihLjNs',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD-Ag1hFGiMR6JENJgZSxswxspsPdGH-oBMERUQAI-3rvZCbEcTBEm-E2HSxB_hJ3J_JdAKlDSL1LNY6ASNCQWXXQ2iFx529PfkSyrAIpShFWAn7smonV-TpQl221paUOdt27xz3xehMMmgl7sTxBb1u__v4YdruSTU5BosyMqO3v-CJrGX40AJzUCcnAoQYBEjiqvaMxn0EeHSDE0DhyR1BB2kzj8Vq05VFzGQ8YOykRCrNM2NLZmmpZedIWB1Szm6FGWeqkC7O3s',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBjcTY6PVJF39RrwNLNZd5bUXRNg3PNAr80BbuHnoUBr7CRN3uUBj9jtnRvvF70akWKM_RqxrWfZkAHCy9oXRgK_8cJa9y8TuGmTV08s6iz3V1QibrIIxb0HD2vFEkGn54AbI0SVaVG8mkjmK4mdXw_2vCvNhkd5Q_CC_Fo8sHe77P9C-ReyJLF5OAxB-uBDjazULphWicGcaC2tKksN0TJkaxCcd2N7efulaOehVQ7Sn5N4bVxWolSUK6Z40xGXFFiPCrqfzAfK5Y',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCSxZuxn9sVRoKvFtWWLUSpWhprumOw8aTMnyubFDUe9_dmroYZ_RQ3rbSdcMTmfglruk78SpTTB5cHOPxU6MyuUO7eNoti05Ts7i2E6mJL_79_Ot-O1OMYH3Wa3ruVgJkRbc1ise0PnP2JXz4kW1qkYA5nCXcP2Ngg0RHbKo1LqvKK5Cm4CgklZ3DF6V7QUv7D2mMTw30D3p9LhdHf24GOWYW7NZCpCJm1KSbEVbA9NIbsuJdy12PUKyzNe2s7F0xK7g-8pPg389k',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCk6dgZoLCcOOR0elPoU_dNYzQqnno1zIz-IfelWa-37c03T8_8HX_V59IRgH6Osat5196I8A8imcGGHC-0c8U2yr-Q-WaBJPXVy-aCgZJ3nEQN7jHBz5-xApt4cHZ_84uKp4mt1kXWgH5bkSsHBMzdREPFmSOPrvPZxjpn-W4ra1dG05-fpykUqr5pqWzvJt3pHVd2fvpHWPMGrjPhrxmkEwWsZTKS33S-vH2MbQxSjKADjM9fGgRXLhTXj0EhZ6iHMVELqjS9Clo',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuALHxUmRgzoSB_PbL2ZsDjXYGVBf2w6xScl12TCVxC0WcxOoBlyoTrhp5apFnVzsLtsPHgb5Zx_9gatje1vWHP6kdfz71fRja5h85jHfrbWrRz_brM1YGZ7_ja22ly_2408KiwA3-_cFGurjqu6QsZ7ccnUw8G7sXRIW_phAT-Fj5ClOB_cbgmy7O8zHYtPiDwh7gC535OaA7rUv3cPDax9kzHqI3zz9Rl_iNQwHxb8kjbgtOEubHLj0veYFVVoNBGwf3mRdvEoub8',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBbpijqu1Yc7NFPZPxJttyeiuecaXvCcYZbgLy5hoi1LXr22o9SzcpXiXYzbwKUUnZjp-iriGervUhINappOzPxIh4vCSExc8S_ijqIEYwxHT3PUU1rCJb3KKtBSWEphdxilbpZ9mGRPdlHrS3RpBXWm8EIca3iFgesgcsyU7BFw764JLy9zgzqKNTm1hzb2szpM_rA3JgpSHbBgBbeJ9eU-6IWHioTU6FxfNcPOXMiIUrMsTmJE-SO2uIZVglpaWmotJ1VsmXAbhE',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCmUZXJOnGSY5yTPvC4eRVt0SUKfSNNk4tK2zVl1oNU3q63Gtw8N5GRMkC0CqxdiwhnLepar56YMxVakwN1bEKuGhQGtU8XK80smFquCbr22Le5xaEX3lIFfV4CukYjyZ0A6oPIS2lgc1ltamkykRWimLNozFNZYpLj1GhiZxLjkq5rmqWd7BQPGe9cfC3GIsolUK3U-082Parmw7okwnrcWoBwuH3xWmkSdXmjkDL-l2w0CFiZFrXvmSvH5snq7WpR03AD4WOCCO4',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC92txxZA3Z5XnZ78A_ms-oLiIdCAu2bbCy4jjoHVax7XTFnNlz1h7cIYtNnnSXfdEE3OmxGbuw8cM4aOAbf4InvQcOh-JuAZHdDdi-VvCv-EtU5uAYJF_J_-it3Tgf_QEAQzvrPeeb4GgWbTtZQGFiuVU4GaER-j4-qhwbKNgyjWJ5lJiLqVd4-dF-8KazJQVeRSgguZesaVVjTuMWnzyRVTSSYeuRM505Ncp-rglXT8FOvq4NeyfAC3cxdWzUoVZqI4YN2ghjLZE'
  ];

  return (
    <div className="flex flex-col h-screen bg-[#F3F4F6] overflow-hidden font-sans">
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50 shrink-0"><div className="flex items-center gap-4"><button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><span className="material-symbols-outlined">arrow_back</span></button><div className="h-6 w-px bg-gray-300"></div><div className="flex flex-col"><input value={documentTitle} onChange={(e) => updateDocumentMeta(e.target.value, citation)} className="font-bold text-sm text-gray-800 bg-transparent border-none p-0 focus:ring-0" placeholder="Adsız Proje" /><span className="text-[10px] text-gray-400">Son kayıt: Az önce</span></div></div><div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg"><button onClick={handleUndo} disabled={historyIndex <= 0} className="p-1.5 rounded hover:bg-white text-gray-600 disabled:opacity-30"><span className="material-symbols-outlined text-lg">undo</span></button><button onClick={handleRedo} disabled={historyIndex >= history.length - 1} className="p-1.5 rounded hover:bg-white text-gray-600 disabled:opacity-30"><span className="material-symbols-outlined text-lg">redo</span></button><div className="w-px h-4 bg-gray-300 mx-1"></div><button onClick={() => setZoom(Math.max(0.25, zoom - 0.1))} className="p-1.5 rounded hover:bg-white text-gray-600"><span className="material-symbols-outlined text-lg">remove</span></button><span className="text-xs font-medium w-12 text-center">{Math.round(zoom * 100)}%</span><button onClick={() => setZoom(Math.min(2, zoom + 0.1))} className="p-1.5 rounded hover:bg-white text-gray-600"><span className="material-symbols-outlined text-lg">add</span></button></div><div className="flex items-center gap-3"><button onClick={onNew} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-xs font-bold hover:bg-gray-50"><span className="material-symbols-outlined text-lg">add</span>Yeni Oluştur</button><button onClick={() => setIsExportImageModalOpen(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-xs font-bold hover:bg-gray-50"><span className="material-symbols-outlined text-lg">download</span>Dışa Aktar</button><button onClick={handleSaveProjectInternal} className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#8B5CF6] text-white text-xs font-bold hover:bg-[#7C3AED] shadow-sm shadow-purple-200"><span className="material-symbols-outlined text-lg">save</span>Kaydet</button></div></header>
      <div className="flex-1 flex overflow-hidden relative">
          <div className="flex-1 bg-gray-100 overflow-auto flex items-center justify-center p-8 relative">
              <div id="workspace-canvas" className="bg-white shadow-2xl transition-transform origin-center relative" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT, transform: `scale(${zoom})`, flexShrink: 0 }} onClick={() => { setSelectedSectionId(null); setPreviewSection(null); }}>
                  <div className="absolute top-0 left-0 right-0 h-[60px]" style={{ backgroundColor: headerColor }}></div>
                  <div className="absolute top-[60px] left-0 right-0 h-[90px] px-8 flex flex-col justify-center border-b border-gray-100">
                      <h1 className="text-2xl font-black text-gray-900 leading-tight line-clamp-2">{documentTitle || "Başlık"}</h1>
                      <p className="text-sm text-gray-500 italic mt-1">{citation || "Kaynak"}</p>
                  </div>
                  <div className="absolute inset-0 pointer-events-none">
                      {sections.map(section => (<SectionCard key={section.id} section={section} isSelected={selectedSectionId === section.id} onSectionClick={handleSectionClick} onUpdateRect={handleRectUpdate} />))}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-[30px] border-t border-gray-100 flex items-center justify-between px-8 bg-gray-50"><span className="text-[10px] text-gray-400 font-bold tracking-widest">CANVAS AI TARAFINDAN OLUŞTURULDU</span><span className="text-[10px] text-gray-400">Gemini ile güçlendirilmiştir</span></div>
              </div>
          </div>
          <div className="bg-white border-l border-gray-200 flex flex-col z-20 shadow-xl relative" style={{ width: sidebarWidth }}><div className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-purple-200 z-50 transition-colors" onMouseDown={handleResizeSidebar}></div><EditPanel isOpen={true} section={previewSection || selectedSection || null} onClose={() => { setSelectedSectionId(null); setPreviewSection(null); }} onSave={(s) => { updateSection(s); }} onPreviewUpdate={handlePreviewUpdate} onOpenIconLibrary={() => setIsIconLibraryOpen(true)} documentSettings={{ title: documentTitle, citation: citation, headerColor: headerColor, currentLayoutId: currentLayoutId, onUpdate: updateDocumentMeta, onColorChange: setHeaderColor, onLayoutChange: (id) => setCurrentLayoutId(id) }} /></div>
      </div>
      {isIconLibraryOpen && (<div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"><div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-fade-in-up"><div className="p-4 border-b border-gray-100 flex justify-between items-center"><h3 className="font-bold text-lg">Simge veya Resim Seçin</h3><button onClick={() => setIsIconLibraryOpen(false)}><span className="material-symbols-outlined">close</span></button></div><div className="flex border-b border-gray-100"><button onClick={() => setIconTab('images')} className={`flex-1 py-3 text-sm font-bold ${iconTab === 'images' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}>Önerilen Görseller</button><button onClick={() => setIconTab('symbols')} className={`flex-1 py-3 text-sm font-bold ${iconTab === 'symbols' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}>Bilimsel Simgeler</button></div><div className="flex-1 overflow-y-auto p-4 bg-gray-50">{iconTab === 'images' ? (<div className="grid grid-cols-3 gap-3"><div className="aspect-square bg-white border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 group transition-all" onClick={() => fileInputRef.current?.click()}><span className="material-symbols-outlined text-gray-400 group-hover:text-purple-500 text-3xl">upload_file</span><span className="text-xs font-bold text-gray-500 mt-2">Kendi Dosyanı Yükle</span><input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleIconUpload} /></div>{genericImages.map((src, i) => (<div key={i} className="aspect-square bg-white border border-gray-200 rounded-lg cursor-pointer hover:ring-2 hover:ring-purple-500 overflow-hidden" onClick={() => { if(selectedSection) { const updated = { ...selectedSection, icon: src }; updateSection(updated); setIsIconLibraryOpen(false); } }}><img src={src} className="w-full h-full object-cover" alt="suggestion" /></div>))}</div>) : (<div className="grid grid-cols-6 gap-3">{scientificSymbols.map((sym, i) => (<div key={i} className="aspect-square bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-purple-50 hover:text-purple-600 flex items-center justify-center text-gray-600 transition-colors" onClick={() => { if(selectedSection) { const updated = { ...selectedSection, icon: sym }; updateSection(updated); setIsIconLibraryOpen(false); } }}><span className="material-symbols-outlined text-3xl">{sym}</span></div>))}</div>)}</div></div></div>)}
      {isExportImageModalOpen && (<div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"><div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl animate-fade-in-up"><h3 className="font-bold text-lg mb-4 text-center">Grafiksel Özeti Dışa Aktar</h3><div className="flex flex-col gap-3"><button onClick={() => handleExportImage('png', 96)} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"><span className="font-bold text-sm">Web Kalitesi (PNG)</span><span className="text-xs bg-gray-100 px-2 py-1 rounded">72 DPI</span></button><button onClick={() => handleExportImage('png', 300)} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"><span className="font-bold text-sm">Baskı Kalitesi (Yüksek Çözünürlüklü PNG)</span><span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">300 DPI</span></button><button onClick={handleExportPPTX} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 border-orange-200 bg-orange-50"><span className="font-bold text-sm text-orange-800">PowerPoint (Düzenlenebilir)</span><span className="text-xs bg-white text-orange-600 border border-orange-200 px-2 py-1 rounded">PPTX</span></button></div><button onClick={() => setIsExportImageModalOpen(false)} className="w-full mt-4 py-2 text-gray-500 font-bold text-sm hover:bg-gray-100 rounded-lg">İptal</button></div></div>)}
      {showSaveNotification && (<div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full shadow-lg z-[60] flex items-center gap-2 animate-fade-in-up"><span className="material-symbols-outlined text-green-400 text-sm">check_circle</span><span className="text-sm font-bold">Proje başarıyla kaydedildi</span></div>)}
    </div>
  );
};

export default Workspace;