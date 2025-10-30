import React, { useState, useMemo, useEffect } from 'react';
import { Package, Bell, Filter } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { DispatchForm } from './components/Dispatch';
import { ReturnForm } from './components/Return';
import { Samples } from './components/Samples';
import { Reconciliation } from './components/Reconciliation';
import { Reports } from './components/Reports';
import { Notifications } from './components/Notifications';
import { Dispatch, FormData, ReturnFormData, MismatchDetails, BaseInventory } from './types';
import { Sample, SampleFormData } from './types/sample';
import { samplesAPI } from './services/api';
import { TABS } from './utils/constants';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { useBackendData } from './hooks/useBackendData';
import { dispatchesAPI, projectsAPI, drillholesAPI, companiesAPI } from './services/api';
import { useAuth } from './contexts/AuthContext';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { LogOut, User as UserIcon } from 'lucide-react';

const PROJECT_IDS = Array.from({ length: 7 }, (_, i) => `PROJ-${String(i + 1).padStart(3, '0')}`);
const COMPANIES = ['ALS Geochemistry', 'SGS Minerals', 'Bureau Veritas', 'Intertek Genalysis', 'ActLabs', 'MSA Labs', 'Core Analytical', 'Geotech Laboratory', 'MinAnalytical', 'Blue Coast Research'];
const DRIVERS = ['John Mensah', 'Ama Serwaa', 'Kofi Owusu', 'Yaw Boateng', 'Akua Nyarko', 'Kwame Asante', 'Efua Mensimah'];
const TECHNICIANS = ['Kwame Asante', 'Kofi Owusu', 'Abena Sackey', 'Yaw Ofori', 'Kojo Tetteh', 'Esi Baah', 'Nana Frimpong'];
const SAMPLE_TYPES = ['Core samples', 'Assay samples', 'Pulps', 'Rejects'];

const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T,>(arr: T[]) => arr[randInt(0, arr.length - 1)];

function generateMockDispatches(): Dispatch[] {
  const list: Dispatch[] = [];
  const now = new Date();
  const holesPerProject = 10;
  const recordsPerHole = 15;
  let id = 1;
  const holeCompanyMap = new Map<string, string>();

  for (const projectId of PROJECT_IDS) {
    for (let holeNum = 1; holeNum <= holesPerProject; holeNum++) {
      const drillholeId = `DH-${String(holeNum).padStart(3, '0')}`;
      const holeKey = `${projectId}-${drillholeId}`;

      if (!holeCompanyMap.has(holeKey)) {
        holeCompanyMap.set(holeKey, pick(COMPANIES));
      }
      const company = holeCompanyMap.get(holeKey)!;

      for (let r = 0; r < recordsPerHole; r++) {
        const hqBoxes = randInt(5, 20);
        const nqBoxes = randInt(10, 30);
        const driver = pick(DRIVERS);
        const technician = pick(TECHNICIANS);
        const samplesCollected = randInt(15, 85);
        const sampleType = pick(SAMPLE_TYPES);

        let daysAgo: number;
        const dateRand = Math.random();
        if (dateRand < 0.40) daysAgo = randInt(0, 30);
        else if (dateRand < 0.75) daysAgo = randInt(31, 60);
        else daysAgo = randInt(61, 120);

        const dispatchDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

        let returnProbability: number;
        if (daysAgo <= 7) returnProbability = 0.20;
        else if (daysAgo <= 14) returnProbability = 0.50;
        else if (daysAgo <= 21) returnProbability = 0.70;
        else returnProbability = Math.random() < 0.05 ? 0 : 0.85;

        const isReturned = Math.random() < returnProbability;

        if (isReturned) {
          let returnDaysAfter: number;
          const returnRand = Math.random();
          if (returnRand < 0.15) returnDaysAfter = randInt(3, 7);
          else if (returnRand < 0.70) returnDaysAfter = randInt(7, 21);
          else returnDaysAfter = randInt(21, 35);

          const retDate = new Date(dispatchDate.getTime() + returnDaysAfter * 24 * 60 * 60 * 1000);

          if (retDate <= now) {
            const hasMismatch = Math.random() < 0.05;
            let returnedHq = hasMismatch ? Math.max(0, hqBoxes + (Math.random() < 0.5 ? -1 : 1)) : hqBoxes;
            let returnedNq = hasMismatch ? Math.max(0, nqBoxes + (Math.random() < 0.5 ? -1 : 1)) : nqBoxes;
            const returnCondition = hasMismatch || Math.random() < 0.10 ? pick(['Fair', 'Damaged']) : 'Good';
            const returnNotes = returnCondition === 'Damaged' ? 'Some trays damaged' : returnCondition === 'Fair' ? 'Minor wear' : 'Good condition';

            list.push({
              id: id++, projectId, drillholeId, company, dispatchDate: dispatchDate.toISOString(), hqBoxes, nqBoxes, driver, technician,
              samplesCollected, sampleType, status: 'returned', returnDate: retDate.toISOString(), returnedHq, returnedNq,
              returnCondition, returnNotes, returnDriver: driver, returnTechnician: technician,
            });
          } else {
            list.push({
              id: id++, projectId, drillholeId, company, dispatchDate: dispatchDate.toISOString(), hqBoxes, nqBoxes, driver, technician,
              samplesCollected, sampleType, status: 'outstanding', returnDate: null, returnedHq: 0, returnedNq: 0,
              returnCondition: null, returnNotes: null, returnDriver: null, returnTechnician: null,
            });
          }
        } else {
          list.push({
            id: id++, projectId, drillholeId, company, dispatchDate: dispatchDate.toISOString(), hqBoxes, nqBoxes, driver, technician,
            samplesCollected, sampleType, status: 'outstanding', returnDate: null, returnedHq: 0, returnedNq: 0,
            returnCondition: null, returnNotes: null, returnDriver: null, returnTechnician: null,
          });
        }
      }
    }
  }
  return list;
}

