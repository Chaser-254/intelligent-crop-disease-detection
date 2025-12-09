import React, { useState, useRef } from 'react';
import { Calendar, Upload, Phone, CheckCircle, Circle, ArrowLeftRight, Wifi, WifiOff, Clock } from 'lucide-react';
import { Disease } from '../data/mockDiseases';
import { ScheduledTreatment } from '../App';
interface FollowUpMonitorProps {
  diagnosis: Disease | null;
  isOfflineMode?: boolean;
  scheduledTreatments?: ScheduledTreatment[];
}
export function FollowUpMonitor({
  diagnosis,
  isOfflineMode = true,
  scheduledTreatments = []
}: FollowUpMonitorProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImages([...uploadedImages, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };
  if (!diagnosis) {
    return <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
        <Circle className="w-16 h-16 text-gray-300" />
        <div>
          <h3 className="text-xl font-bold text-gray-400 mb-2">
            No Active Treatment
          </h3>
          <p className="text-sm text-gray-500 font-mono">
            Scan a plant to start monitoring
          </p>
        </div>
      </div>;
  }
  const latestImage = uploadedImages[uploadedImages.length - 1];
  const firstImage = uploadedImages[0];
  return <div className="space-y-8">
      {/* Mode Indicator */}
      <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 bg-white rounded">
        {isOfflineMode ? <>
            <WifiOff className="w-4 h-4 text-gray-500" />
            <span className="font-mono text-xs text-gray-600">
              Offline mode - Photos stored locally
            </span>
          </> : <>
            <Wifi className="w-4 h-4 text-green-600" />
            <span className="font-mono text-xs text-green-700">
              Online mode - Photos synced to cloud
            </span>
          </>}
      </div>

      <div className="flex justify-between items-end border-b border-gray-300 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-[#1f2933]">Monitor</h2>
          <p className="font-mono text-sm text-[#9ca3af]">
            Plot A • {diagnosis.crop}
          </p>
        </div>
        <div className="text-right">
          <span className="block text-xs font-mono text-gray-500 uppercase">
            Status
          </span>
          <span className="font-bold text-green-600">Recovering</span>
        </div>
      </div>

      {/* Scheduled Treatments */}
      {scheduledTreatments.length > 0 && <div className="space-y-3">
          <h3 className="font-mono text-sm text-gray-500 uppercase tracking-wider">
            Scheduled Treatments
          </h3>
          <div className="space-y-2">
            {scheduledTreatments.map((scheduled, idx) => <div key={idx} className="bg-white border-2 border-gray-300 p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-lg">
                      {scheduled.treatmentName}
                    </h4>
                    <p className="font-mono text-xs text-gray-500">
                      Started: {scheduled.startDate.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="block font-mono text-xs text-gray-500">
                      Next Application
                    </span>
                    <span className="font-bold text-[#1f2933]">
                      {scheduled.nextApplicationDate.toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 pt-2 border-t border-gray-200">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono text-xs">
                    Frequency: {scheduled.frequency}
                  </span>
                </div>
              </div>)}
          </div>
        </div>}

      {/* Before/After Comparison */}
      {uploadedImages.length > 1 && <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-mono text-sm text-gray-500 uppercase tracking-wider">
              Progress Photos
            </h3>
            <button onClick={() => setShowComparison(!showComparison)} className="flex items-center gap-2 px-3 py-1 border border-gray-400 bg-white hover:bg-gray-50 font-mono text-xs uppercase">
              <ArrowLeftRight className="w-4 h-4" />
              {showComparison ? 'List View' : 'Compare'}
            </button>
          </div>

          {showComparison ? <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-48 border-2 border-gray-300 overflow-hidden">
                  <img src={firstImage} alt="Before treatment" className="w-full h-full object-cover" />
                </div>
                <div className="text-center">
                  <span className="font-mono text-xs text-gray-500 uppercase">
                    Before Treatment
                  </span>
                  <div className="text-xs text-gray-400">Day 1</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-48 border-2 border-green-600 overflow-hidden">
                  <img src={latestImage} alt="After treatment" className="w-full h-full object-cover" />
                </div>
                <div className="text-center">
                  <span className="font-mono text-xs text-green-600 uppercase font-bold">
                    Latest Progress
                  </span>
                  <div className="text-xs text-gray-400">
                    Day {uploadedImages.length}
                  </div>
                </div>
              </div>
            </div> : <div className="grid grid-cols-3 gap-2">
              {uploadedImages.map((img, idx) => <div key={idx} className="relative">
                  <div className="h-24 border border-gray-300 overflow-hidden">
                    <img src={img} alt={`Progress ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute bottom-1 right-1 bg-white/90 px-1 text-[10px] font-mono border border-gray-300">
                    Day {idx + 1}
                  </div>
                </div>)}
            </div>}
        </div>}

      {/* Next Checkup Card */}
      <div className="bg-[#1f2933] text-white p-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-gray-400 font-mono text-xs uppercase mb-2">
            <Calendar className="w-4 h-4" />
            <span>Next Check-up</span>
          </div>
          <h3 className="text-3xl font-bold mb-1">
            {new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
          })}
          </h3>
          <p className="text-gray-400 text-sm">2 days remaining</p>
        </div>
        <div className="absolute right-[-20px] bottom-[-20px] w-32 h-32 border-4 border-dashed border-gray-700 rounded-full opacity-50" />
      </div>

      {/* Timeline */}
      <div className="space-y-6 relative pl-4">
        <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-300" />

        {/* Item 1 - Completed */}
        <div className="relative flex gap-6">
          <div className="w-10 h-10 rounded-full bg-white border-2 border-green-600 flex items-center justify-center shrink-0 z-10">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div className="pt-1 pb-6">
            <span className="font-mono text-xs text-gray-500">
              {new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })}{' '}
              • Completed
            </span>
            <h4 className="font-bold text-lg">Initial Treatment</h4>
            <p className="text-sm text-gray-600 mt-1">
              Applied {diagnosis.treatments[0]?.name || 'Treatment'}
            </p>
          </div>
        </div>

        {/* Item 2 - Current (with upload) */}
        <div className="relative flex gap-6">
          <div className="w-10 h-10 rounded-full bg-[#1f2933] flex items-center justify-center shrink-0 z-10 ring-4 ring-gray-200">
            <span className="font-mono text-white font-bold text-xs">NOW</span>
          </div>
          <div className="pt-1 pb-6 flex-1">
            <span className="font-mono text-xs text-[#1f2933] font-bold">
              Day {uploadedImages.length + 1} of 14
            </span>
            <h4 className="font-bold text-lg">Monitoring Phase</h4>
            <p className="text-sm text-gray-600 mt-1">
              Watch for new symptoms.
            </p>

            {latestImage ? <div className="mt-4 space-y-2">
                <div className="h-32 w-full border-2 border-green-600 rounded overflow-hidden">
                  <img src={latestImage} alt="Progress" className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-mono">
                    {uploadedImages.length} photo(s) uploaded
                  </span>
                </div>
              </div> : null}

            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="mt-4 flex items-center gap-2 px-4 py-2 border border-dashed border-gray-400 bg-white hover:bg-gray-50 w-full justify-center transition-colors">
              <Upload className="w-4 h-4 text-gray-500" />
              <span className="font-mono text-xs uppercase">
                {latestImage ? 'Upload Another Photo' : 'Upload Progress Photo'}
              </span>
            </button>
          </div>
        </div>

        {/* Item 3 - Upcoming */}
        <div className="relative flex gap-6 opacity-50">
          <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center shrink-0 z-10">
            <Circle className="w-6 h-6 text-gray-300" />
          </div>
          <div className="pt-1">
            <span className="font-mono text-xs text-gray-500">
              {new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })}{' '}
              • Upcoming
            </span>
            <h4 className="font-bold text-lg">Second Application</h4>
            <p className="text-sm text-gray-600 mt-1">
              Scheduled if symptoms persist.
            </p>
          </div>
        </div>
      </div>

      {/* Support Link */}
      <div className="pt-4 border-t border-gray-200">
        <button className="w-full flex items-center justify-center gap-3 text-gray-600 hover:text-[#1f2933] py-2 transition-colors">
          <Phone className="w-5 h-5" />
          <span className="font-bold underline decoration-dashed underline-offset-4">
            Contact Extension Officer
          </span>
        </button>
      </div>
    </div>;
}