import React, { useState } from 'react';
import { Calculator, Leaf, FlaskConical, ChevronRight, Clock, Beaker, CheckCircle2, Calendar, Wifi, WifiOff, X } from 'lucide-react';
import { Disease, Treatment } from '../data/mockDiseases';
import { ScheduledTreatment } from '../App';
interface TreatmentOptionsProps {
  diagnosis: Disease;
  isOfflineMode?: boolean;
  onScheduleTreatment: (treatment: ScheduledTreatment) => void;
}
export function TreatmentOptions({
  diagnosis,
  isOfflineMode = true,
  onScheduleTreatment
}: TreatmentOptionsProps) {
  const [fieldSize, setFieldSize] = useState('1');
  const [selectedTreatment, setSelectedTreatment] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [comparedTreatments, setComparedTreatments] = useState<string[]>([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [schedulingTreatment, setSchedulingTreatment] = useState<Treatment | null>(null);
  const [scheduleStartDate, setScheduleStartDate] = useState('');
  const calculateTotalCost = (costPerAcre: number) => {
    return parseInt(fieldSize || '0') * costPerAcre;
  };
  const toggleCompare = (treatmentId: string) => {
    if (comparedTreatments.includes(treatmentId)) {
      setComparedTreatments(comparedTreatments.filter(id => id !== treatmentId));
    } else if (comparedTreatments.length < 3) {
      setComparedTreatments([...comparedTreatments, treatmentId]);
    }
  };
  const openScheduleModal = (treatment: Treatment) => {
    setSchedulingTreatment(treatment);
    setShowScheduleModal(true);
    // Set default start date to today
    const today = new Date().toISOString().split('T')[0];
    setScheduleStartDate(today);
  };
  const handleScheduleSubmit = () => {
    if (schedulingTreatment && scheduleStartDate) {
      const startDate = new Date(scheduleStartDate);
      const frequencyDays = parseInt(schedulingTreatment.frequency.match(/\d+/)?.[0] || '7');
      const nextApplicationDate = new Date(startDate);
      nextApplicationDate.setDate(nextApplicationDate.getDate() + frequencyDays);
      const scheduled: ScheduledTreatment = {
        treatmentId: schedulingTreatment.id,
        treatmentName: schedulingTreatment.name,
        startDate,
        frequency: schedulingTreatment.frequency,
        nextApplicationDate
      };
      onScheduleTreatment(scheduled);
      setShowScheduleModal(false);
      setSchedulingTreatment(null);
      alert(`Treatment scheduled! Next application: ${nextApplicationDate.toLocaleDateString()}`);
    }
  };
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Organic':
        return <Leaf className="w-4 h-4 text-green-600" />;
      case 'Chemical':
        return <FlaskConical className="w-4 h-4 text-gray-500" />;
      case 'Traditional':
        return <Beaker className="w-4 h-4 text-gray-500" />;
      default:
        return null;
    }
  };
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Organic':
        return 'text-green-700 bg-green-50';
      case 'Chemical':
        return 'text-gray-600 bg-gray-100';
      case 'Traditional':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };
  const getEffectivenessScore = (effectiveness: string) => {
    switch (effectiveness) {
      case 'Very High':
        return 95;
      case 'High':
        return 80;
      case 'Medium':
        return 60;
      case 'Low':
        return 40;
      default:
        return 50;
    }
  };
  return <div className="space-y-8">
      {/* Schedule Modal */}
      {showScheduleModal && schedulingTreatment && <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-2 border-[#1f2933] max-w-md w-full p-6 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-[#1f2933]">
                  Schedule Treatment
                </h3>
                <p className="font-mono text-sm text-gray-500 mt-1">
                  {schedulingTreatment.name}
                </p>
              </div>
              <button onClick={() => setShowScheduleModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-mono text-gray-500">
                    Application Frequency:
                  </span>
                  <span className="font-bold">
                    {schedulingTreatment.application}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-mono text-gray-500">Type:</span>
                  <span className="font-bold">{schedulingTreatment.type}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-mono text-sm text-gray-700 uppercase tracking-wider">
                  Start Date
                </label>
                <input type="date" value={scheduleStartDate} onChange={e => setScheduleStartDate(e.target.value)} className="w-full border-2 border-gray-300 p-3 font-mono focus:border-[#1f2933] outline-none" min={new Date().toISOString().split('T')[0]} />
              </div>

              <div className="bg-gray-50 border border-dashed border-gray-300 p-4">
                <p className="font-mono text-xs text-gray-600">
                  <strong>Instructions:</strong>{' '}
                  {schedulingTreatment.instructions}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setShowScheduleModal(false)} className="flex-1 py-3 border border-gray-400 bg-white hover:bg-gray-50 font-mono text-sm uppercase">
                Cancel
              </button>
              <button onClick={handleScheduleSubmit} className="flex-1 py-3 bg-[#1f2933] text-white hover:bg-gray-800 font-mono text-sm uppercase">
                Schedule
              </button>
            </div>
          </div>
        </div>}

      {/* Mode Indicator */}
      <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 bg-white rounded">
        {isOfflineMode ? <>
            <WifiOff className="w-4 h-4 text-gray-500" />
            <span className="font-mono text-xs text-gray-600">
              Offline mode - Local treatment database
            </span>
          </> : <>
            <Wifi className="w-4 h-4 text-green-600" />
            <span className="font-mono text-xs text-green-700">
              Online mode - Latest treatment updates available
            </span>
          </>}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-[#1f2933]">Treatments</h2>
          <button onClick={() => setCompareMode(!compareMode)} className={`px-3 py-1 border font-mono text-xs uppercase transition-colors ${compareMode ? 'bg-[#1f2933] text-white border-[#1f2933]' : 'border-gray-400 hover:bg-gray-50'}`}>
            {compareMode ? 'Exit Compare' : 'Compare'}
          </button>
        </div>
        <p className="font-mono text-sm text-[#9ca3af]">
          Ranked by effectiveness & cost
        </p>
      </div>

      {/* Comparison Table */}
      {compareMode && comparedTreatments.length > 0 && <div className="bg-white border-2 border-[#1f2933] p-4 space-y-4 overflow-x-auto">
          <h3 className="font-bold uppercase text-sm">Treatment Comparison</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left font-mono text-xs py-2">Metric</th>
                {comparedTreatments.map(id => {
              const treatment = diagnosis.treatments.find(t => t.id === id);
              return <th key={id} className="text-left font-bold py-2 px-2">
                      {treatment?.name}
                    </th>;
            })}
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              <tr className="border-b border-gray-200">
                <td className="py-2 text-gray-500">Type</td>
                {comparedTreatments.map(id => {
              const treatment = diagnosis.treatments.find(t => t.id === id);
              return <td key={id} className="py-2 px-2">
                      {treatment?.type}
                    </td>;
            })}
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 text-gray-500">Effectiveness</td>
                {comparedTreatments.map(id => {
              const treatment = diagnosis.treatments.find(t => t.id === id);
              return <td key={id} className="py-2 px-2">
                      {treatment?.effectiveness}
                    </td>;
            })}
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 text-gray-500">Cost/Acre</td>
                {comparedTreatments.map(id => {
              const treatment = diagnosis.treatments.find(t => t.id === id);
              return <td key={id} className="py-2 px-2">
                      {treatment?.costPerAcre === 0 ? 'Free' : `KES ${treatment?.costPerAcre}`}
                    </td>;
            })}
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 text-gray-500">Application</td>
                {comparedTreatments.map(id => {
              const treatment = diagnosis.treatments.find(t => t.id === id);
              return <td key={id} className="py-2 px-2">
                      {treatment?.application}
                    </td>;
            })}
              </tr>
              <tr>
                <td className="py-2 text-gray-500">Total Cost</td>
                {comparedTreatments.map(id => {
              const treatment = diagnosis.treatments.find(t => t.id === id);
              return <td key={id} className="py-2 px-2 font-bold">
                      KES {calculateTotalCost(treatment?.costPerAcre || 0)}
                    </td>;
            })}
              </tr>
            </tbody>
          </table>
        </div>}

      {/* Cost Calculator */}
      <div className="bg-white border-2 border-dashed border-gray-300 p-4 space-y-4">
        <div className="flex items-center gap-2 text-[#1f2933] font-bold uppercase tracking-wider text-sm">
          <Calculator className="w-4 h-4" />
          <h3>Cost Estimator</h3>
        </div>

        <div className="flex items-end gap-4">
          <div className="flex-1 space-y-1">
            <label className="font-mono text-xs text-gray-500 block">
              Field Size (Acres)
            </label>
            <input type="number" min="0" step="0.5" value={fieldSize} onChange={e => setFieldSize(e.target.value)} className="w-full border-b-2 border-gray-300 bg-transparent py-2 font-mono text-xl focus:border-[#1f2933] outline-none" />
          </div>
          <div className="pb-2">
            <span className="font-mono text-xs text-gray-400">
              Selected Treatment:
            </span>
            <span className="block font-bold text-lg">
              KES{' '}
              {selectedTreatment ? calculateTotalCost(diagnosis.treatments.find(t => t.id === selectedTreatment)?.costPerAcre || 0) : '---'}
            </span>
          </div>
        </div>
      </div>

      {/* Treatment List */}
      <div className="space-y-6">
        {diagnosis.treatments.map((treatment, index) => {
        const isSelected = selectedTreatment === treatment.id;
        const isCompared = comparedTreatments.includes(treatment.id);
        const isTopChoice = index === 0;
        return <div key={treatment.id} className={`border-2 p-5 bg-white relative transition-all ${isTopChoice ? 'border-[#1f2933]' : isSelected || isCompared ? 'border-gray-400' : 'border-gray-300 opacity-75'}`}>
              <div className={`absolute -top-3 -left-3 w-8 h-8 flex items-center justify-center font-mono font-bold text-lg ${isTopChoice ? 'bg-[#1f2933] text-white' : 'bg-gray-200 text-gray-600'}`}>
                {index + 1}
              </div>

              {compareMode && <button onClick={() => toggleCompare(treatment.id)} className={`absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center border-2 transition-colors ${isCompared ? 'bg-[#1f2933] border-[#1f2933] text-white' : 'bg-white border-gray-400 text-gray-400 hover:border-[#1f2933]'}`}>
                  {isCompared && <CheckCircle2 className="w-5 h-5" />}
                </button>}

              <div className="flex justify-between items-start mb-4 pl-4">
                <div>
                  <h3 className={`font-bold text-xl ${isTopChoice ? 'text-[#1f2933]' : 'text-gray-700'}`}>
                    {treatment.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {getTypeIcon(treatment.type)}
                    <span className={`font-mono text-xs uppercase px-2 py-0.5 rounded ${getTypeColor(treatment.type)}`}>
                      {treatment.type}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-mono text-sm font-bold ${isTopChoice ? 'text-[#1f2933]' : 'text-gray-600'}`}>
                    {treatment.effectiveness}
                  </div>
                  <div className="text-xs text-gray-500">
                    {treatment.costPerAcre === 0 ? 'Free' : `KES ${treatment.costPerAcre}/acre`}
                  </div>
                </div>
              </div>

              {/* Effectiveness Bar */}
              <div className="mb-4 pl-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-xs text-gray-500">
                    Effectiveness
                  </span>
                  <span className="font-mono text-xs font-bold">
                    {getEffectivenessScore(treatment.effectiveness)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#1f2933]" style={{
                width: `${getEffectivenessScore(treatment.effectiveness)}%`
              }} />
                </div>
              </div>

              <div className="space-y-3 pl-4 border-l-2 border-gray-200 ml-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{treatment.application}</span>
                </div>
                <p className="text-sm text-gray-600">
                  {treatment.instructions}
                </p>
              </div>

              <div className="flex gap-2">
                {!compareMode && <button onClick={() => setSelectedTreatment(treatment.id)} className={`flex-1 py-2 border font-mono text-sm uppercase transition-colors ${isSelected ? 'bg-[#1f2933] text-white border-[#1f2933]' : 'border-gray-300 hover:bg-gray-50'}`}>
                    {isSelected ? 'Selected' : 'Select'}
                  </button>}
                <button onClick={() => openScheduleModal(treatment)} className="flex-1 py-2 border border-gray-300 hover:bg-gray-50 font-mono text-sm uppercase flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Schedule
                </button>
              </div>
            </div>;
      })}
      </div>

      {selectedTreatment && !compareMode && <div className="bg-white border-2 border-[#1f2933] p-4 space-y-2">
          <h3 className="font-bold uppercase text-sm">Total Estimate</h3>
          <div className="flex justify-between items-center">
            <span className="font-mono text-sm">
              {fieldSize} acres × KES{' '}
              {diagnosis.treatments.find(t => t.id === selectedTreatment)?.costPerAcre}
            </span>
            <span className="text-2xl font-bold">
              KES{' '}
              {calculateTotalCost(diagnosis.treatments.find(t => t.id === selectedTreatment)?.costPerAcre || 0)}
            </span>
          </div>
        </div>}
    </div>;
}