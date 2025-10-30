import React, { useState } from 'react';
import { Clock, X } from 'lucide-react';
import { Dispatch } from '../../types';
import { formatDateTime, getDaysOut } from '../../utils/helpers';

interface RecentActivityProps {
  dispatches: Dispatch[];
  highlightedDispatchId?: number | null;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ dispatches, highlightedDispatchId }) => {
  const [selectedDispatch, setSelectedDispatch] = useState<Dispatch | null>(null);

  return (
    <>
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
      <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Clock className="w-4 h-4 md:w-5 md:h-5" />
        Recent Activity
      </h2>
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="inline-block min-w-full align-middle px-4 md:px-0">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-700">Drillhole ID</th>
                <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-700 hidden sm:table-cell">Company</th>
                <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-700 hidden md:table-cell">Dispatched</th>
                <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-700">HQ/NQ</th>
                <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-700">Status</th>
                <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-700 hidden lg:table-cell">Days Out</th>
              </tr>
          </thead>
            <tbody className="divide-y divide-slate-200">
            {dispatches.slice(-5).reverse().map(dispatch => {
              const isHighlighted = highlightedDispatchId === dispatch.id;
              return (
              <tr 
                key={dispatch.id} 
                onClick={() => setSelectedDispatch(dispatch)}
                className={`cursor-pointer transition-all duration-500 ${
                  isHighlighted 
                    ? 'bg-yellow-100 hover:bg-yellow-200 animate-pulse' 
                    : 'hover:bg-slate-50'
                }`}
              >
                <td className="px-2 md:px-4 py-3 text-xs md:text-sm font-medium text-slate-800">{dispatch.drillholeId}</td>
                <td className="px-2 md:px-4 py-3 text-xs md:text-sm text-slate-600 hidden sm:table-cell">{dispatch.company}</td>
                <td className="px-2 md:px-4 py-3 text-xs md:text-sm text-slate-600 hidden md:table-cell">{formatDateTime(dispatch.dispatchDate)}</td>
                <td className="px-2 md:px-4 py-3 text-xs md:text-sm text-slate-600">{dispatch.hqBoxes}/{dispatch.nqBoxes}</td>
                <td className="px-2 md:px-4 py-3">
                  {dispatch.status === 'returned' ? (
                    <div className="flex flex-col gap-1">
                      <span className="px-2 md:px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        returned
                      </span>
                      <span className="text-xs text-slate-500 hidden md:block">
                        {formatDateTime(dispatch.returnDate || '')}
                      </span>
                    </div>
                  ) : (
                    <span className="px-2 md:px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                      outstanding
                    </span>
                  )}
                </td>
                <td className="px-2 md:px-4 py-3 text-xs md:text-sm text-slate-600 hidden lg:table-cell">
                  {dispatch.status === 'returned' 
                    ? `${getDaysOut(dispatch.dispatchDate)} days (returned)` 
                    : `${getDaysOut(dispatch.dispatchDate)} days`}
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>

      {/* Details Modal */}
      {selectedDispatch && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedDispatch(null)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-4 md:p-6 rounded-t-xl flex items-center justify-between">
              <div>
                <h3 className="text-xl md:text-2xl font-bold">Dispatch Details</h3>
                <p className="text-slate-300 text-sm mt-1">ID: #{selectedDispatch.id}</p>
              </div>
              <button
                onClick={() => setSelectedDispatch(null)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 md:p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <div className="w-1 h-6 bg-blue-600 rounded"></div>
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Project ID</p>
                    <p className="text-sm font-semibold text-slate-900">{selectedDispatch.projectId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Drillhole ID</p>
                    <p className="text-sm font-semibold text-slate-900">{selectedDispatch.drillholeId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Company</p>
                    <p className="text-sm font-semibold text-slate-900">{selectedDispatch.company}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Driver</p>
                    <p className="text-sm font-semibold text-slate-900">{selectedDispatch.driver}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 mb-1">Technician</p>
                    <p className="text-sm font-semibold text-slate-900">{selectedDispatch.technician}</p>
                  </div>
                </div>
              </div>

              {/* Dispatch Information */}
              <div>
                <h4 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <div className="w-1 h-6 bg-amber-600 rounded"></div>
                  Dispatch Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <div>
                    <p className="text-xs text-amber-700 mb-1">Dispatch Date</p>
                    <p className="text-sm font-semibold text-amber-900">{formatDateTime(selectedDispatch.dispatchDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-amber-700 mb-1">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      selectedDispatch.status === 'returned' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {selectedDispatch.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-amber-700 mb-1">HQ Boxes</p>
                    <p className="text-sm font-semibold text-amber-900">{selectedDispatch.hqBoxes}</p>
                  </div>
                  <div>
                    <p className="text-xs text-amber-700 mb-1">NQ Boxes</p>
                    <p className="text-sm font-semibold text-amber-900">{selectedDispatch.nqBoxes}</p>
                  </div>
                  <div>
                    <p className="text-xs text-amber-700 mb-1">Total Boxes</p>
                    <p className="text-sm font-semibold text-amber-900">{selectedDispatch.hqBoxes + selectedDispatch.nqBoxes}</p>
                  </div>
                  <div>
                    <p className="text-xs text-amber-700 mb-1">Samples Collected</p>
                    <p className="text-sm font-semibold text-amber-900">{selectedDispatch.samplesCollected}</p>
                  </div>
                  {selectedDispatch.status === 'outstanding' && (
                    <div className="md:col-span-2">
                      <p className="text-xs text-amber-700 mb-1">Days Outstanding</p>
                      <p className={`text-sm font-semibold ${
                        getDaysOut(selectedDispatch.dispatchDate) > 7 ? 'text-red-600' : 
                        getDaysOut(selectedDispatch.dispatchDate) > 3 ? 'text-amber-600' : 'text-green-600'
                      }`}>
                        {getDaysOut(selectedDispatch.dispatchDate)} days
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Return Information (if returned) */}
              {selectedDispatch.status === 'returned' && (
                <div>
                  <h4 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <div className="w-1 h-6 bg-green-600 rounded"></div>
                    Return Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-green-50 p-4 rounded-lg border border-green-200">
                    <div>
                      <p className="text-xs text-green-700 mb-1">Return Date</p>
                      <p className="text-sm font-semibold text-green-900">{formatDateTime(selectedDispatch.returnDate || '')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-green-700 mb-1">Condition</p>
                      <p className="text-sm font-semibold text-green-900">{selectedDispatch.returnCondition || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-green-700 mb-1">HQ Boxes Returned</p>
                      <p className="text-sm font-semibold text-green-900">
                        {selectedDispatch.returnedHq}
                        {selectedDispatch.hqBoxes !== selectedDispatch.returnedHq && (
                          <span className={`ml-2 text-xs ${selectedDispatch.hqBoxes > selectedDispatch.returnedHq ? 'text-red-600' : 'text-orange-600'}`}>
                            ({selectedDispatch.hqBoxes > selectedDispatch.returnedHq ? '-' : '+'}{Math.abs(selectedDispatch.hqBoxes - selectedDispatch.returnedHq)})
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-green-700 mb-1">NQ Boxes Returned</p>
                      <p className="text-sm font-semibold text-green-900">
                        {selectedDispatch.returnedNq}
                        {selectedDispatch.nqBoxes !== selectedDispatch.returnedNq && (
                          <span className={`ml-2 text-xs ${selectedDispatch.nqBoxes > selectedDispatch.returnedNq ? 'text-red-600' : 'text-orange-600'}`}>
                            ({selectedDispatch.nqBoxes > selectedDispatch.returnedNq ? '-' : '+'}{Math.abs(selectedDispatch.nqBoxes - selectedDispatch.returnedNq)})
                          </span>
                        )}
                      </p>
                    </div>
                    {selectedDispatch.returnNotes && (
                      <div className="md:col-span-2">
                        <p className="text-xs text-green-700 mb-1">Return Notes</p>
                        <p className="text-sm text-green-900 bg-white p-3 rounded border border-green-200">{selectedDispatch.returnNotes}</p>
                      </div>
                    )}
                    {(selectedDispatch.hqBoxes === selectedDispatch.returnedHq && selectedDispatch.nqBoxes === selectedDispatch.returnedNq) && (
                      <div className="md:col-span-2 bg-green-100 border border-green-300 rounded-lg p-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <p className="text-sm font-medium text-green-800">Perfect Match - All boxes accounted for</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Sample Information */}
              <div>
                <h4 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <div className="w-1 h-6 bg-purple-600 rounded"></div>
                  Sample Information
                </h4>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-purple-700 mb-1">Sample Type</p>
                      <p className="text-sm font-semibold text-purple-900">{selectedDispatch.sampleType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-purple-700 mb-1">Samples Collected</p>
                      <p className="text-sm font-semibold text-purple-900">{selectedDispatch.samplesCollected}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-4 md:p-6 rounded-b-xl flex justify-end">
              <button
                onClick={() => setSelectedDispatch(null)}
                className="px-6 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