const TrayInventorySystem = () => {
  const { user, logout, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('dashboard');
  const [baseInventory] = useState<BaseInventory>({ hq: 1200, nq: 1800 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedHoleId, setSelectedHoleId] = useState('');
  const [selectedDispatchId, setSelectedDispatchId] = useState<number | undefined>(undefined);
  const [showNotifications, setShowNotifications] = useState(false);
  const [highlightedDispatchId, setHighlightedDispatchId] = useState<number | null>(null);

  // Backend integration
  const { dispatches: backendDispatches, loading: backendLoading, useBackend, refreshData } = useBackendData(selectedProjectId, selectedHoleId);
  
  // Use backend data if available, otherwise use mock data
  const [mockDispatches, setMockDispatches] = useState<Dispatch[]>(() => generateMockDispatches());
  const dispatches = useBackend ? backendDispatches : mockDispatches;
  const setDispatches = useBackend ? () => {} : setMockDispatches;

  React.useEffect(() => {
    if (!selectedProjectId || !selectedHoleId) return;
    const recent = dispatches.filter(d => d.projectId === selectedProjectId && d.drillholeId === selectedHoleId).sort((a, b) => new Date(b.dispatchDate).getTime() - new Date(a.dispatchDate).getTime())[0];
    if (recent?.company) setFormData(f => ({ ...f, company: recent.company }));
    else setFormData(f => ({ ...f, company: '' }));
  }, [selectedProjectId, selectedHoleId, dispatches]);

  const [formData, setFormData] = useState<FormData>({ projectId: '', drillholeId: '', company: '', hqBoxes: 0, nqBoxes: 0, driver: '', technician: '', samplesCollected: 0, sampleType: '' });
  const [returnFormData, setReturnFormData] = useState<ReturnFormData>({ dispatchId: '', returnedHq: '', returnedNq: '', returnCondition: 'Good', returnNotes: '', driver: '', technician: '' });
  const [showMismatchWarning, setShowMismatchWarning] = useState(false);
  const [mismatchDetails, setMismatchDetails] = useState<MismatchDetails | null>(null);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [sampleFormData, setSampleFormData] = useState<SampleFormData>({ 
    dispatch_id: 0, 
    sample_id: '', 
    sample_type: 'core', 
    from_depth: undefined, 
    to_depth: undefined, 
    status: 'collected' 
  });
  // Backend entities for ID mapping
  const [backendProjects, setBackendProjects] = useState<any[]>([]);
  const [backendDrillholes, setBackendDrillholes] = useState<any[]>([]);
  const [backendCompanies, setBackendCompanies] = useState<any[]>([]);
  // Prefer human-readable names; fall back to code fields, then IDs
  const projectDisplayId = (p: any) => {
    if (!p) return '';
    return p.name || p.project_id || (p.id != null ? `PROJ-${p.id}` : '');
  };
  const drillholeDisplayId = (d: any) => {
    if (!d) return '';
    return d.drillhole_id || d.name || (d.id != null ? `DH-${d.id}` : '');
  };

  const stats = useMemo(() => {
    const inScope = (selectedProjectId && selectedHoleId) ? dispatches.filter(d => d.projectId === selectedProjectId && d.drillholeId === selectedHoleId) : [];
    const totalDispatched = inScope.reduce((acc, d) => ({ hq: acc.hq + d.hqBoxes, nq: acc.nq + d.nqBoxes, samples: acc.samples + d.samplesCollected }), { hq: 0, nq: 0, samples: 0 });
    const totalReturned = inScope.filter(d => d.status === 'returned').reduce((acc, d) => ({ hq: acc.hq + d.returnedHq, nq: acc.nq + d.returnedNq }), { hq: 0, nq: 0 });
    const outstanding = inScope.filter(d => d.status === 'outstanding');
    const outstandingTotal = outstanding.reduce((acc, d) => ({ hq: acc.hq + d.hqBoxes, nq: acc.nq + d.nqBoxes, samples: acc.samples + d.samplesCollected }), { hq: 0, nq: 0, samples: 0 });
    const completed = inScope.filter(d => d.status === 'returned');
    const matchRate = completed.length > 0 ? (completed.filter(d => d.hqBoxes === d.returnedHq && d.nqBoxes === d.returnedNq).length / completed.length * 100).toFixed(1) : '100';
    const globalOutstandingTotal = dispatches.filter(d => d.status === 'outstanding').reduce((acc, d) => ({ hq: acc.hq + d.hqBoxes, nq: acc.nq + d.nqBoxes }), { hq: 0, nq: 0 });
    const available = { hq: baseInventory.hq - globalOutstandingTotal.hq, nq: baseInventory.nq - globalOutstandingTotal.nq };
    return { totalDispatched, totalReturned, outstanding: outstanding.length, outstandingTotal, completed: completed.length, matchRate, available };
  }, [dispatches, baseInventory, selectedProjectId, selectedHoleId]);

  // Load backend projects and companies when backend is connected
  useEffect(() => {
    if (!useBackend) return;
    (async () => {
      try {
        const [projects, companies] = await Promise.all([
          projectsAPI.getAll(),
          companiesAPI.getAll(),
        ]);
        setBackendProjects(projects || []);
        setBackendCompanies(companies || []);
      } catch (err) {
        console.error('Failed to load backend projects/companies:', err);
      }
    })();
  }, [useBackend]);

  // Load backend drillholes when a project is selected
  useEffect(() => {
    if (!useBackend) return;
    if (!selectedProjectId) { setBackendDrillholes([]); return; }
    const proj = backendProjects.find((p) => projectDisplayId(p) === selectedProjectId);
    if (!proj) return;
    (async () => {
      try {
        const drillholes = await drillholesAPI.getAll(proj.id);
        setBackendDrillholes(drillholes || []);
      } catch (err) {
        console.error('Failed to load backend drillholes:', err);
      }
    })();
  }, [useBackend, selectedProjectId, backendProjects]);

  // Load backend samples
  useEffect(() => {
    if (!useBackend) return;
    (async () => {
      try {
        const backendSamples = await samplesAPI.getAll();
        const withBarcode = (backendSamples || []).map((s: Sample) => ({
          ...s,
          barcode: s.sample_id || String(s.id)
        }));
        setSamples(withBarcode);
      } catch (err) {
        console.error('Failed to load backend samples:', err);
      }
    })();
  }, [useBackend]);

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !selectedHoleId) {
      alert('Please select a Project and Drillhole.');
      return;
    }
    
    if (useBackend) {
      try {
        const proj = backendProjects.find((p) => projectDisplayId(p) === selectedProjectId);
        const hole = backendDrillholes.find((d) => drillholeDisplayId(d) === selectedHoleId);
        if (!proj || !hole) {
          alert('Selected project or drillhole not found in backend.');
          return;
        }
        // Map company name to backend company ID
        const company = backendCompanies.find((c) => c.name === formData.company);
        if (!company) {
          alert('Selected company not found in backend companies. Please ensure company exists.');
          return;
        }

        await dispatchesAPI.create({
          project_id: proj.id,
          drillhole_id: hole.id,
          company_id: company.id,
          hq_boxes: formData.hqBoxes,
          nq_boxes: formData.nqBoxes,
          driver: formData.driver,
          technician: formData.technician,
          samples_collected: formData.samplesCollected || 0,
          sample_type: formData.sampleType || '',
        });
        await refreshData();
      } catch (error) {
        console.error('Failed to create dispatch:', error);
        alert('Failed to create dispatch. Please try again.');
      }
    } else {
      const newDispatch: Dispatch = {
        id: dispatches.length + 1, 
        projectId: selectedProjectId, 
        drillholeId: selectedHoleId, 
        company: formData.company,
        hqBoxes: formData.hqBoxes,
        nqBoxes: formData.nqBoxes,
        driver: formData.driver,
        technician: formData.technician,
        samplesCollected: 0,
        sampleType: '',
        dispatchDate: new Date().toISOString(), 
        status: 'outstanding', 
        returnDate: null, 
        returnedHq: 0, 
        returnedNq: 0,
        returnCondition: null, 
        returnNotes: null, 
        returnDriver: null, 
        returnTechnician: null,
      };
      setMockDispatches([...mockDispatches, newDispatch]);
    }
    setFormData({ projectId: '', drillholeId: '', company: '', hqBoxes: 0, nqBoxes: 0, driver: '', technician: '', samplesCollected: 0, sampleType: '' });
  };

  const checkMismatch = () => {
    const dispatch = dispatches.find(d => d.id === parseInt(returnFormData.dispatchId));
    if (!dispatch) return false;
    const returnedHq = parseInt(returnFormData.returnedHq) || 0;
    const returnedNq = parseInt(returnFormData.returnedNq) || 0;
    if (dispatch.hqBoxes !== returnedHq || dispatch.nqBoxes !== returnedNq) {
      setMismatchDetails({ dispatch, returnedHq, returnedNq, hqDiff: dispatch.hqBoxes - returnedHq, nqDiff: dispatch.nqBoxes - returnedNq });
      return true;
    }
    return false;
  };

  const handleReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkMismatch()) {
      setShowMismatchWarning(true);
      return;
    }
    processReturn();
  };

  const processReturn = async () => {
    const dispatchId = parseInt(returnFormData.dispatchId);
    
    if (useBackend) {
      try {
        await dispatchesAPI.processReturn(dispatchId, {
          returned_hq: parseInt(returnFormData.returnedHq) || 0,
          returned_nq: parseInt(returnFormData.returnedNq) || 0,
          return_condition: returnFormData.returnCondition,
          return_notes: returnFormData.returnNotes,
          return_driver: returnFormData.driver,
          return_technician: returnFormData.technician,
        });
        await refreshData();
      } catch (error) {
        console.error('Failed to process return:', error);
        alert('Failed to process return. Please try again.');
        return;
      }
    } else {
      setMockDispatches(mockDispatches.map(d => d.id === dispatchId ? { 
        ...d, 
        status: 'returned' as const, 
        returnDate: new Date().toISOString(), 
        returnedHq: parseInt(returnFormData.returnedHq) || 0, 
        returnedNq: parseInt(returnFormData.returnedNq) || 0,
        returnCondition: returnFormData.returnCondition,
        returnNotes: returnFormData.returnNotes,
        returnDriver: returnFormData.driver,
        returnTechnician: returnFormData.technician
      } : d));
    }
    
    setReturnFormData({ dispatchId: '', returnedHq: '', returnedNq: '', returnCondition: 'Good', returnNotes: '', driver: '', technician: '' });
    setShowMismatchWarning(false);
    setMismatchDetails(null);
  };

  const handleSampleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (useBackend) {
      try {
        const newSample = await samplesAPI.create(sampleFormData);
        setSamples(prev => [...prev, { ...newSample, barcode: newSample.sample_id || String(newSample.id) }]);
      } catch (error) {
        console.error('Failed to create sample:', error);
        // Fallback to local state
        const mockSample: Sample = {
          id: samples.length + 1,
          ...sampleFormData,
          barcode: sampleFormData.sample_id || String(samples.length + 1),
          from_depth: sampleFormData.from_depth !== undefined ? Number(sampleFormData.from_depth as any) : undefined,
          to_depth: sampleFormData.to_depth !== undefined ? Number(sampleFormData.to_depth as any) : undefined,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setSamples(prev => [...prev, mockSample]);
      }
    } else {
      // Mock mode
      const mockSample: Sample = {
        id: samples.length + 1,
        ...sampleFormData,
        barcode: sampleFormData.sample_id || String(samples.length + 1),
        from_depth: sampleFormData.from_depth !== undefined ? Number(sampleFormData.from_depth as any) : undefined,
        to_depth: sampleFormData.to_depth !== undefined ? Number(sampleFormData.to_depth as any) : undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setSamples(prev => [...prev, mockSample]);
    }
    
    // Reset form
    setSampleFormData({ 
      dispatch_id: 0, 
      sample_id: '', 
      sample_type: 'core', 
      from_depth: undefined, 
      to_depth: undefined, 
      status: 'collected' 
    });
  };

  const uniqueProjectIds = useMemo(() => {
    if (useBackend && backendProjects.length) {
      return backendProjects.map(projectDisplayId).filter(Boolean).sort();
    }
    return Array.from(new Set(dispatches.map(d => d.projectId))).sort();
  }, [useBackend, backendProjects, dispatches]);
  const uniqueHoleIds = useMemo(() => {
    if (useBackend && backendDrillholes.length) {
      return backendDrillholes.map(drillholeDisplayId).filter(Boolean).sort();
    }
    return selectedProjectId ? Array.from(new Set(dispatches.filter(d => d.projectId === selectedProjectId).map(d => d.drillholeId))).sort() : [];
  }, [useBackend, backendDrillholes, dispatches, selectedProjectId]);
  const filteredDispatches = useMemo(() => (
    selectedProjectId && selectedHoleId
      ? dispatches.filter(d => d.projectId === selectedProjectId && d.drillholeId === selectedHoleId)
      : []
  ), [dispatches, selectedProjectId, selectedHoleId]);
  // Ensure Return tab shows outstanding dispatches even without filters
  const returnableDispatches = useMemo(() => (
    selectedProjectId && selectedHoleId
      ? dispatches.filter(d => d.projectId === selectedProjectId && d.drillholeId === selectedHoleId && d.status === 'outstanding')
      : dispatches.filter(d => d.status === 'outstanding')
  ), [dispatches, selectedProjectId, selectedHoleId]);
  const filteredSamples = useMemo(() => {
    if (!selectedProjectId && !selectedHoleId) return samples;
    
    // Filter samples by matching dispatch project/drillhole
    return samples.filter(sample => {
      const dispatch = dispatches.find(d => d.id === sample.dispatch_id);
      if (!dispatch) return false;
      
      const matchesProject = !selectedProjectId || dispatch.projectId === selectedProjectId;
      const matchesHole = !selectedHoleId || dispatch.drillholeId === selectedHoleId;
      
      return matchesProject && matchesHole;
    });
  }, [samples, selectedProjectId, selectedHoleId, dispatches]);

  const overdueCount = useMemo(() => dispatches.filter(d => d.status === 'outstanding' && (new Date().getTime() - new Date(d.dispatchDate).getTime()) / (1000 * 3600 * 24) > 10).length, [dispatches]);

  const handleNotificationClick = (projectId: string, drillholeId: string, dispatchId: number) => {
    setSelectedProjectId(projectId);
    setSelectedHoleId(drillholeId);
    setActiveTab('dashboard');
    setHighlightedDispatchId(dispatchId);
    setTimeout(() => setHighlightedDispatchId(null), 5000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isAdmin={isAdmin} />
      
      {/* Main Content - Add left padding on desktop to account for sidebar */}
      <div className="flex-1 flex flex-col lg:ml-0">
        <header className="bg-white shadow-md sticky top-0 z-30">
          <div className="container mx-auto px-3 sm:px-4 md:px-6">
            <div className="flex items-center justify-between h-16 md:h-20">
              {/* Left side: Title */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* <Package className="w-6 h-6 sm:w-8 sm:h-8 text-slate-800" />
                <h1 className="text-sm sm:text-xl md:text-2xl font-bold text-slate-800 truncate">
                  Core Processing
                </h1> */}
              </div>
              
              {/* Right side: User, Backend Status, Filters and Notifications */}
              <div className="flex items-center gap-2 sm:gap-4 text-[#000]">
                {/* User Menu */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                  <UserIcon className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{user?.username}</span>
                  <button
                    onClick={logout}
                    className="ml-2 p-1 hover:bg-gray-200 rounded-full"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                {/* Backend Status Indicator */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: useBackend ? '#dcfce7' : '#fee2e2', color: useBackend ? '#166534' : '#991b1b' }}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: useBackend ? '#22c55e' : '#ef4444' }}></div>
                  {useBackend ? 'Backend Connected' : 'Offline Mode'}
                </div>
                {/* Project Filter - Hidden on small mobile, shown as compact on medium */}
                <div className="relative hidden sm:block">
                  <Filter className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#000]" />
                  <select 
                    value={selectedProjectId} 
                    onChange={(e) => { setSelectedProjectId(e.target.value); setSelectedHoleId(''); }} 
                    className="pl-7 sm:pl-10 pr-2 sm:pr-4 py-1.5 sm:py-2 border-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white font-medium text-xs sm:text-sm"
                  >
                    <option value="">Project...</option>
                    {uniqueProjectIds.map(id => <option key={id} value={id}>{id}</option>)}
                  </select>
                </div>
                
                {/* Drillhole Filter - Hidden on small mobile, shown as compact on medium */}
                <div className="relative hidden md:block">
                  <Filter className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#000]" />
                  <select 
                    value={selectedHoleId} 
                    onChange={(e) => setSelectedHoleId(e.target.value)} 
                    disabled={!selectedProjectId} 
                    className="pl-7 sm:pl-10 pr-2 sm:pr-4 py-1.5 sm:py-2 border-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white font-medium text-xs sm:text-sm disabled:opacity-50"
                  >
                    <option value="">Hole...</option>
                    {uniqueHoleIds.map(id => <option key={id} value={id}>{id}</option>)}
                  </select>
                </div>
                
                {/* Notification Bell */}
                <button 
                  onClick={() => setShowNotifications(!showNotifications)} 
                  className="relative p-2 rounded-full hover:bg-slate-100"
                >
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                  {overdueCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
                      {overdueCount > 9 ? '9+' : overdueCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
            
            {/* Mobile Filters Row - Shown only on small screens */}
            <div className="sm:hidden pb-3 flex gap-2">
              <div className="relative flex-1">
                <Filter className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#000]" />
                <select 
                  value={selectedProjectId} 
                  onChange={(e) => { setSelectedProjectId(e.target.value); setSelectedHoleId(''); }} 
                  className="w-full pl-7 pr-2 py-1.5 border-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white font-medium text-xs"
                >
                  <option value="">Select Project...</option>
                  {uniqueProjectIds.map(id => <option key={id} value={id}>{id}</option>)}
                </select>
              </div>
              <div className="relative flex-1">
                <Filter className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#000]" />
                <select 
                  value={selectedHoleId} 
                  onChange={(e) => setSelectedHoleId(e.target.value)} 
                  disabled={!selectedProjectId} 
                  className="w-full pl-7 pr-2 py-1.5 border-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white font-medium text-xs disabled:opacity-50"
                >
                  <option value="">Select Hole...</option>
                  {uniqueHoleIds.map(id => <option key={id} value={id}>{id}</option>)}
                </select>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto p-3 md:p-6 flex-1 pb-20 lg:pb-6">{/* Extra padding for mobile nav */}
          {showNotifications && <Notifications dispatches={dispatches} onClose={() => setShowNotifications(false)} onNotificationClick={handleNotificationClick} />}
          
          {/* Admin users can access admin tab without project/hole selection */}
          {activeTab === 'admin' && isAdmin ? (
            <AdminDashboard currentUser={user} />
          ) : activeTab === 'return' ? (
            <ReturnForm
              dispatches={returnableDispatches}
              returnFormData={returnFormData}
              setReturnFormData={setReturnFormData}
              onSubmit={handleReturn}
              showMismatchWarning={showMismatchWarning}
              mismatchDetails={mismatchDetails}
              onCancelMismatch={() => setShowMismatchWarning(false)}
              onProceedMismatch={processReturn}
            />
          ) : selectedProjectId && selectedHoleId ? (
            <>
              {activeTab === 'dashboard' && <Dashboard stats={stats} dispatches={filteredDispatches} highlightedDispatchId={highlightedDispatchId} />}
              {activeTab === 'dispatch' && <DispatchForm formData={formData} setFormData={setFormData} onSubmit={handleDispatch} />}
              {activeTab === 'samples' && <Samples samples={filteredSamples} formData={sampleFormData} setFormData={setSampleFormData} onSubmit={handleSampleSubmit} selectedDispatchId={selectedDispatchId} filteredDispatches={filteredDispatches} />}
              {activeTab === 'reconciliation' && <Reconciliation dispatches={filteredDispatches} stats={stats} baseInventory={baseInventory} />}
              {activeTab === 'reports' && <Reports dispatches={filteredDispatches} stats={stats} />}
            </>
          ) : (
            <div className="text-center bg-white p-10 rounded-lg shadow-sm border">
              <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700">No Data to Display</h3>
              <p className="text-slate-500 mt-2">Please select a Project and a Hole ID from the filters above to view data.</p>
            </div>
          )}
        </main>
        
        {/* Mobile Bottom Navigation */}
        <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
};

export default TrayInventorySystem;
