'use client';

import { useState, useEffect } from 'react';
import { roleApi } from '@/api/roleApi';
import { Role, Permission, Module } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import toast from 'react-hot-toast';
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineShieldCheck,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineExclamation,
  HiOutlineKey,
  HiOutlineUsers,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlinePlusCircle,
  HiOutlinePencilAlt,
  HiOutlineDownload,
  HiOutlineCheckCircle,
  HiOutlineUserAdd,
} from 'react-icons/hi';

interface PermissionState extends Permission {
  isEditing?: boolean;
}

export default function RightsManagementPage() {
  const { hasPermission } = useAuth();
  const { t } = useLanguage();
  const [roles, setRoles] = useState<Role[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions'>('roles');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    level: 1,
    permissions: [] as Permission[],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rolesData, modulesData] = await Promise.all([
        roleApi.getRoles(),
        roleApi.getModules(),
      ]);
      setRoles(rolesData);
      setModules(modulesData);
    } catch (error) {
      toast.error('Failed to load roles and permissions');
    } finally {
      setLoading(false);
    }
  };

  const initializeSystemRoles = async () => {
    try {
      const result = await roleApi.initializeRoles();
      toast.success('System roles initialized');
      fetchData();
    } catch (error) {
      toast.error('Failed to initialize roles');
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await roleApi.createRole(formData);
      toast.success('Role created successfully');
      setShowCreateModal(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create role');
    }
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRole) return;

    try {
      await roleApi.updateRole(editingRole._id, formData);
      toast.success('Role updated successfully');
      setEditingRole(null);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDeleteRole = async (roleId: string, roleName: string) => {
    if (!confirm(`Are you sure you want to delete the role "${roleName}"?`)) return;

    try {
      await roleApi.deleteRole(roleId);
      toast.success('Role deleted successfully');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete role');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      level: 1,
      permissions: [],
    });
  };

  const openEditModal = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description || '',
      level: role.level,
      permissions: role.permissions || [],
    });
  };

  const updatePermission = (module: string, action: keyof Permission, value: boolean) => {
    setFormData((prev) => {
      const existingPermission = prev.permissions.find((p) => p.module === module);
      if (existingPermission) {
        return {
          ...prev,
          permissions: prev.permissions.map((p) =>
            p.module === module ? { ...p, [action]: value } : p
          ),
        };
      } else {
        return {
          ...prev,
          permissions: [
            ...prev.permissions,
            { module, canView: action === 'canView' ? value : false, canCreate: action === 'canCreate' ? value : false, canEdit: action === 'canEdit' ? value : false, canDelete: action === 'canDelete' ? value : false },
          ],
        };
      }
    });
  };

  const hasModulePermission = (module: string, action: keyof Permission): boolean => {
    const permission = formData.permissions.find((p) => p.module === module);
    return permission ? !!permission[action] : false;
  };

  const getRoleLevelColor = (level: number) => {
    if (level >= 9) return 'bg-purple-100 text-purple-700 border-purple-200';
    if (level >= 7) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (level >= 5) return 'bg-green-100 text-green-700 border-green-200';
    if (level >= 3) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getRoleLevelLabel = (level: number) => {
    if (level >= 9) return 'Super Admin';
    if (level >= 7) return 'Manager';
    if (level >= 5) return 'Senior';
    if (level >= 3) return 'Standard';
    return 'Basic';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <HiOutlineShieldCheck size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Rights Management</h1>
                <p className="text-slate-500 text-sm mt-0.5">Manage roles, permissions, and access levels</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={initializeSystemRoles}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all"
              >
                <HiOutlineKey size={18} />
                Reset to Defaults
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25 transition-all"
              >
                <HiOutlinePlus size={18} />
                Create Role
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 mt-6 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('roles')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'roles'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <HiOutlineUsers size={18} />
              Roles
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'permissions'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <HiOutlineLockClosed size={18} />
              Permission Matrix
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'roles' ? (
          roles.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiOutlineUsers size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Roles Found</h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">Get started by creating custom roles or initialize the default system roles (Admin, Manager, Staff, Driver).</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors w-full sm:w-auto justify-center"
                >
                  <HiOutlinePlus size={18} />
                  Create Custom Role
                </button>
                <button
                  onClick={initializeSystemRoles}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors w-full sm:w-auto justify-center"
                >
                  <HiOutlineKey size={18} />
                  Initialize System Roles
                </button>
              </div>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {roles.map((role) => (
              <div
                key={role._id}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          role.isSystem
                            ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                            : 'bg-gradient-to-br from-slate-500 to-slate-600'
                        }`}
                      >
                        {role.isSystem ? (
                          <HiOutlineShieldCheck size={20} className="text-white" />
                        ) : (
                          <HiOutlineUsers size={20} className="text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{role.name}</h3>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border mt-1 ${
                            getRoleLevelColor(role.level)
                          }`}
                        >
                          Level {role.level} • {getRoleLevelLabel(role.level)}
                        </span>
                      </div>
                    </div>
                    {!role.isSystem && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(role)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <HiOutlinePencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteRole(role._id, role.name)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <HiOutlineTrash size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                  {role.description && (
                    <p className="text-sm text-slate-500 mt-3">{role.description}</p>
                  )}
                </div>

                {/* Permissions Preview */}
                <div className="p-6">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                    Permissions
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {role.permissions?.slice(0, 6).map((permission) => (
                      <div
                        key={permission.module}
                        className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg"
                      >
                        <span className="text-sm text-slate-700 capitalize">
                          {permission.module.replace(/-/g, ' ')}
                        </span>
                        <div className="flex items-center gap-1">
                          {permission.canView && (
                            <span className="p-1 text-green-600 bg-green-100 rounded" title="View">
                              <HiOutlineEye size={12} />
                            </span>
                          )}
                          {permission.canCreate && (
                            <span className="p-1 text-blue-600 bg-blue-100 rounded" title="Create">
                              <HiOutlinePlusCircle size={12} />
                            </span>
                          )}
                          {permission.canEdit && (
                            <span className="p-1 text-amber-600 bg-amber-100 rounded" title="Edit">
                              <HiOutlinePencilAlt size={12} />
                            </span>
                          )}
                          {permission.canDelete && (
                            <span className="p-1 text-red-600 bg-red-100 rounded" title="Delete">
                              <HiOutlineTrash size={12} />
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {role.permissions?.length > 6 && (
                      <div className="text-center text-sm text-slate-400 py-2">
                        +{role.permissions.length - 6} more permissions
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      {role.permissions?.length || 0} permissions
                    </span>
                    {role.isSystem && (
                      <span className="flex items-center gap-1 text-amber-600 font-medium">
                        <HiOutlineLockClosed size={14} />
                        System Role
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          )
        ) : (
          /* Permission Matrix View */
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {roles.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HiOutlineShieldCheck size={32} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Roles Available</h3>
                <p className="text-slate-500 mb-4">Initialize system roles to view the permission matrix</p>
                <button
                  onClick={initializeSystemRoles}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  <HiOutlineKey size={18} />
                  Initialize System Roles
                </button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 sticky left-0 bg-slate-50 z-10">
                          Module
                        </th>
                        {roles.map((role) => (
                          <th
                            key={role._id}
                            className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-3 min-w-[100px]"
                          >
                            <div className="truncate max-w-[100px]" title={role.name}>
                              {role.name}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {modules.map((module) => (
                        <tr key={module.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 sticky left-0 bg-white z-10">
                            <div>
                              <span className="text-slate-700 font-medium text-sm">{module.name}</span>
                              {module.description && (
                                <p className="text-xs text-slate-400 mt-0.5">{module.description}</p>
                              )}
                            </div>
                          </td>
                          {roles.map((role) => {
                            const permission = role.permissions?.find((p) => p.module === module.id);
                            const hasAnyPermission = permission?.canView || permission?.canCreate || permission?.canEdit || permission?.canDelete;
                            return (
                              <td key={`${role._id}-${module.id}`} className="px-3 py-3">
                                <div className="flex justify-center gap-1 flex-wrap">
                                  {hasAnyPermission ? (
                                    <>
                                      {permission?.canView && (
                                        <span className="w-2 h-2 rounded-full bg-green-500" title="View" />
                                      )}
                                      {permission?.canCreate && (
                                        <span className="w-2 h-2 rounded-full bg-blue-500" title="Create" />
                                      )}
                                      {permission?.canEdit && (
                                        <span className="w-2 h-2 rounded-full bg-amber-500" title="Edit" />
                                      )}
                                      {permission?.canDelete && (
                                        <span className="w-2 h-2 rounded-full bg-red-500" title="Delete" />
                                      )}
                                    </>
                                  ) : (
                                    <span className="text-slate-300 text-xs">—</span>
                                  )}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-slate-600">View</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-slate-600">Create</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-slate-600">Edit</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-slate-600">Delete</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingRole) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-8">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => {
                setShowCreateModal(false);
                setEditingRole(null);
                resetForm();
              }}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <HiOutlineShieldCheck size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {editingRole ? 'Edit Role' : 'Create New Role'}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {editingRole ? 'Modify role permissions' : 'Define a new role with permissions'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingRole(null);
                    resetForm();
                  }}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <HiOutlineX size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <form
                onSubmit={editingRole ? handleUpdateRole : handleCreateRole}
                className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]"
              >
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Role Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        placeholder="e.g., Supervisor"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Access Level *
                      </label>
                      <select
                        required
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                          <option key={level} value={level}>
                            Level {level} - {getRoleLevelLabel(level)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                      placeholder="Describe the responsibilities of this role..."
                    />
                  </div>

                  {/* Permissions Grid */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-4">
                      Permissions
                    </label>
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 sticky left-0 bg-slate-50">
                                Module
                              </th>
                              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-3">
                                View
                              </th>
                              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-3">
                                Create
                              </th>
                              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-3">
                                Edit
                              </th>
                              <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-3">
                                Delete
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {modules.map((module) => (
                              <tr key={module.id} className="hover:bg-slate-50/50">
                                <td className="px-4 py-3 sticky left-0 bg-white">
                                  <div>
                                    <span className="text-slate-700 font-medium">{module.name}</span>
                                    {module.description && (
                                      <p className="text-xs text-slate-400">{module.description}</p>
                                    )}
                                  </div>
                                </td>
                                <td className="px-3 py-3">
                                  <div className="flex justify-center">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={hasModulePermission(module.id, 'canView')}
                                        onChange={(e) => updatePermission(module.id, 'canView', e.target.checked)}
                                        className="sr-only peer"
                                      />
                                      <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
                                    </label>
                                  </div>
                                </td>
                                <td className="px-3 py-3">
                                  <div className="flex justify-center">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={hasModulePermission(module.id, 'canCreate')}
                                        onChange={(e) => updatePermission(module.id, 'canCreate', e.target.checked)}
                                        className="sr-only peer"
                                      />
                                      <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
                                    </label>
                                  </div>
                                </td>
                                <td className="px-3 py-3">
                                  <div className="flex justify-center">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={hasModulePermission(module.id, 'canEdit')}
                                        onChange={(e) => updatePermission(module.id, 'canEdit', e.target.checked)}
                                        className="sr-only peer"
                                      />
                                      <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
                                    </label>
                                  </div>
                                </td>
                                <td className="px-3 py-3">
                                  <div className="flex justify-center">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={hasModulePermission(module.id, 'canDelete')}
                                        onChange={(e) => updatePermission(module.id, 'canDelete', e.target.checked)}
                                        className="sr-only peer"
                                      />
                                      <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
                                    </label>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingRole(null);
                      resetForm();
                    }}
                    className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2"
                  >
                    <HiOutlineCheck size={18} />
                    {editingRole ? 'Update Role' : 'Create Role'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
