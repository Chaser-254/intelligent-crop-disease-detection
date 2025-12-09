import React, { useState, createElement } from 'react';
import { AlertTriangle, ArrowRight, Camera, Download, Share2, Wifi, WifiOff, Search, ExternalLink, X, Loader } from 'lucide-react';
import { Disease } from '../data/mockDiseases';
interface DiagnosisResultsProps {
  diagnosis: Disease | null;
  capturedImage: string | null;
  onViewTreatments: () => void;
  isOfflineMode?: boolean;
}
interface OnlineResearchResult {
  source: string;
  title: string;
  summary: string;
  url: string;
  relevance: number;
}
export function DiagnosisResults({
  diagnosis,
  capturedImage,
  onViewTreatments,
  isOfflineMode = true
}: DiagnosisResultsProps) {
  const [showResearchModal, setShowResearchModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [researchResults, setResearchResults] = useState<OnlineResearchResult[]>([]);
  if (!diagnosis) {
    return <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
        <Camera className="w-16 h-16 text-gray-300" />
        <div>
          <h3 className="text-xl font-bold text-gray-400 mb-2">
            No Diagnosis Yet
          </h3>
          <p className="text-sm text-gray-500 font-mono">
            Scan a plant to see results
          </p>
        </div>
      </div>;
  }
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'bg-red-100 border-red-200 text-red-800';
      case 'Medium':
        return 'bg-orange-100 border-orange-200 text-orange-800';
      case 'Low':
        return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };
  const searchOnlineDatabase = () => {
    setShowResearchModal(true);
    setIsSearching(true);
    // Simulate web scraping/API call delay
    setTimeout(() => {
      // Mock research results based on disease
      const mockResults: OnlineResearchResult[] = [{
        source: 'FAO Agricultural Database',
        title: `${diagnosis.name} Management Guidelines`,
        summary: 'Comprehensive guidelines for integrated pest management including biological control methods, chemical interventions, and preventive measures.',
        url: 'https://fao.org/agriculture/pest-management',
        relevance: 98
      }, {
        source: 'CABI Crop Protection',
        title: `${diagnosis.name} in ${diagnosis.crop}`,
        summary: 'Detailed lifecycle information, economic impact assessment, and region-specific treatment recommendations with efficacy data.',
        url: 'https://cabi.org/crop-protection',
        relevance: 95
      }, {
        source: 'Agricultural Research Journal',
        title: 'Recent Studies on Resistant Varieties',
        summary: 'Latest research on disease-resistant crop varieties, genetic markers, and breeding programs for sustainable management.',
        url: 'https://agresearch.org/studies',
        relevance: 87
      }, {
        source: 'Local Extension Services',
        title: 'Taita Taveta Treatment Protocols',
        summary: 'Region-specific protocols adapted for local climate conditions, available pesticides, and farmer training resources.',
        url: 'https://extension.ke/protocols',
        relevance: 92
      }];
      setResearchResults(mockResults);
      setIsSearching(false);
    }, 2000);
  };
  const exportReport = () => {
    const report = `
CROP DISEASE DIAGNOSIS REPORT
==============================

Disease ID: ${diagnosis.id}
Disease Name: ${diagnosis.name}
Crop Type: ${diagnosis.crop}
Confidence: ${diagnosis.confidence}%
Severity: ${diagnosis.severity}
Analysis Mode: ${isOfflineMode ? 'Offline (Local AI)' : 'Online (Cloud AI)'}

DESCRIPTION:
${diagnosis.description}

KEY SYMPTOMS:
${diagnosis.symptoms.map((s, i) => `${i + 1}. ${s}`).join('\n')}

RECOMMENDED TREATMENTS:
${diagnosis.treatments.map((t, i) => `
${i + 1}. ${t.name} (${t.type})
   Effectiveness: ${t.effectiveness}
   Cost: KES ${t.costPerAcre}/acre
   Application: ${t.application}
   Instructions: ${t.instructions}
`).join('\n')}

${researchResults.length > 0 ? `
ONLINE RESEARCH SOURCES:
${researchResults.map((r, i) => `${i + 1}. ${r.title} - ${r.source}`).join('\n')}
` : ''}

Generated: ${new Date().toLocaleString()}
    `.trim();
    const blob = new Blob([report], {
      type: 'text/plain'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagnosis-${diagnosis.id}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const shareReport = async () => {
    const text = `Crop Disease Detected: ${diagnosis.name}\nSeverity: ${diagnosis.severity}\nConfidence: ${diagnosis.confidence}%\n\nView full diagnosis report for treatment options.`;
    if (navigator.share) {
      try {
        await navigator.share({
          text
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Report summary copied to clipboard!');
    }
  };
  return <div className="space-y-8">
      {/* Research Modal */}
      {showResearchModal && <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white border-2 border-[#1f2933] max-w-2xl w-full p-6 space-y-6 my-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-[#1f2933]">
                  Online Research
                </h3>
                <p className="font-mono text-sm text-gray-500 mt-1">
                  {diagnosis.name} • {diagnosis.crop}
                </p>
              </div>
              <button onClick={() => setShowResearchModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            {isSearching ? <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Loader className="w-12 h-12 text-gray-400 animate-spin" />
                <div className="text-center">
                  <p className="font-bold text-lg text-[#1f2933]">
                    Searching Online Databases
                  </p>
                  <p className="font-mono text-sm text-gray-500 mt-1">
                    Querying agricultural research sources...
                  </p>
                </div>
              </div> : <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 p-3">
                  <p className="font-mono text-xs text-green-800">
                    <strong>
                      Found {researchResults.length} relevant sources
                    </strong>{' '}
                    from agricultural databases and research journals
                  </p>
                </div>

                {researchResults.map((result, idx) => <div key={idx} className="border-2 border-gray-300 p-4 space-y-3 hover:border-gray-400 transition-colors">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-gray-500 uppercase">
                            {result.source}
                          </span>
                          <span className="px-2 py-0.5 bg-gray-100 border border-gray-300 font-mono text-xs">
                            {result.relevance}% match
                          </span>
                        </div>
                        <h4 className="font-bold text-lg text-[#1f2933]">
                          {result.title}
                        </h4>
                      </div>
                      <ExternalLink className="w-5 h-5 text-gray-400 shrink-0" />
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed">
                      {result.summary}
                    </p>

                    <div className="pt-2 border-t border-gray-200">
                      <a href={result.url} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-gray-500 hover:text-[#1f2933] underline decoration-dashed">
                        {result.url}
                      </a>
                    </div>
                  </div>)}

                <div className="bg-gray-50 border border-dashed border-gray-300 p-4">
                  <p className="font-mono text-xs text-gray-600">
                    <strong>Note:</strong> Results are aggregated from FAO,
                    CABI, agricultural research databases, and local extension
                    services. Always verify recommendations with local
                    agricultural officers.
                  </p>
                </div>
              </div>}

            <div className="flex gap-2">
              <button onClick={() => setShowResearchModal(false)} className="flex-1 py-3 border border-gray-400 bg-white hover:bg-gray-50 font-mono text-sm uppercase">
                Close
              </button>
            </div>
          </div>
        </div>}

      {/* Mode Indicator */}
      <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 bg-white rounded">
        {isOfflineMode ? <>
            <WifiOff className="w-4 h-4 text-gray-500" />
            <span className="font-mono text-xs text-gray-600">
              Analyzed offline using local AI
            </span>
          </> : <>
            <Wifi className="w-4 h-4 text-green-600" />
            <span className="font-mono text-xs text-green-700">
              Analyzed online using cloud AI
            </span>
          </>}
      </div>

      {/* Header */}
      <div className="space-y-2 border-b-2 border-dashed border-gray-300 pb-6">
        <div className="flex items-center gap-2 text-[#9ca3af] font-mono text-sm uppercase mb-2">
          <span>ID #{diagnosis.id}</span>
          <span>•</span>
          <span>{diagnosis.crop} Crop</span>
        </div>
        <h1 className="text-4xl font-bold text-[#1f2933] leading-tight">
          {diagnosis.name}
        </h1>
        <div className="flex items-center gap-4 mt-4 flex-wrap">
          <div className="px-4 py-2 border-2 border-[#1f2933] inline-block">
            <span className="font-mono font-bold text-lg">
              {diagnosis.confidence}% MATCH
            </span>
          </div>
          <div className={`px-3 py-1 border text-xs font-mono uppercase rounded-full ${getSeverityColor(diagnosis.severity)}`}>
            {diagnosis.severity} Severity
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        {!isOfflineMode && <button onClick={searchOnlineDatabase} className="flex-1 flex items-center justify-center gap-2 py-2 border-2 border-green-600 bg-green-50 hover:bg-green-100 font-mono text-xs uppercase text-green-800">
            <Search className="w-4 h-4" />
            Search Online
          </button>}
        <button onClick={exportReport} className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-400 bg-white hover:bg-gray-50 font-mono text-xs uppercase">
          <Download className="w-4 h-4" />
          Export
        </button>
        <button onClick={shareReport} className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-400 bg-white hover:bg-gray-50 font-mono text-xs uppercase">
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>

      {/* Image Preview */}
      <div className="h-48 w-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center relative overflow-hidden">
        {capturedImage ? <img src={capturedImage} alt="Captured plant" className="w-full h-full object-cover" /> : <span className="font-mono text-gray-500">[CAPTURED PHOTO]</span>}
        <div className="absolute bottom-2 right-2 bg-white px-2 py-1 text-xs font-mono border border-gray-300">
          Source: Camera
        </div>
      </div>

      {/* Confidence Breakdown */}
      <div className="space-y-3">
        <h3 className="font-mono text-sm text-gray-500 uppercase tracking-wider">
          Confidence Analysis
        </h3>
        <div className="bg-white border border-gray-200 p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-mono text-xs">Primary Match</span>
            <span className="font-bold">{diagnosis.confidence}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#1f2933]" style={{
            width: `${diagnosis.confidence}%`
          }} />
          </div>
          <div className="pt-2 border-t border-gray-200 text-xs font-mono text-gray-500">
            Analysis based on leaf pattern, color, and symptom distribution
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-3">
        <h3 className="font-mono text-sm text-gray-500 uppercase tracking-wider">
          Description
        </h3>
        <p className="font-mono text-sm leading-relaxed text-[#1f2933] bg-white p-4 border border-gray-200">
          {diagnosis.description}
        </p>
      </div>

      {/* Key Symptoms */}
      <div className="space-y-3">
        <h3 className="font-mono text-sm text-gray-500 uppercase tracking-wider">
          Key Symptoms
        </h3>
        <ul className="space-y-2">
          {diagnosis.symptoms.map((symptom, i) => <li key={i} className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-gray-400 shrink-0" />
              <span className="text-[#1f2933]">{symptom}</span>
            </li>)}
        </ul>
      </div>

      {/* Action */}
      <div className="pt-4">
        <button onClick={onViewTreatments} className="w-full py-4 border-2 border-[#1f2933] bg-white hover:bg-[#1f2933] hover:text-white transition-colors flex items-center justify-between px-6 group">
          <span className="font-bold uppercase tracking-wider">
            View Treatments
          </span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>;
}