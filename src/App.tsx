import React, { useState } from 'react';
import { WireframeLayout } from './components/WireframeLayout';
import { CameraCapture } from './pages/CameraCapture';
import { DiagnosisResults } from './pages/DiagnosisResults';
import { TreatmentOptions } from './pages/TreatmentOptions';
import { FollowUpMonitor } from './pages/FollowUpMonitor';
import { Disease, getRandomDisease } from './data/mockDiseases';
type Page = 'camera' | 'results' | 'treatments' | 'monitor';
export interface ScheduledTreatment {
  treatmentId: string;
  treatmentName: string;
  startDate: Date;
  frequency: string;
  nextApplicationDate: Date;
}
export function App() {
  const [currentPage, setCurrentPage] = useState<Page>('camera');
  const [currentDiagnosis, setCurrentDiagnosis] = useState<Disease | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(true);
  const [scheduledTreatments, setScheduledTreatments] = useState<ScheduledTreatment[]>([]);
  const toggleOfflineMode = () => {
    setIsOfflineMode(!isOfflineMode);
  };
  const handleScheduleTreatment = (treatment: ScheduledTreatment) => {
    setScheduledTreatments([...scheduledTreatments, treatment]);
  };
  const handleCapture = (imageData: string) => {
    setCapturedImage(imageData);
    setIsAnalyzing(true);
    // Simulate AI analysis delay (longer in offline mode)
    const delay = isOfflineMode ? 1500 : 2500;
    setTimeout(() => {
      const diagnosis = getRandomDisease();
      setCurrentDiagnosis(diagnosis);
      setIsAnalyzing(false);
      setCurrentPage('results');
    }, delay);
  };
  const renderPage = () => {
    if (isAnalyzing) {
      return <div className="flex flex-col items-center justify-center h-full gap-6">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-[#1f2933] rounded-full animate-spin" />
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#1f2933] mb-2">
              Analyzing Image
            </h2>
            <p className="font-mono text-sm text-[#9ca3af]">
              {isOfflineMode ? 'Local AI processing...' : 'Cloud AI processing...'}
            </p>
          </div>
        </div>;
    }
    switch (currentPage) {
      case 'camera':
        return <CameraCapture onCapture={handleCapture} isOfflineMode={isOfflineMode} onToggleOfflineMode={toggleOfflineMode} />;
      case 'results':
        return <DiagnosisResults diagnosis={currentDiagnosis} capturedImage={capturedImage} onViewTreatments={() => setCurrentPage('treatments')} isOfflineMode={isOfflineMode} />;
      case 'treatments':
        return currentDiagnosis ? <TreatmentOptions diagnosis={currentDiagnosis} isOfflineMode={isOfflineMode} onScheduleTreatment={handleScheduleTreatment} /> : <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div className="text-xl font-bold text-gray-400 mb-2">
              No Diagnosis Available
            </div>
            <p className="text-sm text-gray-500 font-mono">
              Scan a plant first to see treatments
            </p>
          </div>;
      case 'monitor':
        return <FollowUpMonitor diagnosis={currentDiagnosis} isOfflineMode={isOfflineMode} scheduledTreatments={scheduledTreatments} />;
      default:
        return <CameraCapture onCapture={handleCapture} isOfflineMode={isOfflineMode} onToggleOfflineMode={toggleOfflineMode} />;
    }
  };
  const getTitle = () => {
    switch (currentPage) {
      case 'camera':
        return 'Scan Crop';
      case 'results':
        return 'Diagnosis';
      case 'treatments':
        return 'Treatments';
      case 'monitor':
        return 'Monitor';
      default:
        return 'CropDoctor';
    }
  };
  return <WireframeLayout currentPage={currentPage} onNavigate={setCurrentPage} title={getTitle()}>
      {renderPage()}
    </WireframeLayout>;
}