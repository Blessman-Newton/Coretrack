import React from 'react';
import { AlertCircle } from 'lucide-react';
import { MismatchDetails } from '../../types';

interface MismatchWarningModalProps {
  mismatchDetails: MismatchDetails;
  onCancel: () => void;
  onProceed: () => void;
}

export const MismatchWarningModal: React.FC<MismatchWarningModalProps> = ({
  mismatchDetails,
  onCancel,
  onProceed
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <h3 className="text-xl font-bold text-slate-800">Quantity Mismatch Detected</h3>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-sm font-medium text-red-900 mb-2">
            Drillhole: {mismatchDetails.dispatch.drillholeId} - {mismatchDetails.dispatch.company}
          </p>
          <div className="space-y-1 text-sm text-red-700">
            <div className="flex justify-between">
              <span>Expected HQ:</span>
              <span className="font-medium">{mismatchDetails.dispatch.hqBoxes}</span>
            </div>
            <div className="flex justify-between">
              <span>Returned HQ:</span>
              <span className="font-medium">{mismatchDetails.returnedHq}</span>
            </div>
            {mismatchDetails.hqDiff !== 0 && (
              <div className="flex justify-between font-semibold">
                <span>HQ Difference:</span>
                <span className={mismatchDetails.hqDiff > 0 ? 'text-red-600' : 'text-orange-600'}>
                  {mismatchDetails.hqDiff > 0 ? '-' : '+'}{Math.abs(mismatchDetails.hqDiff)}
                </span>
              </div>
            )}
            <div className="border-t border-red-300 my-2"></div>
            <div className="flex justify-between">
              <span>Expected NQ:</span>
              <span className="font-medium">{mismatchDetails.dispatch.nqBoxes}</span>
            </div>
            <div className="flex justify-between">
              <span>Returned NQ:</span>
              <span className="font-medium">{mismatchDetails.returnedNq}</span>
            </div>
            {mismatchDetails.nqDiff !== 0 && (
              <div className="flex justify-between font-semibold">
                <span>NQ Difference:</span>
                <span className={mismatchDetails.nqDiff > 0 ? 'text-red-600' : 'text-orange-600'}>
                  {mismatchDetails.nqDiff > 0 ? '-' : '+'}{Math.abs(mismatchDetails.nqDiff)}
                </span>
              </div>
            )}
          </div>
        </div>
        <p className="text-sm text-slate-600 mb-4">
          Do you want to proceed with this return? This will update the inventory accordingly.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onProceed}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Proceed Anyway
          </button>
        </div>
      </div>
    </div>
  );
};
