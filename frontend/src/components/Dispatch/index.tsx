import React from 'react';
import { Send } from 'lucide-react';
import { FormData } from '../../types';
import { COMPANY_LIST } from '../../utils/constants';

interface DispatchFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSubmit: (e: React.FormEvent) => void;
}

export const DispatchForm: React.FC<DispatchFormProps> = ({ formData, setFormData, onSubmit }) => {
    const [currentDate, setCurrentDate] = React.useState(new Date());

    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

  return (
    <div className="bg-white p-4 md:p-8 rounded-xl shadow-md max-w-2xl mx-auto">
      <div className="flex justify-between items-start">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 md:mb-6 flex items-center gap-2">
            <Send className="w-5 h-5 md:w-6 md:h-6" />
            Dispatch Trays
        </h2>
        <div className="text-right">
            <p className="text-sm text-slate-600">{currentDate.toLocaleDateString()}</p>
            <p className="text-sm text-slate-600">{currentDate.toLocaleTimeString()}</p>
        </div>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
            <select
              required
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-black"
            >
              <option value="">Select Company...</option>
              {COMPANY_LIST.map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">HQ Boxes</label>
            <input
              type="number"
              required
              min="0"
              value={formData.hqBoxes}
              onChange={(e) => setFormData({...formData, hqBoxes: parseInt(e.target.value) || 0})}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-black"
            />
          </div>
          <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">NQ Boxes</label>
            <input
              type="number"
              required
              min="0"
              value={formData.nqBoxes}
              onChange={(e) => setFormData({...formData, nqBoxes: parseInt(e.target.value) || 0})}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-black"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Driver</label>
            <input
              type="text"
              required
              value={formData.driver}
              onChange={(e) => setFormData({...formData, driver: e.target.value})}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-black"
              placeholder="Driver Name"
            />
          </div>
          <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Technician</label>
            <input
              type="text"
              required
              value={formData.technician}
              onChange={(e) => setFormData({...formData, technician: e.target.value})}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-black"
              placeholder="Technician Name"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-slate-800 text-white py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors"
        >
          Dispatch Trays
        </button>
      </form>
    </div>
  );
};