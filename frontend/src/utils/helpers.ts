import { Dispatch } from '../types';

export const formatDateTime = (dateString: string | null): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getDaysOut = (dispatchDate: string): number => {
  const dispatch = new Date(dispatchDate);
  const now = new Date();
  const days = Math.floor((now.getTime() - dispatch.getTime()) / (1000 * 60 * 60 * 24));
  return days;
};

export const exportToCSV = (dispatches: Dispatch[]): void => {
  const headers = [
    'Drillhole ID',
    'Company',
    'Dispatch Date',
    'HQ Boxes Dispatched',
    'NQ Boxes Dispatched',
    'Total Dispatched',
    'Driver',
    'Technician',
    'Samples Collected',
    'Sample Type',
    'Status',
    'Return Date',
    'HQ Boxes Returned',
    'NQ Boxes Returned',
    'Total Returned',
    'HQ Match',
    'NQ Match',
    'Condition',
    'Return Notes'
  ];

  const rows = dispatches.map(d => [
    d.drillholeId,
    d.company,
    new Date(d.dispatchDate).toLocaleString(),
    d.hqBoxes,
    d.nqBoxes,
    d.hqBoxes + d.nqBoxes,
    d.driver,
    d.technician,
    d.samplesCollected,
    d.sampleType,
    d.status,
    d.returnDate ? new Date(d.returnDate).toLocaleString() : 'N/A',
    d.returnedHq || 0,
    d.returnedNq || 0,
    (d.returnedHq || 0) + (d.returnedNq || 0),
    d.status === 'returned' ? (d.hqBoxes === d.returnedHq ? 'Yes' : 'No') : 'N/A',
    d.status === 'returned' ? (d.nqBoxes === d.returnedNq ? 'Yes' : 'No') : 'N/A',
    d.returnCondition || 'N/A',
    d.returnNotes || 'N/A'
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tray_inventory_report_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};
