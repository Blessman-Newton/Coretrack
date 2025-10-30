import React, { useState, useEffect, useMemo } from 'react';
import { Clock, CheckCircle, Beaker, TrendingUp, Filter, Download } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Stats } from '../../types';
import { StatCard } from './StatCard';
import { RecentActivity } from './RecentActivity';
import { Dispatch } from '../../types';
import { format, startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns';
import * as XLSX from 'xlsx';

interface DashboardProps {
  stats: Stats;
  dispatches: Dispatch[];
  highlightedDispatchId?: number | null;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const Dashboard: React.FC<DashboardProps> = ({ stats, dispatches, highlightedDispatchId }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    technician: '',
    week: '',
    dateRange: { start: '', end: '' },
    company: '',
  });

  // Get unique values for filters
  const technicians = useMemo(() => {
    const unique = new Set(dispatches.map((d) => d.technician));
    return Array.from(unique).sort();
  }, [dispatches]);

  const companies = useMemo(() => {
    const unique = new Set(dispatches.map((d) => d.company));
    return Array.from(unique).sort();
  }, [dispatches]);

  // Filter dispatches based on selected filters
  const filteredDispatches = useMemo(() => {
    return dispatches.filter((dispatch) => {
      // Filter by technician
      if (filters.technician && dispatch.technician !== filters.technician) {
        return false;
      }

      // Filter by company
      if (filters.company && dispatch.company !== filters.company) {
        return false;
      }

      const dispatchDate = parseISO(dispatch.dispatchDate);

      // Filter by week
      if (filters.week) {
        const weekStart = startOfWeek(parseISO(filters.week), { weekStartsOn: 1 });
        const weekEnd = endOfWeek(parseISO(filters.week), { weekStartsOn: 1 });
        if (!isWithinInterval(dispatchDate, { start: weekStart, end: weekEnd })) {
          return false;
        }
      }

      // Filter by date range
      if (filters.dateRange.start && filters.dateRange.end) {
        const start = parseISO(filters.dateRange.start);
        const end = parseISO(filters.dateRange.end);
        if (!isWithinInterval(dispatchDate, { start, end })) {
          return false;
        }
      }

      return true;
    });
  }, [dispatches, filters]);

  // Prepare chart data
  const dispatchesByCompany = useMemo(() => {
    const grouped = filteredDispatches.reduce((acc, dispatch) => {
      const company = dispatch.company || 'Unknown';
      if (!acc[company]) {
        acc[company] = { company, count: 0, samples: 0 };
      }
      acc[company].count++;
      acc[company].samples += dispatch.samplesCollected;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped).slice(0, 10); // Top 10 companies
  }, [filteredDispatches]);

  const statusData = useMemo(() => {
    const outstanding = filteredDispatches.filter((d) => d.status === 'outstanding').length;
    const returned = filteredDispatches.filter((d) => d.status === 'returned').length;
    return [
      { name: 'Outstanding', value: outstanding },
      { name: 'Returned', value: returned },
    ];
  }, [filteredDispatches]);

  const sampleTypeData = useMemo(() => {
    const grouped = filteredDispatches.reduce((acc, dispatch) => {
      const type = dispatch.sampleType || 'Unknown';
      if (!acc[type]) {
        acc[type] = { type, count: 0 };
      }
      acc[type].count++;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped);
  }, [filteredDispatches]);

  // Export to CSV
  const exportToCSV = () => {
    const csvData = filteredDispatches.map((d) => ({
      ID: d.id,
      Project: d.projectId,
      Drillhole: d.drillholeId,
      Company: d.company,
      'Dispatch Date': format(parseISO(d.dispatchDate), 'yyyy-MM-dd HH:mm'),
      'HQ Boxes': d.hqBoxes,
      'NQ Boxes': d.nqBoxes,
      Driver: d.driver,
      Technician: d.technician,
      'Samples Collected': d.samplesCollected,
      'Sample Type': d.sampleType || '',
      Status: d.status,
      'Return Date': d.returnDate ? format(parseISO(d.returnDate), 'yyyy-MM-dd HH:mm') : '',
      'Returned HQ': d.returnedHq || '',
      'Returned NQ': d.returnedNq || '',
      'Return Condition': d.returnCondition || '',
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map((row) => Object.values(row).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dispatches_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  // Export to Excel
  const exportToExcel = () => {
    const excelData = filteredDispatches.map((d) => ({
      ID: d.id,
      Project: d.projectId,
      Drillhole: d.drillholeId,
      Company: d.company,
      'Dispatch Date': format(parseISO(d.dispatchDate), 'yyyy-MM-dd HH:mm'),
      'HQ Boxes': d.hqBoxes,
      'NQ Boxes': d.nqBoxes,
      Driver: d.driver,
      Technician: d.technician,
      'Samples Collected': d.samplesCollected,
      'Sample Type': d.sampleType || '',
      Status: d.status,
      'Return Date': d.returnDate ? format(parseISO(d.returnDate), 'yyyy-MM-dd HH:mm') : '',
      'Returned HQ': d.returnedHq || '',
      'Returned NQ': d.returnedNq || '',
      'Return Condition': d.returnCondition || '',
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Dispatches');
    XLSX.writeFile(wb, `dispatches_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  const clearFilters = () => {
    setFilters({
      technician: '',
      week: '',
      dateRange: { start: '', end: '' },
      company: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          <div className="flex gap-2">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download className="w-4 h-4" />
              CSV
            </button>
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="w-4 h-4" />
              Excel
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Technician Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Technician</label>
              <select
                value={filters.technician}
                onChange={(e) => setFilters({ ...filters, technician: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Technicians</option>
                {technicians.map((tech) => (
                  <option key={tech} value={tech}>
                    {tech}
                  </option>
                ))}
              </select>
            </div>

            {/* Company Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
              <select
                value={filters.company}
                onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Companies</option>
                {companies.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>

            {/* Week Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Week</label>
              <input
                type="week"
                value={filters.week}
                onChange={(e) => setFilters({ ...filters, week: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      dateRange: { ...filters.dateRange, start: e.target.value },
                    })
                  }
                  className="flex-1 px-2 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      dateRange: { ...filters.dateRange, end: e.target.value },
                    })
                  }
                  className="flex-1 px-2 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {showFilters && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Outstanding"
          value={stats.outstanding}
          subtitle={`HQ: ${stats.outstandingTotal.hq} | NQ: ${stats.outstandingTotal.nq}`}
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          subtitle={`Match Rate: ${stats.matchRate}%`}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Total Samples"
          value={stats.totalDispatched.samples}
          subtitle={`Outstanding: ${stats.outstandingTotal.samples}`}
          icon={Beaker}
          color="purple"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dispatches by Company */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Dispatches by Company
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dispatchesByCompany}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="company" angle={-45} textAnchor="end" height={100} fontSize={12} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" name="Dispatches" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Samples by Company */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Samples by Company</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dispatchesByCompany}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="company" angle={-45} textAnchor="end" height={100} fontSize={12} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="samples" fill="#10b981" name="Samples" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sample Types Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Sample Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sampleTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.type}: ${entry.count}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {sampleTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivity dispatches={filteredDispatches} highlightedDispatchId={highlightedDispatchId} />
    </div>
  );
};

