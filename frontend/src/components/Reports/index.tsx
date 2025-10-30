import React from 'react';
import { Download, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Dispatch, Stats } from '../../types';
import { formatDateTime, exportToCSV } from '../../utils/helpers';
import { COMPANY_LIST, SAMPLE_TYPES } from '../../utils/constants';

interface ReportsProps {
  dispatches: Dispatch[];
  stats: Stats;
}

export const Reports: React.FC<ReportsProps> = ({ dispatches, stats }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Download className="w-5 h-5" />
            Reports & Analytics
          </h2>
          <button
            onClick={() => exportToCSV(dispatches)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export to CSV
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 font-medium mb-1">Total Dispatches</p>
            <p className="text-3xl font-bold text-blue-900">{dispatches.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-green-700 font-medium mb-1">Completed Returns</p>
            <p className="text-3xl font-bold text-green-900">{stats.completed}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-700 font-medium mb-1">Still Outstanding</p>
            <p className="text-3xl font-bold text-amber-900">{stats.outstanding}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-700 font-medium mb-1">Match Rate</p>
            <p className="text-3xl font-bold text-purple-900">{stats.matchRate}%</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <h3 className="font-semibold text-slate-800 mb-3">Complete Dispatch History</h3>
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Project ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Drillhole</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Company</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Dispatch Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">HQ/NQ</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Samples</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Driver</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Return Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Match</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {dispatches.map(dispatch => (
                <tr key={dispatch.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-600">#{dispatch.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{dispatch.projectId}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{dispatch.drillholeId}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{dispatch.company}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{formatDateTime(dispatch.dispatchDate)}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {dispatch.hqBoxes}/{dispatch.nqBoxes}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{dispatch.samplesCollected}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{dispatch.driver}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      dispatch.status === 'returned' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {dispatch.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {dispatch.returnDate ? formatDateTime(dispatch.returnDate) : '-'}
                  </td>
                  <td className="px-4 py-3">
                    {dispatch.status === 'returned' ? (
                      dispatch.hqBoxes === dispatch.returnedHq && dispatch.nqBoxes === dispatch.returnedNq ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )
                    ) : (
                      <Clock className="w-5 h-5 text-amber-600" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="font-semibold text-slate-800 mb-4">Dispatches by Company</h3>
          <div className="space-y-3">
            {COMPANY_LIST.map(company => {
              const companyDispatches = dispatches.filter(d => d.company === company);
              const count = companyDispatches.length;
              const samples = companyDispatches.reduce((sum, d) => sum + d.samplesCollected, 0);
              return count > 0 ? (
                <div key={company} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-800">{company}</p>
                    <p className="text-sm text-slate-600">{samples} samples collected</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-800">{count}</p>
                    <p className="text-xs text-slate-600">dispatches</p>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="font-semibold text-slate-800 mb-4">Sample Types</h3>
          <div className="space-y-3">
            {SAMPLE_TYPES.map(type => {
              const typeDispatches = dispatches.filter(d => d.sampleType === type);
              const count = typeDispatches.length;
              const totalSamples = typeDispatches.reduce((sum, d) => sum + d.samplesCollected, 0);
              return count > 0 ? (
                <div key={type} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-800">{type}</p>
                    <p className="text-sm text-slate-600">{count} dispatches</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-800">{totalSamples}</p>
                    <p className="text-xs text-slate-600">samples</p>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
