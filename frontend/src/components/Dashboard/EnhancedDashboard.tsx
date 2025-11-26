import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Download, Filter, Calendar, User, Building2 } from "lucide-react";
import {
  format,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  parseISO,
} from "date-fns";
import * as XLSX from "xlsx";
import {
  dispatchService,
  reportService,
  companyService,
} from "../../api/services";
import { Dispatch } from "../../types";
import StatCard from "./StatCard";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

interface FilterState {
  technician: string;
  week: string;
  dateRange: { start: string; end: string };
  company: string;
}

const EnhancedDashboard: React.FC = () => {
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    technician: "",
    week: "",
    dateRange: { start: "", end: "" },
    company: "",
  });

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [dispatchesData, companiesData, statsData, analyticsData] =
        await Promise.all([
          dispatchService.getAll(),
          companyService.getAll(),
          reportService.getDashboardStats(),
          reportService.getAnalytics(),
        ]);

      setDispatches(dispatchesData);
      setCompanies(companiesData);
      setDashboardStats(statsData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique technicians
  const technicians = useMemo(() => {
    const unique = new Set(dispatches.map((d) => d.technician));
    return Array.from(unique).sort();
  }, [dispatches]);

  // Filter dispatches
  const filteredDispatches = useMemo(() => {
    return dispatches.filter((dispatch) => {
      // Filter by technician
      if (filters.technician && dispatch.technician !== filters.technician) {
        return false;
      }

      // Filter by company
      if (filters.company && dispatch.company_name !== filters.company) {
        return false;
      }

      const dispatchDate = parseISO(dispatch.dispatch_date);

      // Filter by week
      if (filters.week) {
        const weekStart = startOfWeek(parseISO(filters.week), {
          weekStartsOn: 1,
        });
        const weekEnd = endOfWeek(parseISO(filters.week), { weekStartsOn: 1 });
        if (
          !isWithinInterval(dispatchDate, { start: weekStart, end: weekEnd })
        ) {
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

  // Calculate filtered stats
  const filteredStats = useMemo(() => {
    const outstanding = filteredDispatches.filter(
      (d) => d.status === "outstanding"
    );
    const returned = filteredDispatches.filter((d) => d.status === "returned");

    const outstandingHq = outstanding.reduce((sum, d) => sum + d.hq_boxes, 0);
    const outstandingNq = outstanding.reduce((sum, d) => sum + d.nq_boxes, 0);
    const totalSamples = filteredDispatches.reduce(
      (sum, d) => sum + d.samples_collected,
      0
    );

    const perfectMatches = returned.filter(
      (d) => d.returned_hq === d.hq_boxes && d.returned_nq === d.nq_boxes
    ).length;
    const matchRate =
      returned.length > 0 ? (perfectMatches / returned.length) * 100 : 0;

    return {
      total: filteredDispatches.length,
      outstanding: outstanding.length,
      returned: returned.length,
      outstandingHq,
      outstandingNq,
      totalSamples,
      matchRate: matchRate.toFixed(1),
    };
  }, [filteredDispatches]);

  // Prepare chart data
  const dispatchesByCompany = useMemo(() => {
    const grouped = filteredDispatches.reduce((acc, dispatch) => {
      const company = dispatch.company_name || "Unknown";
      if (!acc[company]) {
        acc[company] = { company, count: 0, samples: 0 };
      }
      acc[company].count++;
      acc[company].samples += dispatch.samples_collected;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped);
  }, [filteredDispatches]);

  const dispatchesBySampleType = useMemo(() => {
    const grouped = filteredDispatches.reduce((acc, dispatch) => {
      const type = dispatch.sample_type || "Unknown";
      if (!acc[type]) {
        acc[type] = { type, count: 0 };
      }
      acc[type].count++;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped);
  }, [filteredDispatches]);

  const statusData = useMemo(() => {
    return [
      { name: "Outstanding", value: filteredStats.outstanding },
      { name: "Returned", value: filteredStats.returned },
    ];
  }, [filteredStats]);

  // Export to CSV
  const exportToCSV = () => {
    const csvData = filteredDispatches.map((d) => ({
      ID: d.id,
      Project: d.project_name || "",
      Drillhole: d.drillhole_name || "",
      Company: d.company_name || "",
      "Dispatch Date": format(parseISO(d.dispatch_date), "yyyy-MM-dd HH:mm"),
      "HQ Boxes": d.hq_boxes,
      "NQ Boxes": d.nq_boxes,
      Driver: d.driver,
      Technician: d.technician,
      "Samples Collected": d.samples_collected,
      "Sample Type": d.sample_type || "",
      Status: d.status,
      "Return Date": d.return_date
        ? format(parseISO(d.return_date), "yyyy-MM-dd HH:mm")
        : "",
      "Returned HQ": d.returned_hq || "",
      "Returned NQ": d.returned_nq || "",
      "Return Condition": d.return_condition || "",
      "Days Out": d.days_out || "",
    }));

    const csv = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dispatches_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  // Export to Excel
  const exportToExcel = () => {
    const excelData = filteredDispatches.map((d) => ({
      ID: d.id,
      Project: d.project_name || "",
      Drillhole: d.drillhole_name || "",
      Company: d.company_name || "",
      "Dispatch Date": format(parseISO(d.dispatch_date), "yyyy-MM-dd HH:mm"),
      "HQ Boxes": d.hq_boxes,
      "NQ Boxes": d.nq_boxes,
      Driver: d.driver,
      Technician: d.technician,
      "Samples Collected": d.samples_collected,
      "Sample Type": d.sample_type || "",
      Status: d.status,
      "Return Date": d.return_date
        ? format(parseISO(d.return_date), "yyyy-MM-dd HH:mm")
        : "",
      "Returned HQ": d.returned_hq || "",
      "Returned NQ": d.returned_nq || "",
      "Return Condition": d.return_condition || "",
      "Days Out": d.days_out || "",
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dispatches");
    XLSX.writeFile(wb, `dispatches_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
  };

  const clearFilters = () => {
    setFilters({
      technician: "",
      week: "",
      dateRange: { start: "", end: "" },
      company: "",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </h2>
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Technician Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Technician
            </label>
            <select
              value={filters.technician}
              onChange={(e) =>
                setFilters({ ...filters, technician: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 bg-white text-black"
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
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Building2 className="w-4 h-4 inline mr-1" />
              Company
            </label>
            <select
              value={filters.company}
              onChange={(e) =>
                setFilters({ ...filters, company: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 bg-white text-black"
            >
              <option value="">All Companies</option>
              {companies.map((company) => (
                <option key={company.id} value={company.name}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          {/* Week Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Week
            </label>
            <input
              type="week"
              value={filters.week}
              onChange={(e) => setFilters({ ...filters, week: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 bg-white text-black"
            />
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Date Range
            </label>
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
                className="flex-1 px-2 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 text-sm bg-white text-black"
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
                className="flex-1 px-2 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 text-sm bg-white text-black"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Dispatches"
          value={filteredStats.total}
          icon="📦"
          color="blue"
        />
        <StatCard
          title="Outstanding"
          value={filteredStats.outstanding}
          icon="⏳"
          color="yellow"
        />
        <StatCard
          title="Returned"
          value={filteredStats.returned}
          icon="✅"
          color="green"
        />
        <StatCard
          title="Match Rate"
          value={`${filteredStats.matchRate}%`}
          icon="🎯"
          color="purple"
        />
      </div>

      {/* Export Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Excel
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dispatches by Company */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            Dispatches by Company
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dispatchesByCompany}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="company"
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" name="Dispatches" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            Status Distribution
          </h3>
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
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Samples by Company */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            Samples by Company
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dispatchesByCompany}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="company"
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="samples" fill="#10b981" name="Samples" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Dispatches by Sample Type */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            Dispatches by Sample Type
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dispatchesBySampleType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.type}: ${entry.count}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {dispatchesBySampleType.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">
            Dispatch Records ({filteredDispatches.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                  Technician
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                  Dispatch Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                  HQ/NQ
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                  Samples
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                  Days Out
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredDispatches.slice(0, 20).map((dispatch) => (
                <tr key={dispatch.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                    {dispatch.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                    {dispatch.company_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {dispatch.technician}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {format(parseISO(dispatch.dispatch_date), "MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {dispatch.hq_boxes}/{dispatch.nq_boxes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {dispatch.samples_collected}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        dispatch.status === "outstanding"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {dispatch.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {dispatch.days_out || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredDispatches.length > 20 && (
          <div className="p-4 bg-slate-50 text-center text-sm text-slate-600">
            Showing 20 of {filteredDispatches.length} records
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedDashboard;
