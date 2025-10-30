import { useState, useEffect } from 'react';
import { dispatchesAPI, reportsAPI } from '../services/api';
import { Dispatch } from '../types';

interface UseBackendDataReturn {
  dispatches: Dispatch[];
  loading: boolean;
  error: string | null;
  useBackend: boolean;
  refreshData: () => Promise<void>;
}

export const useBackendData = (selectedProjectId?: string, selectedHoleId?: string): UseBackendDataReturn => {
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useBackend, setUseBackend] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from backend
      const backendDispatches = await dispatchesAPI.getAll();
      
      // Transform backend data to match frontend format
      const transformedDispatches: Dispatch[] = backendDispatches.map((d: any) => ({
        id: d.id,
        projectId: d.project_name || `PROJ-${d.project_id}`,
        drillholeId: d.drillhole_name || `DH-${d.drillhole_id}`,
        company: d.company_name || 'Unknown',
        dispatchDate: d.dispatch_date,
        hqBoxes: d.hq_boxes,
        nqBoxes: d.nq_boxes,
        driver: d.driver,
        technician: d.technician,
        samplesCollected: d.samples_collected || 0,
        sampleType: d.sample_type || '',
        status: d.status,
        returnDate: d.return_date,
        returnedHq: d.returned_hq || 0,
        returnedNq: d.returned_nq || 0,
        returnCondition: d.return_condition,
        returnNotes: d.return_notes,
        returnDriver: d.return_driver,
        returnTechnician: d.return_technician,
      }));

      setDispatches(transformedDispatches);
      setUseBackend(true);
    } catch (err) {
      console.error('Backend connection failed:', err);
      setError('Backend not available. Using offline mode.');
      setUseBackend(false);
      // Don't set dispatches here - let the component use mock data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    dispatches,
    loading,
    error,
    useBackend,
    refreshData: loadData,
  };
};

