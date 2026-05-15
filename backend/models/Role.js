const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  module: {
    type: String,
    required: true,
    enum: [
      'dashboard',
      'vehicles',
      'drivers',
      'trips',
      'inquiries',
      'expenses',
      'reports',
      'documents',
      'projectMaster',
      'fundFlow',
      'consultancyBill',
      'contractorBill',
      'tender',
      'wip',
      'property',
      'inout',
      'paymentSchedules',
      'vehicleLogbook',
      'hrm',
      'hrmEmployees',
      'hrmPayroll',
      'hrmLeave',
      'hrmAttendance',
      'hrmRecruitment',
      'userManagement',
      'roleManagement',
      'settings'
    ]
  },
  canView: { type: Boolean, default: false },
  canCreate: { type: Boolean, default: false },
  canEdit: { type: Boolean, default: false },
  canDelete: { type: Boolean, default: false },
  canExport: { type: Boolean, default: false },
  canApprove: { type: Boolean, default: false },
  canAssign: { type: Boolean, default: false },
}, { _id: true });

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Role name is required'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
    max: 10,
  },
  permissions: [permissionSchema],
  isSystem: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Pre-defined permissions for system roles
roleSchema.statics.getDefaultPermissions = function(roleName) {
  const defaults = {
    admin: [
      { module: 'dashboard', canView: true, canCreate: true, canEdit: true, canDelete: true, canExport: true },
      { module: 'vehicles', canView: true, canCreate: true, canEdit: true, canDelete: true, canExport: true },
      { module: 'drivers', canView: true, canCreate: true, canEdit: true, canDelete: true, canExport: true },
      { module: 'trips', canView: true, canCreate: true, canEdit: true, canDelete: true, canExport: true, canAssign: true },
      { module: 'inquiries', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
      { module: 'expenses', canView: true, canCreate: true, canEdit: true, canDelete: true, canExport: true },
      { module: 'reports', canView: true, canCreate: true, canEdit: true, canDelete: true, canExport: true },
      { module: 'documents', canView: true, canCreate: true, canEdit: true, canDelete: true },
      { module: 'projectMaster', canView: true, canCreate: true, canEdit: true, canDelete: true },
      { module: 'fundFlow', canView: true, canCreate: true, canEdit: true, canDelete: true },
      { module: 'consultancyBill', canView: true, canCreate: true, canEdit: true, canDelete: true },
      { module: 'contractorBill', canView: true, canCreate: true, canEdit: true, canDelete: true },
      { module: 'tender', canView: true, canCreate: true, canEdit: true, canDelete: true },
      { module: 'wip', canView: true, canCreate: true, canEdit: true, canDelete: true },
      { module: 'property', canView: true, canCreate: true, canEdit: true, canDelete: true },
      { module: 'inout', canView: true, canCreate: true, canEdit: true, canDelete: true },
      { module: 'paymentSchedules', canView: true, canCreate: true, canEdit: true, canDelete: true },
      { module: 'vehicleLogbook', canView: true, canCreate: true, canEdit: true, canDelete: true },
      { module: 'hrm', canView: true, canCreate: true, canEdit: true, canDelete: true },
      { module: 'hrmEmployees', canView: true, canCreate: true, canEdit: true, canDelete: true },
      { module: 'hrmPayroll', canView: true, canCreate: true, canEdit: true, canDelete: true },
      { module: 'hrmLeave', canView: true, canCreate: true, canEdit: true, canDelete: true },
      { module: 'hrmAttendance', canView: true, canCreate: true, canEdit: true, canDelete: true },
      { module: 'hrmRecruitment', canView: true, canCreate: true, canEdit: true, canDelete: true },
      { module: 'userManagement', canView: true, canCreate: true, canEdit: true, canDelete: true },
      { module: 'roleManagement', canView: true, canCreate: true, canEdit: true, canDelete: true },
      { module: 'settings', canView: true, canCreate: true, canEdit: true, canDelete: true },
    ],
    manager: [
      { module: 'dashboard', canView: true, canExport: true },
      { module: 'vehicles', canView: true, canCreate: true, canEdit: true },
      { module: 'drivers', canView: true, canCreate: true, canEdit: true },
      { module: 'trips', canView: true, canCreate: true, canEdit: true, canAssign: true },
      { module: 'inquiries', canView: true, canCreate: true, canEdit: true, canApprove: true },
      { module: 'expenses', canView: true, canCreate: true, canEdit: true },
      { module: 'reports', canView: true, canExport: true },
      { module: 'documents', canView: true, canCreate: true },
      { module: 'projectMaster', canView: true, canCreate: true, canEdit: true },
      { module: 'fundFlow', canView: true, canCreate: true, canEdit: true },
      { module: 'consultancyBill', canView: true, canCreate: true, canEdit: true },
      { module: 'contractorBill', canView: true, canCreate: true, canEdit: true },
      { module: 'tender', canView: true, canCreate: true, canEdit: true },
      { module: 'wip', canView: true, canCreate: true, canEdit: true },
      { module: 'property', canView: true, canCreate: true, canEdit: true },
      { module: 'inout', canView: true, canCreate: true, canEdit: true },
      { module: 'paymentSchedules', canView: true, canCreate: true },
      { module: 'vehicleLogbook', canView: true, canCreate: true, canEdit: true },
      { module: 'hrm', canView: true },
      { module: 'hrmEmployees', canView: true, canCreate: true, canEdit: true },
      { module: 'hrmPayroll', canView: true },
      { module: 'hrmLeave', canView: true, canCreate: true },
      { module: 'hrmAttendance', canView: true },
      { module: 'hrmRecruitment', canView: true },
    ],
    staff: [
      { module: 'inquiries', canView: true, canCreate: true },
      { module: 'trips', canView: true },
      { module: 'expenses', canView: true, canCreate: true },
    ],
    driver: [
      { module: 'trips', canView: true, canEdit: true },
      { module: 'expenses', canView: true, canCreate: true },
    ],
  };
  return defaults[roleName] || [];
};

module.exports = mongoose.model('Role', roleSchema);
