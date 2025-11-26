import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Edit2,
  Trash2,
  Shield,
  AlertCircle,
  CheckCircle,
  FolderPlus,
  Drill,
} from "lucide-react";
import {
  userService,
  projectService,
  drillholeService,
  companyService,
} from "../../api/services";
import type { User } from "../../api/services/userService";
import type { Project } from "../../api/services/projectService";
import type { DrillholeWithDetails } from "../../api/services/drillholeService";
import type { Company } from "../../api/services/companyService";

interface AdminDashboardProps {
  currentUser: any;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
}) => {
  const [activeSection, setActiveSection] = useState<
    "users" | "projects" | "drillholes"
  >("users");
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [drillholes, setDrillholes] = useState<DrillholeWithDetails[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingDrillhole, setEditingDrillhole] =
    useState<DrillholeWithDetails | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    loadUsers();
    loadProjects();
    loadDrillholes();
    loadCompanies();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (error: any) {
      console.error("Failed to load users:", error);
      showMessage(
        "error",
        error.response?.data?.detail || "Failed to load users"
      );
    }
  };

  const loadProjects = async () => {
    try {
      const data = await projectService.getAll();
      setProjects(data);
    } catch (error: any) {
      console.error("Failed to load projects:", error);
      showMessage(
        "error",
        error.response?.data?.detail || "Failed to load projects"
      );
    }
  };

  const loadDrillholes = async () => {
    try {
      const data = await drillholeService.getAll();
      setDrillholes(data);
    } catch (error: any) {
      console.error("Failed to load drillholes:", error);
      showMessage(
        "error",
        error.response?.data?.detail || "Failed to load drillholes"
      );
    }
  };

  const loadCompanies = async () => {
    try {
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (error: any) {
      console.error("Failed to load companies:", error);
    }
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // User Management Functions
  const handleCreateUser = async (userData: any) => {
    try {
      setLoading(true);
      await userService.create(userData);
      showMessage("success", "User created successfully");
      loadUsers();
      setShowCreateModal(false);
    } catch (error: any) {
      showMessage(
        "error",
        error.response?.data?.detail || "Failed to create user"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (id: number, userData: any) => {
    try {
      setLoading(true);
      await userService.update(id, userData);
      showMessage("success", "User updated successfully");
      loadUsers();
      setEditingUser(null);
    } catch (error: any) {
      showMessage(
        "error",
        error.response?.data?.detail || "Failed to update user"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      setLoading(true);
      await userService.delete(id);
      showMessage("success", "User deleted successfully");
      loadUsers();
    } catch (error: any) {
      showMessage(
        "error",
        error.response?.data?.detail || "Failed to delete user"
      );
    } finally {
      setLoading(false);
    }
  };

  // Project Management Functions
  const handleCreateProject = async (projectData: any) => {
    try {
      setLoading(true);
      await projectService.create(projectData);
      showMessage("success", "Project created successfully");
      loadProjects();
      setShowCreateModal(false);
    } catch (error: any) {
      showMessage(
        "error",
        error.response?.data?.detail || "Failed to create project"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProject = async (id: number, projectData: any) => {
    try {
      setLoading(true);
      await projectService.update(id, projectData);
      showMessage("success", "Project updated successfully");
      loadProjects();
      setEditingProject(null);
    } catch (error: any) {
      showMessage(
        "error",
        error.response?.data?.detail || "Failed to update project"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      setLoading(true);
      await projectService.delete(id);
      showMessage("success", "Project deleted successfully");
      loadProjects();
    } catch (error: any) {
      showMessage(
        "error",
        error.response?.data?.detail || "Failed to delete project"
      );
    } finally {
      setLoading(false);
    }
  };

  // Drillhole Management Functions
  const handleCreateDrillhole = async (drillholeData: any) => {
    try {
      setLoading(true);
      await drillholeService.create({
        ...drillholeData,
        project_id: parseInt(drillholeData.project_id),
        depth: drillholeData.depth
          ? parseFloat(drillholeData.depth)
          : undefined,
      });
      showMessage("success", "Drillhole created successfully");
      loadDrillholes();
      setShowCreateModal(false);
    } catch (error: any) {
      showMessage(
        "error",
        error.response?.data?.detail || "Failed to create drillhole"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDrillhole = async (id: number, drillholeData: any) => {
    try {
      setLoading(true);
      await drillholeService.update(id, {
        ...drillholeData,
        depth: drillholeData.depth
          ? parseFloat(drillholeData.depth)
          : undefined,
      });
      showMessage("success", "Drillhole updated successfully");
      loadDrillholes();
      setEditingDrillhole(null);
    } catch (error: any) {
      showMessage(
        "error",
        error.response?.data?.detail || "Failed to update drillhole"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDrillhole = async (id: number) => {
    if (!confirm("Are you sure you want to delete this drillhole?")) return;
    try {
      setLoading(true);
      await drillholeService.delete(id);
      showMessage("success", "Drillhole deleted successfully");
      loadDrillholes();
    } catch (error: any) {
      showMessage(
        "error",
        error.response?.data?.detail || "Failed to delete drillhole"
      );
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "manager":
        return "bg-amber-100 text-amber-800";
      case "operator":
        return "bg-green-100 text-green-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Shield className="w-8 h-8" />
            Admin Dashboard
          </h2>
          <p className="text-slate-600 mt-1">
            Manage users, projects, and drillholes
          </p>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg flex items-start gap-3 ${
            message.type === "success"
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <p
            className={`text-sm ${
              message.type === "success" ? "text-green-800" : "text-red-800"
            }`}
          >
            {message.text}
          </p>
        </div>
      )}

      {/* Section Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveSection("users")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeSection === "users"
              ? "border-b-2 border-slate-800 text-slate-800"
              : "text-slate-600 hover:text-slate-800"
          }`}
        >
          <Users className="w-5 h-5 inline mr-2" />
          Users
        </button>
        <button
          onClick={() => setActiveSection("projects")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeSection === "projects"
              ? "border-b-2 border-slate-800 text-slate-800"
              : "text-slate-600 hover:text-slate-800"
          }`}
        >
          <FolderPlus className="w-5 h-5 inline mr-2" />
          Projects
        </button>
        <button
          onClick={() => setActiveSection("drillholes")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeSection === "drillholes"
              ? "border-b-2 border-slate-800 text-slate-800"
              : "text-slate-600 hover:text-slate-800"
          }`}
        >
          <Drill className="w-5 h-5 inline mr-2" />
          Drillholes
        </button>
      </div>

      {/* Users Section */}
      {activeSection === "users" && (
        <>
          <div className="flex justify-end">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
              disabled={loading}
            >
              <UserPlus className="w-5 h-5" />
              Add User
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-800">
                User Management
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                      Full Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-800">
                          {user.username}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {user.full_name || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="text-slate-600 hover:text-slate-800 transition-colors"
                            title="Edit"
                            disabled={loading}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Delete"
                            disabled={loading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Projects Section */}
      {activeSection === "projects" && (
        <>
          <div className="flex justify-end">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
              disabled={loading}
            >
              <FolderPlus className="w-5 h-5" />
              Add Project
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-800">
                Project Management
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                      Project ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-800">
                          {project.project_id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                        {project.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {project.location || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            project.status === "active"
                              ? "bg-green-100 text-green-800"
                              : project.status === "completed"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {new Date(project.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingProject(project)}
                            className="text-slate-600 hover:text-slate-800 transition-colors"
                            title="Edit"
                            disabled={loading}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Delete"
                            disabled={loading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Drillholes Section */}
      {activeSection === "drillholes" && (
        <>
          <div className="flex justify-end">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
              disabled={loading}
            >
              <Drill className="w-5 h-5" />
              Add Drillhole
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-800">
                Drillhole Management
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                      Drillhole ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                      Depth (m)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {drillholes.map((drillhole) => (
                    <tr key={drillhole.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-800">
                          {drillhole.drillhole_id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                        {drillhole.project_name || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {drillhole.depth
                          ? Number(drillhole.depth).toFixed(2)
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            drillhole.status === "active"
                              ? "bg-green-100 text-green-800"
                              : drillhole.status === "completed"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {drillhole.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {new Date(drillhole.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingDrillhole(drillhole)}
                            className="text-slate-600 hover:text-slate-800 transition-colors"
                            title="Edit"
                            disabled={loading}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDrillhole(drillhole.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Delete"
                            disabled={loading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modals */}
      {showCreateModal && activeSection === "users" && (
        <UserModal
          user={null}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateUser}
          loading={loading}
        />
      )}
      {editingUser && (
        <UserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSubmit={(userData) => handleUpdateUser(editingUser.id, userData)}
          loading={loading}
        />
      )}

      {showCreateModal && activeSection === "projects" && (
        <ProjectModal
          project={null}
          companies={companies}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateProject}
          loading={loading}
        />
      )}
      {editingProject && (
        <ProjectModal
          project={editingProject}
          companies={companies}
          onClose={() => setEditingProject(null)}
          onSubmit={(projectData) =>
            handleUpdateProject(editingProject.id, projectData)
          }
          loading={loading}
        />
      )}

      {showCreateModal && activeSection === "drillholes" && (
        <DrillholeModal
          drillhole={null}
          projects={projects}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateDrillhole}
          loading={loading}
        />
      )}
      {editingDrillhole && (
        <DrillholeModal
          drillhole={editingDrillhole}
          projects={projects}
          onClose={() => setEditingDrillhole(null)}
          onSubmit={(drillholeData) =>
            handleUpdateDrillhole(editingDrillhole.id, drillholeData)
          }
          loading={loading}
        />
      )}
    </div>
  );
};

// User Modal Component
interface UserModalProps {
  user: User | null;
  onClose: () => void;
  onSubmit: (userData: any) => void;
  loading: boolean;
}

const UserModal: React.FC<UserModalProps> = ({
  user,
  onClose,
  onSubmit,
  loading,
}) => {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    full_name: user?.full_name || "",
    role: user?.role || "operator",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = { ...formData };
    if (user && !submitData.password) {
      delete submitData.password;
    }
    onSubmit(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-xl font-bold text-slate-800">
            {user ? "Edit User" : "Create New User"}
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-black"
              required
              disabled={!!user}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value as any })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-black"
              required
            >
              <option value="operator">Operator</option>
              <option value="manager">Manager</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password {user && "(leave blank to keep current)"}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-black"
              required={!user}
              minLength={6}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 font-medium transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:bg-slate-400 font-medium transition-colors"
              disabled={loading}
            >
              {loading ? "Saving..." : user ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Project Modal Component
interface ProjectModalProps {
  project: Project | null;
  companies: Company[];
  onClose: () => void;
  onSubmit: (projectData: any) => void;
  loading: boolean;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  companies,
  onClose,
  onSubmit,
  loading,
}) => {
  const [formData, setFormData] = useState({
    project_id: project?.project_id || "",
    name: project?.name || "",
    company_id: project?.company_id?.toString() || "",
    location: project?.location || "",
    status: project?.status || "active",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      company_id: parseInt(formData.company_id),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-xl font-bold text-slate-800">
            {project ? "Edit Project" : "Create New Project"}
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Project ID
            </label>
            <input
              type="text"
              value={formData.project_id}
              onChange={(e) =>
                setFormData({ ...formData, project_id: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-black"
              placeholder="e.g., PROJ-001"
              required
              disabled={!!project}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-black"
              placeholder="e.g., Mining Project Alpha"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Company
            </label>
            <select
              value={formData.company_id}
              onChange={(e) =>
                setFormData({ ...formData, company_id: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-black"
              required
            >
              <option value="">Select Company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-black"
              placeholder="e.g., Site A, Region B"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as any })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-black"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 font-medium transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:bg-slate-400 font-medium transition-colors"
              disabled={loading}
            >
              {loading ? "Saving..." : project ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Drillhole Modal Component
interface DrillholeModalProps {
  drillhole: DrillholeWithDetails | null;
  projects: Project[];
  onClose: () => void;
  onSubmit: (drillholeData: any) => void;
  loading: boolean;
}

const DrillholeModal: React.FC<DrillholeModalProps> = ({
  drillhole,
  projects,
  onClose,
  onSubmit,
  loading,
}) => {
  const [formData, setFormData] = useState({
    drillhole_id: drillhole?.drillhole_id || "",
    project_id: drillhole?.project_id?.toString() || "",
    depth: drillhole?.depth?.toString() || "",
    status: drillhole?.status || "active",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-xl font-bold text-slate-800">
            {drillhole ? "Edit Drillhole" : "Create New Drillhole"}
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Drillhole ID
            </label>
            <input
              type="text"
              value={formData.drillhole_id}
              onChange={(e) =>
                setFormData({ ...formData, drillhole_id: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-black"
              placeholder="e.g., DH-001"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Project
            </label>
            <select
              value={formData.project_id}
              onChange={(e) =>
                setFormData({ ...formData, project_id: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-black"
              required
            >
              <option value="">Select Project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name} ({project.project_id})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Depth (m)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.depth}
              onChange={(e) =>
                setFormData({ ...formData, depth: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-black"
              placeholder="e.g., 150.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as any })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-black"
              required
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="abandoned">Abandoned</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 font-medium transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:bg-slate-400 font-medium transition-colors"
              disabled={loading}
            >
              {loading ? "Saving..." : drillhole ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
