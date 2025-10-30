export interface Dispatch {
  id: number;
  projectId: string;
  drillholeId: string;
  company: string;
  dispatchDate: string;
  hqBoxes: number;
  nqBoxes: number;
  driver: string;
  technician: string;
  samplesCollected: number;
  sampleType: string;
  status: 'outstanding' | 'returned';
  returnDate: string | null;
  returnedHq: number;
  returnedNq: number;
  returnCondition: string | null;
  returnNotes: string | null;
  returnDriver: string | null;
  returnTechnician: string | null;
}

export interface FormData {
  projectId: string;
  drillholeId: string;
  company: string;
  hqBoxes: number;
  nqBoxes: number;
  driver: string;
  technician: string;
  samplesCollected: number;
  sampleType: string;
}

export interface ReturnFormData {
  dispatchId: string;
  returnedHq: string;
  returnedNq: string;
  returnCondition: string;
  returnNotes: string;
  driver: string;
  technician: string;
}

export interface MismatchDetails {
  dispatch: Dispatch;
  returnedHq: number;
  returnedNq: number;
  hqDiff: number;
  nqDiff: number;
}

export interface Stats {
  totalDispatched: {
    hq: number;
    nq: number;
    samples: number;
  };
  totalReturned: {
    hq: number;
    nq: number;
  };
  outstanding: number;
  outstandingTotal: {
    hq: number;
    nq: number;
    samples: number;
  };
  completed: number;
  matchRate: string;
  available: {
    hq: number;
    nq: number;
  };
}

export interface BaseInventory {
  hq: number;
  nq: number;
}
