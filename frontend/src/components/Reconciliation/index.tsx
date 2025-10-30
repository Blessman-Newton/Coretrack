import React from 'react';
import { TrendingUp, CheckCircle } from 'lucide-react';
import { Dispatch, Stats, BaseInventory } from '../../types';
import { formatDateTime, getDaysOut } from '../../utils/helpers';

interface ReconciliationProps {
  dispatches: Dispatch[];
  stats: Stats;
  baseInventory: BaseInventory;
}

export const Reconciliation: React.FC<ReconciliationProps> = ({ dispatches, stats, baseInventory }) => {
  const outstandingDispatches = dispatches.filter(d => d.status === 'outstanding');
  const discrepancies = dispatches.filter(d => 
    d.status === 'returned' && (d.hqBoxes !== d.returnedHq || d.nqBoxes !== d.returnedNq)
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
        <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
          Inventory Reconciliation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-6 rounded-lg border border-blue-200">
            <h3 className="text-sm md:text-base font-semibold text-blue-900 mb-3">Base Inventory</h3>
            <div className="space-y-2 text-xs md:text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">HQ Boxes:</span>
                <span className="font-bold text-blue-900">{baseInventory.hq}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">NQ Boxes:</span>
                <span className="font-bold text-blue-900">{baseInventory.nq}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-blue-300">
                <span className="text-blue-700 font-medium">Total:</span>
                <span className="font-bold text-blue-900">{baseInventory.hq + baseInventory.nq}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 md:p-6 rounded-lg border border-amber-200">
            <h3 className="text-sm md:text-base font-semibold text-amber-900 mb-3">Currently Out</h3>
            <div className="space-y-2 text-xs md:text-sm">
              <div className="flex justify-between">
                <span className="text-amber-700">HQ Boxes:</span>
                <span className="font-bold text-amber-900">{stats.outstandingTotal.hq}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-700">NQ Boxes:</span>
                <span className="font-bold text-amber-900">{stats.outstandingTotal.nq}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-amber-300">
                <span className="text-amber-700 font-medium">Total:</span>
                <span className="font-bold text-amber-900">{stats.outstandingTotal.hq + stats.outstandingTotal.nq}</span>
              </div>
            </div>
          </div>


        </div>

        <div className="overflow-x-auto -mx-4 md:mx-0">
          <div className="inline-block min-w-full align-middle px-4 md:px-0">
            <h3 className="font-semibold text-slate-800 mb-3 text-sm md:text-base">Outstanding Dispatches</h3>
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-700">Project ID</th>
                  <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-700">Drillhole</th>
                  <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-700 hidden sm:table-cell">Company</th>
                  <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-700 hidden md:table-cell">Dispatch Date</th>
                  <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-700">HQ</th>
                  <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-700">NQ</th>
                  <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-700 hidden lg:table-cell">Total</th>
                  <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-700">Days Out</th>
                </tr>
            </thead>
              <tbody className="divide-y divide-slate-200">
              {outstandingDispatches.map(dispatch => {
                const daysOut = getDaysOut(dispatch.dispatchDate);
                return (
                  <tr key={dispatch.id} className={`hover:bg-slate-50 ${daysOut > 7 ? 'bg-red-50' : daysOut > 3 ? 'bg-yellow-50' : ''}`}>
                    <td className="px-2 md:px-4 py-3 text-xs md:text-sm font-medium text-slate-800">{dispatch.projectId}</td>
                    <td className="px-2 md:px-4 py-3 text-xs md:text-sm font-medium text-slate-800">{dispatch.drillholeId}</td>
                    <td className="px-2 md:px-4 py-3 text-xs md:text-sm text-slate-600 hidden sm:table-cell">{dispatch.company}</td>
                    <td className="px-2 md:px-4 py-3 text-xs md:text-sm text-slate-600 hidden md:table-cell">{formatDateTime(dispatch.dispatchDate)}</td>
                    <td className="px-2 md:px-4 py-3 text-xs md:text-sm text-slate-600">{dispatch.hqBoxes}</td>
                    <td className="px-2 md:px-4 py-3 text-xs md:text-sm text-slate-600">{dispatch.nqBoxes}</td>
                    <td className="px-2 md:px-4 py-3 text-xs md:text-sm font-medium text-slate-800 hidden lg:table-cell">{dispatch.hqBoxes + dispatch.nqBoxes}</td>
                    <td className="px-2 md:px-4 py-3">
                      <span className={`text-sm font-medium ${
                        daysOut > 7 ? 'text-red-600' : daysOut > 3 ? 'text-amber-600' : 'text-green-600'
                      }`}>
                        {daysOut} days
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {outstandingDispatches.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <CheckCircle className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm md:text-base">All dispatches have been returned!</p>
            </div>
          )}
          </div>
        </div>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
        <h3 className="text-sm md:text-base font-semibold text-slate-800 mb-4">Discrepancy Report</h3>
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <div className="inline-block min-w-full align-middle px-4 md:px-0">
            <table className="w-full">
              <thead className="bg-slate-50">
              <tr>
                <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-700">Project ID</th>
                <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-700">Drillhole</th>
                <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-700 hidden sm:table-cell">Company</th>
                <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-700 hidden md:table-cell">Dispatched</th>
                <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-700 hidden lg:table-cell">Returned</th>
                <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-700">HQ Diff</th>
                <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-700">NQ Diff</th>
                <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-700 hidden xl:table-cell">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {discrepancies.map(dispatch => (
                <tr key={dispatch.id} className="hover:bg-slate-50 bg-red-50">
                  <td className="px-2 md:px-4 py-3 text-xs md:text-sm font-medium text-slate-800">{dispatch.projectId}</td>
                  <td className="px-2 md:px-4 py-3 text-xs md:text-sm font-medium text-slate-800">{dispatch.drillholeId}</td>
                  <td className="px-2 md:px-4 py-3 text-xs md:text-sm text-slate-600 hidden sm:table-cell">{dispatch.company}</td>
                  <td className="px-2 md:px-4 py-3 text-xs md:text-sm text-slate-600 hidden md:table-cell">
                    HQ: {dispatch.hqBoxes} | NQ: {dispatch.nqBoxes}
                  </td>
                  <td className="px-2 md:px-4 py-3 text-xs md:text-sm text-slate-600 hidden lg:table-cell">
                    HQ: {dispatch.returnedHq} | NQ: {dispatch.returnedNq}
                  </td>
                  <td className="px-2 md:px-4 py-3">
                    <span className={`text-xs md:text-sm font-medium ${
                      dispatch.hqBoxes - dispatch.returnedHq !== 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {dispatch.hqBoxes - dispatch.returnedHq > 0 ? '-' : '+'}
                      {Math.abs(dispatch.hqBoxes - dispatch.returnedHq)}
                    </span>
                  </td>
                  <td className="px-2 md:px-4 py-3">
                    <span className={`text-xs md:text-sm font-medium ${
                      dispatch.nqBoxes - dispatch.returnedNq !== 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {dispatch.nqBoxes - dispatch.returnedNq > 0 ? '-' : '+'}
                      {Math.abs(dispatch.nqBoxes - dispatch.returnedNq)}
                    </span>
                  </td>
                  <td className="px-2 md:px-4 py-3 text-xs md:text-sm text-slate-600 hidden xl:table-cell">{dispatch.returnNotes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {discrepancies.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <CheckCircle className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm md:text-base">No discrepancies found - all returns match!</p>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};
