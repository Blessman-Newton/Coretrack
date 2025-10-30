import React from 'react';
import { Undo } from 'lucide-react';
import { Dispatch, ReturnFormData } from '../../types';
import { RETURN_CONDITIONS } from '../../utils/constants';
import { formatDateTime } from '../../utils/helpers';
import { MismatchWarningModal } from './MismatchWarningModal';

interface ReturnFormProps {
  dispatches: Dispatch[];
  returnFormData: ReturnFormData;
  setReturnFormData: React.Dispatch<React.SetStateAction<ReturnFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  showMismatchWarning: boolean;
  mismatchDetails: any;
  onCancelMismatch: () => void;
  onProceedMismatch: () => void;
}

export const ReturnForm: React.FC<ReturnFormProps> = ({
  dispatches,
  returnFormData,
  setReturnFormData,
  onSubmit,
  showMismatchWarning,
  mismatchDetails,
  onCancelMismatch,
  onProceedMismatch
}) => {
  return (
    <>
      <div className="bg-white p-4 md:p-8 rounded-xl shadow-md max-w-2xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 md:mb-6 flex items-center gap-2">
          <Undo className="w-5 h-5 md:w-6 md:h-6" />
          Return Trays
        </h2>
        <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Select Dispatch</label>
          <select
            required
            value={returnFormData.dispatchId}
            onChange={(e) => {
              setReturnFormData({
                ...returnFormData,
                dispatchId: e.target.value,
                returnedHq: '',
                returnedNq: ''
              });
            }}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-black"
          >
            <option value="">Select a dispatch...</option>
            {dispatches.filter(d => d.status === 'outstanding').map(d => (
              <option key={d.id} value={d.id}>
                {d.drillholeId} - {d.company} (HQ: {d.hqBoxes}, NQ: {d.nqBoxes})
              </option>
            ))}
          </select>
        </div>

        {returnFormData.dispatchId && (
          <>
            <div className="border border-slate-200 rounded-lg p-3 md:p-4 bg-slate-50">
              <p className="text-xs md:text-sm font-medium text-slate-900 mb-2">Dispatch Information:</p>
              <div className="space-y-1 text-xs md:text-sm text-slate-700">
                <div className="flex justify-between">
                  <span className="font-medium">Drillhole:</span>
                  <span>{dispatches.find(d => d.id === parseInt(returnFormData.dispatchId))?.drillholeId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Company:</span>
                  <span>{dispatches.find(d => d.id === parseInt(returnFormData.dispatchId))?.company}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Dispatch Date:</span>
                  <span>{formatDateTime(dispatches.find(d => d.id === parseInt(returnFormData.dispatchId))?.dispatchDate || '')}</span>
                </div>
                <div className="border-t border-slate-300 my-2"></div>
                <div className="flex justify-between">
                  <span className="font-medium">Expected HQ:</span>
                  <span className="font-semibold">{dispatches.find(d => d.id === parseInt(returnFormData.dispatchId))?.hqBoxes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Expected NQ:</span>
                  <span className="font-semibold">{dispatches.find(d => d.id === parseInt(returnFormData.dispatchId))?.nqBoxes}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">HQ Boxes Returned</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={returnFormData.returnedHq}
                  onChange={(e) => setReturnFormData({...returnFormData, returnedHq: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-black"
                  placeholder="Enter actual count"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">NQ Boxes Returned</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={returnFormData.returnedNq}
                  onChange={(e) => setReturnFormData({...returnFormData, returnedNq: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-black"
                  placeholder="Enter actual count"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Driver</label>
                <input
                  type="text"
                  required
                  value={returnFormData.driver}
                  onChange={(e) => setReturnFormData({...returnFormData, driver: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-black"
                  placeholder="Driver Name"
                />
              </div>
              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Technician</label>
                <input
                  type="text"
                  required
                  value={returnFormData.technician}
                  onChange={(e) => setReturnFormData({...returnFormData, technician: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-black"
                  placeholder="Technician Name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Condition</label>
              <select
                value={returnFormData.returnCondition}
                onChange={(e) => setReturnFormData({...returnFormData, returnCondition: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-black"
              >
                {RETURN_CONDITIONS.map(condition => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Return Notes</label>
              <textarea
                value={returnFormData.returnNotes}
                onChange={(e) => setReturnFormData({...returnFormData, returnNotes: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-black"
                rows={3}
                placeholder="Any notes about the condition or issues..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors text-sm md:text-base"
            >
              Process Return
            </button>
          </>
        )}
      </form>

      {showMismatchWarning && mismatchDetails && (
        <MismatchWarningModal
          mismatchDetails={mismatchDetails}
          onCancel={onCancelMismatch}
          onProceed={onProceedMismatch}
        />
      )}
    </div>
    </>
  );
};