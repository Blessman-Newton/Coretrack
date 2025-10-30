import React, { useEffect, useState } from 'react';
import { FlaskConical, Send } from 'lucide-react';
import { Sample, SampleFormData, SampleType, SampleStatus } from '../../types/sample';
import { formatDateTime } from '../../utils/helpers';
import { Barcode } from './Barcode';

interface SamplesProps {
  samples: Sample[];
  formData: SampleFormData;
  setFormData: React.Dispatch<React.SetStateAction<SampleFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  selectedDispatchId?: number;
  filteredDispatches?: any[];
}

export const Samples: React.FC<SamplesProps> = ({ samples, formData, setFormData, onSubmit, selectedDispatchId, filteredDispatches }) => {
  const [sampleIdCounter, setSampleIdCounter] = useState(1);

  useEffect(() => {
    if (selectedDispatchId) {
      setFormData(prevData => ({...prevData, dispatch_id: selectedDispatchId}));
    }
  }, [selectedDispatchId, setFormData]);

  // Generate next sample ID
  const generateSampleId = () => {
    const prefix = selectedDispatchId ? `D${selectedDispatchId}` : 'S';
    return `${prefix}-${String(sampleIdCounter).padStart(3, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Form Section */}
      <div className="bg-white p-4 md:p-8 rounded-xl shadow-md max-w-2xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 md:mb-6 flex items-center gap-2">
          <FlaskConical className="w-5 h-5 md:w-6 md:h-6" />
          Sample Sent
        </h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          // Auto-generate sample ID if not provided
          if (!formData.sample_id) {
            const newSampleId = generateSampleId();
            setFormData(prev => ({...prev, sample_id: newSampleId}));
            setSampleIdCounter(prev => prev + 1);
          }
          onSubmit(e);
        }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Dispatch</label>
              <select
                required
                value={formData.dispatch_id || ''}
                onChange={(e) => setFormData({...formData, dispatch_id: parseInt(e.target.value)})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-black"
              >
                <option value="">Select Dispatch</option>
                {filteredDispatches?.map(dispatch => (
                  <option key={dispatch.id} value={dispatch.id}>
                    {dispatch.projectId} - {dispatch.drillholeId} (#{dispatch.id})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sample ID</label>
              <input
                type="text"
                required
                value={formData.sample_id || ''}
                onChange={(e) => setFormData({...formData, sample_id: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-black"
                placeholder={generateSampleId()}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sample Type</label>
              <select
                required
                value={formData.sample_type || ''}
                onChange={(e) => setFormData({...formData, sample_type: e.target.value as SampleType})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-black"
              >
                <option value="">Select Type</option>
                <option value="core">Core</option>
                <option value="assay">Assay</option>
                <option value="geochemical">Geochemical</option>
                <option value="mineralogy">Mineralogy</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                value={formData.status || 'collected'}
                onChange={(e) => setFormData({...formData, status: e.target.value as SampleStatus})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-black"
              >
                <option value="collected">Collected</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">From Depth (m)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.from_depth || ''}
                onChange={(e) => setFormData({...formData, from_depth: parseFloat(e.target.value) || undefined})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-black"
                placeholder="0.0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">To Depth (m)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.to_depth || ''}
                onChange={(e) => setFormData({...formData, to_depth: parseFloat(e.target.value) || undefined})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-black"
                placeholder="0.0"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-800 text-white py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            Submit Sample Record
          </button>
        </form>
      </div>

      {/* Samples History Table */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
        <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <FlaskConical className="w-4 h-4 md:w-5 md:h-5" />
          Sample History
        </h3>
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <div className="inline-block min-w-full align-middle px-4 md:px-0">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-700">Sample ID</th>
                  <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-700">Dispatch</th>
                  <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-700">Type</th>
                  <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-700">Depth Range</th>
                  <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-700">Status</th>
                  <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-700">Barcode</th>
                  <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-semibold text-slate-700 hidden sm:table-cell">Created</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {samples.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-2 md:px-4 py-8 text-center text-slate-500 text-sm">
                    No sample records yet. Add your first sample above.
                  </td>
                </tr>
              ) : (
                samples.slice().reverse().map(sample => {
                  const dispatch = filteredDispatches?.find(d => d.id === sample.dispatch_id);

                  const normalizeDepth = (v: unknown): number | undefined => {
                    if (typeof v === 'number') return v;
                    if (typeof v === 'string') {
                      const n = parseFloat(v);
                      return Number.isFinite(n) ? n : undefined;
                    }
                    return undefined;
                  };

                  const from = normalizeDepth(sample.from_depth as any);
                  const to = normalizeDepth(sample.to_depth as any);

                  const depthRange = from !== undefined && to !== undefined 
                    ? `${from.toFixed(1)} - ${to.toFixed(1)}m`
                    : from !== undefined 
                    ? `${from.toFixed(1)}m+`
                    : to !== undefined
                    ? `0 - ${to.toFixed(1)}m`
                    : 'N/A';
                  
                  return (
                    <tr key={sample.id} className="hover:bg-slate-50">
                      <td className="px-2 md:px-4 py-3 text-xs md:text-sm font-medium text-slate-800">{sample.sample_id}</td>
                      <td className="px-2 md:px-4 py-3 text-xs md:text-sm text-slate-600">
                        {dispatch ? `${dispatch.projectId} - ${dispatch.drillholeId}` : `#${sample.dispatch_id}`}
                      </td>
                      <td className="px-2 md:px-4 py-3 text-xs md:text-sm text-slate-600 capitalize">{sample.sample_type}</td>
                      <td className="px-2 md:px-4 py-3 text-xs md:text-sm text-slate-600">{depthRange}</td>
                      <td className="px-2 md:px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          sample.status === 'completed' 
                            ? 'bg-green-100 text-green-700' 
                            : sample.status === 'processing'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {sample.status === 'completed' ? '✓ Completed' : 
                           sample.status === 'processing' ? '⏳ Processing' : 
                           '📦 Collected'}
                        </span>
                      </td>
                      <td className="px-2 md:px-4 py-2">
                        <Barcode value={sample.barcode || sample.sample_id || String(sample.id)} height={36} width={2} />
                      </td>
                      <td className="px-2 md:px-4 py-3 text-xs md:text-sm text-slate-600 hidden sm:table-cell">
                        {formatDateTime(sample.created_at)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          </div>
        </div>

        {/* Summary Stats */}
        {samples.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 font-medium mb-1">Total Samples</p>
              <p className="text-3xl font-bold text-blue-900">
                {samples.length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-700 font-medium mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-900">
                {samples.filter(s => s.status === 'completed').length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-700 font-medium mb-1">Processing</p>
              <p className="text-3xl font-bold text-amber-900">
                {samples.filter(s => s.status === 'processing').length}
              </p>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-lg border border-slate-200">
              <p className="text-sm text-slate-700 font-medium mb-1">Collected</p>
              <p className="text-3xl font-bold text-slate-900">
                {samples.filter(s => s.status === 'collected').length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
