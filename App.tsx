import React, { useState, useEffect } from 'react';
import StepStart from './components/StepStart';
import StepUpload from './components/StepUpload';
import StepAnalysis from './components/StepAnalysis';
import StepLayout from './components/StepLayout';
import Workspace from './components/Workspace';
import { Step, LayoutOption, SavedProject, ExtractedData } from './types';
import { LAYOUT_OPTIONS } from './constants';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [selectedLayout, setSelectedLayout] = useState<LayoutOption | undefined>();
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [currentProject, setCurrentProject] = useState<SavedProject | null>(null);
  
  // New state for API integration
  const [targetUrl, setTargetUrl] = useState<string | null>(null);
  const [analyzedData, setAnalyzedData] = useState<ExtractedData | undefined>();

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem('canvas_projects');
    if (stored) {
        try {
            setSavedProjects(JSON.parse(stored));
        } catch (e) {
            console.error("Failed to load projects", e);
        }
    }
  }, []);

  const handleSaveProject = (projectData: SavedProject) => {
    setSavedProjects(prev => {
        // Update existing or add new
        const exists = prev.find(p => p.id === projectData.id);
        let newProjects;
        if (exists) {
            newProjects = prev.map(p => p.id === projectData.id ? projectData : p);
        } else {
            newProjects = [projectData, ...prev];
        }
        // Persist
        localStorage.setItem('canvas_projects', JSON.stringify(newProjects));
        return newProjects;
    });
    // Update current project reference so subsequent saves don't create duplicates if ID was generated
    setCurrentProject(projectData);
  };

  const handleOpenProject = (project: SavedProject) => {
    setCurrentProject(project);
    // Find layout option for metadata if needed, though workspace uses saved data primarily
    setSelectedLayout(LAYOUT_OPTIONS.find(l => l.id === project.layoutId)); 
    setCurrentStep('workspace');
  };
  
  const getStepNumber = () => {
    switch(currentStep) {
        case 'start': return 0;
        case 'upload': return 0;
        case 'analysis': return 0; // Transitioning 0 -> 1
        case 'layout': return 1;
        case 'workspace': return 2;
        default: return 2;
    }
  }

  // Navigation Handlers
  const goToLayout = () => {
      setCurrentProject(null); // Clear current project when starting fresh
      setCurrentStep('layout');
  };
  
  const goToWorkspace = (layout: LayoutOption) => {
    setSelectedLayout(layout);
    setCurrentStep('workspace');
  };
  
  const handleStartChoice = (choice: 'template' | 'upload') => {
      if (choice === 'template') {
          goToLayout();
      } else {
          setCurrentStep('upload');
      }
  };

  const handleUrlSubmit = (url: string) => {
      setTargetUrl(url);
      setCurrentStep('analysis');
  };

  const handleAnalysisComplete = (data?: ExtractedData) => {
      if (data) {
          setAnalyzedData(data);
      }
      setCurrentStep('layout');
  };

  const goBack = () => {
    if (currentStep === 'layout') setCurrentStep('upload'); // Back to upload (main screen)
    if (currentStep === 'upload') setCurrentStep('start'); // Fallback to old start screen if needed
    if (currentStep === 'analysis') setCurrentStep('upload');
    // From workspace, go back to layout selection if new, or upload if saved project
    if (currentStep === 'workspace') {
        if (currentProject) {
            setCurrentStep('upload');
            setCurrentProject(null);
        } else {
            setCurrentStep('layout'); 
        }
    }
  };

  // Direct Navigation Handler for Progress Bar
  const handleStepClick = (stepId: number) => {
      const currentStepIndex = getStepNumber();
      
      // Prevent jumping forward to unvisited steps
      // Allow jumping back or staying on current
      if (stepId > currentStepIndex) return;

      // Map step IDs to step names
      switch(stepId) {
          case 0: setCurrentStep('upload'); break;
          case 1: setCurrentStep('layout'); break;
          case 2: setCurrentStep('workspace'); break;
      }
  };

  // Stepper Configuration
  const steps = [
    { label: 'YÜKLEME', id: 0 },
    { label: 'ŞABLON', id: 1 },
    { label: 'CANVAS', id: 2 },
  ];

  const currentStepIndex = getStepNumber();
  const isAnalysis = currentStep === 'analysis';
  
  // Calculate progress percentage
  // Analysis mode simulates being "between" step 0 and 1
  const progressPercentage = isAnalysis 
      ? 20 // Move slightly forward during analysis
      : (currentStepIndex / (steps.length - 1)) * 100;

  // Full Screen Workspace View
  if (currentStep === 'workspace') {
      return (
          <div className="h-screen w-screen bg-background-light flex flex-col">
              <Workspace 
                initialImage={selectedLayout?.image}
                layoutId={selectedLayout?.id}
                initialProject={currentProject}
                analyzedData={analyzedData}
                onSaveProject={handleSaveProject}
                onBack={goBack}
                onNew={() => {
                    setCurrentProject(null);
                    setAnalyzedData(undefined);
                    setCurrentStep('upload');
                }}
              />
          </div>
      );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col text-neutral-text-dark font-display">
      
      {/* Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-40 w-full px-6 py-2">
        <div className="mx-auto max-w-6xl px-6 py-2">
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div 
                    className="size-8 text-[#8B5CF6] cursor-pointer hover:scale-105 transition-transform" 
                    onClick={() => setCurrentStep('upload')}
                >
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
                    <path clipRule="evenodd" d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z" fill="currentColor" fillRule="evenodd"></path>
                </svg>
                </div>
                <h2 className="text-lg font-black tracking-tight text-neutral-text-dark">CANVAS</h2>
            </div>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pb-8 pt-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6">
          
          {/* Progress Bar (Pill Design) */}
          {currentStep !== 'start' && (
            <div className="mx-auto w-full max-w-3xl mb-6">
              <div className="bg-white rounded-full shadow-lg shadow-gray-200/50 h-20  relative flex items-center px-12 border border-neutral-100">
                
                {/* Track Line (Thin) */}
                <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-0.5 bg-gray-100 z-0 rounded-full"></div>
                
                {/* Active Line (Thin) */}
                <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-0.5 z-0">
                     <div 
                        className="relative h-full bg-[#8B5CF6] transition-all duration-700 ease-spring rounded-full" 
                        style={{ width: `${progressPercentage}%` }}
                     >
                        {/* Floating Ball for analysis/motion */}
                        {isAnalysis && (
                           <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 size-2 bg-[#8B5CF6] rounded-full shadow-sm animate-pulse"></div>
                        )}
                     </div>
                </div>

                {/* Steps */}
                <div className="relative z-10 flex justify-between w-full pointer-events-none">
                    {steps.map((step, index) => {
                        const isPast = index < currentStepIndex;
                        const isCurrent = index === currentStepIndex && !isAnalysis;
                        const isFuture = index > currentStepIndex;

                        return (
                            <div 
                                key={step.id} 
                                onClick={() => handleStepClick(step.id)}
                                className={`relative flex flex-col items-center justify-center pointer-events-auto ${isFuture ? 'cursor-not-allowed' : 'cursor-pointer group'}`}
                            >
                                 {/* Dot */}
                                 <div className={`
                                     relative z-10 size-3 rounded-full border-[2.5px] transition-all duration-300 bg-white
                                     ${isPast ? 'border-[#8B5CF6] bg-[#8B5CF6]' : ''} 
                                     ${isCurrent ? 'border-[#8B5CF6] bg-white ring-4 ring-[#8B5CF6]/10 scale-125' : ''}
                                     ${isFuture ? 'border-gray-200 bg-white' : ''}
                                 `}></div>
                                 
                                 {/* Label */}
                                 <span className={`
                                     absolute top-6
                                     text-[10px] font-bold tracking-widest uppercase transition-colors whitespace-nowrap
                                     ${(isPast || isCurrent) ? 'text-[#8B5CF6]' : 'text-gray-300'}
                                     ${isFuture ? 'opacity-60' : 'group-hover:text-[#8B5CF6]'}
                                 `}>
                                     {step.label}
                                 </span>
                            </div>
                        )
                    })}
                </div>
              </div>
            </div>
          )}

          {/* Steps Container */}
          <div className="transition-all duration-500 ease-in-out pt-1">
            {currentStep === 'start' && (
                <StepStart onNext={handleStartChoice} />
            )}
            {currentStep === 'upload' && (
                <StepUpload 
                    onNext={() => setCurrentStep('analysis')} 
                    onUrlSubmit={handleUrlSubmit}
                    onBack={goBack} 
                    onTemplateSelect={goToLayout}
                    projects={savedProjects}
                    onSelectProject={handleOpenProject}
                />
            )}
            {currentStep === 'analysis' && (
                <StepAnalysis 
                    url={targetUrl}
                    onComplete={handleAnalysisComplete} 
                />
            )}
            {currentStep === 'layout' && (
                <StepLayout 
                    onSelect={goToWorkspace} 
                    onBack={goBack} 
                    selectedLayoutId={selectedLayout?.id}
                />
            )}
          </div>
        </div>
      </main>

      {/* Footer (Static for non-workspace pages) */}
      <footer className="fixed bottom-0 left-0 z-0 w-full">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-border to-transparent"></div>
      </footer>
    </div>
  );
};

export default App;