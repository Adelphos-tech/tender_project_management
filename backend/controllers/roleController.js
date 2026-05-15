const Role = require('../models/Role');
const User = require('../models/User');

// @desc    Get all roles
// @route   GET /api/roles
// @access  Admin
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find({ isActive: true })
      .sort({ level: -1, name: 1 });
    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ message: 'Failed to fetch roles' });
  }
};

// @desc    Get single role
// @route   GET /api/roles/:id
// @access  Admin
exports.getRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json(role);
  } catch (error) {
    console.error('Error fetching role:', error);
    res.status(500).json({ message: 'Failed to fetch role' });
  }
};

// @desc    Create new role
// @route   POST /api/roles
// @access  Admin
exports.createRole = async (req, res) => {
  try {
    const { name, description, level, permissions } = req.body;

    // Check if role name already exists
    const existingRole = await Role.findOne({ name: name.trim() });
    if (existingRole) {
      return res.status(400).json({ message: 'Role name already exists' });
    }

    const role = await Role.create({
      name: name.trim(),
      description,
      level: level || 1,
      permissions: permissions || [],
      isSystem: false,
    });

    res.status(201).json(role);
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ message: 'Failed to create role' });
  }
};

// @desc    Update role
// @route   PUT /api/roles/:id
// @access  Admin
exports.updateRole = async (req, res) => {
  try {
    const { name, description, level, permissions, isActive } = req.body;

    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    // Don't allow updating system roles' names
    if (role.isSystem && name && name !== role.name) {
      return res.status(400).json({ message: 'Cannot modify system role name' });
    }

    // Check for duplicate name if changing name
    if (name && name !== role.name) {
      const existingRole = await Role.findOne({ name: name.trim() });
      if (existingRole) {
        return res.status(400).json({ message: 'Role name already exists' });
      }
    }

    const updatedRole = await Role.findByIdAndUpdate(
      req.params.id,
      {
        name: name ? name.trim() : role.name,
        description: description !== undefined ? description : role.description,
        level: level !== undefined ? level : role.level,
        permissions: permissions !== undefined ? permissions : role.permissions,
        isActive: isActive !== undefined ? isActive : role.isActive,
      },
      { new: true, runValidators: true }
    );

    res.json(updatedRole);
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ message: 'Failed to update role' });
  }
};

// @desc    Delete role
// @route   DELETE /api/roles/:id
// @access  Admin
exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    // Don't allow deleting system roles
    if (role.isSystem) {
      return res.status(400).json({ message: 'Cannot delete system role' });
    }

    // Check if any users are using this role
    const usersWithRole = await User.countDocuments({ role: role.name.toLowerCase() });
    if (usersWithRole > 0) {
      return res.status(400).json({
        message: `Cannot delete role. ${usersWithRole} user(s) are assigned to this role.`
      });
    }

    await Role.findByIdAndDelete(req.params.id);
    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({ message: 'Failed to delete role' });
  }
};

// @desc    Initialize system roles
// @route   POST /api/roles/init
// @access  Admin
exports.initializeRoles = async (req, res) => {
  try {
    const systemRoles = [
      {
        name: 'Admin',
        description: 'Full system access with all permissions',
        level: 10,
        isSystem: true,
        permissions: Role.getDefaultPermissions('admin'),
      },
      {
        name: 'Manager',
        description: 'Can manage daily operations and view reports',
        level: 7,
        isSystem: true,
        permissions: Role.getDefaultPermissions('manager'),
      },
      {
        name: 'Staff',
        description: 'Can create inquiries and manage basic operations',
        level: 4,
        isSystem: true,
        permissions: Role.getDefaultPermissions('staff'),
      },
      {
        name: 'Driver',
        description: 'Can view assigned trips and add expenses',
        level: 2,
        isSystem: true,
        permissions: Role.getDefaultPermissions('driver'),
      },
    ];

    const results = [];
    for (const roleData of systemRoles) {
      const existingRole = await Role.findOne({ name: roleData.name });
      if (!existingRole) {
        const role = await Role.create(roleData);
        results.push({ name: role.name, status: 'created' });
      } else {
        // Update permissions for system roles
        existingRole.permissions = roleData.permissions;
        await existingRole.save();
        results.push({ name: existingRole.name, status: 'updated' });
      }
    }

    res.json({ message: 'System roles initialized', results });
  } catch (error) {
    console.error('Error initializing roles:', error);
    res.status(500).json({ message: 'Failed to initialize roles' });
  }
};

// @desc    Get user permissions
// @route   GET /api/roles/my-permissions
// @access  Private
exports.getMyPermissions = async (req, res) => {
  try {
    const role = await Role.findOne({
      name: { $regex: new RegExp(`^${req.user.role}$`, 'i') },
      isActive: true
    });

    if (!role) {
      // Return default permissions based on user role
      return res.json({
        role: req.user.role,
        permissions: Role.getDefaultPermissions(req.user.role) || [],
      });
    }

    res.json({
      role: role.name,
      level: role.level,
      permissions: role.permissions,
    });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({ message: 'Failed to fetch permissions' });
  }
};

// @desc    Get available modules
// @route   GET /api/roles/modules
// @access  Admin
exports.getModules = async (req, res) => {
  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: 'HiOutlineHome', description: 'View system dashboard and analytics' },
    { id: 'vehicles', name: 'Vehicles', icon: 'HiOutlineTruck', description: 'Manage vehicle fleet' },
    { id: 'drivers', name: 'Drivers', icon: 'HiOutlineUsers', description: 'Manage driver profiles' },
    { id: 'trips', name: 'Trips', icon: 'HiOutlineMap', description: 'Manage trips and assignments' },
    { id: 'inquiries', name: 'Trip Inquiries', icon: 'HiOutlineClipboardList', description: 'Handle trip requests' },
    { id: 'expenses', name: 'Expenses', icon: 'HiOutlineCurrencyDollar', description: 'Track expenses' },
    { id: 'reports', name: 'Reports', icon: 'HiOutlineChartBar', description: 'View and generate reports' },
    { id: 'documents', name: 'Documents', icon: 'HiOutlineDocumentText', description: 'Manage documents' },
    { id: 'projectMaster', name: 'Project Master', icon: 'HiOutlineBriefcase', description: 'Project management', isParent: true },
    { id: 'fundFlow', name: 'Fund Flow', icon: 'HiOutlineCash', description: 'Track fund flow', parent: 'projectMaster' },
    { id: 'consultancyBill', name: 'Consultancy Bill', icon: 'HiOutlineDocumentText', description: 'Manage consultancy bills', parent: 'projectMaster' },
    { id: 'contractorBill', name: 'Contractor Bill', icon: 'HiOutlineIdentification', description: 'Manage contractor bills', parent: 'projectMaster' },
    { id: 'tender', name: 'Tender Management', icon: 'HiOutlineBriefcase', description: 'Track tender applications & EMD', parent: 'projectMaster' },
    { id: 'wip', name: 'WIP Projects', icon: 'HiOutlineClipboardList', description: 'Work in progress & RA bills', parent: 'projectMaster' },
    { id: 'property', name: 'Property List', icon: 'HiOutlineOfficeBuilding', description: 'Asset & property tracking', parent: 'projectMaster' },
    { id: 'inout', name: 'In-Out Register', icon: 'HiOutlineInboxIn', description: 'Inward/outward document register', parent: 'projectMaster' },
    { id: 'paymentSchedules', name: 'Payment Schedules', icon: 'HiOutlineCash', description: 'GST, TDS & scheduled payments', parent: 'projectMaster' },
    { id: 'vehicleLogbook', name: 'Vehicle Logbook', icon: 'HiOutlineTruck', description: 'Vehicle trip & expense log', parent: 'projectMaster' },
    { id: 'hrm', name: 'HRM Overview', icon: 'HiOutlineUserGroup', description: 'Human Resource Management', isParent: true },
    { id: 'hrmEmployees', name: 'Employees', icon: 'HiOutlineUsers', description: 'Manage employee records', parent: 'hrm' },
    { id: 'hrmPayroll', name: 'Payroll', icon: 'HiOutlineCurrencyDollar', description: 'Manage salaries and payslips', parent: 'hrm' },
    { id: 'hrmLeave', name: 'Leave Management', icon: 'HiOutlineCalendar', description: 'Manage leave requests', parent: 'hrm' },
    { id: 'hrmAttendance', name: 'Attendance', icon: 'HiOutlineClock', description: 'Track attendance and shifts', parent: 'hrm' },
    { id: 'hrmRecruitment', name: 'Recruitment', icon: 'HiOutlineBriefcase', description: 'Job postings and candidates', parent: 'hrm' },
    { id: 'userManagement', name: 'User Management', icon: 'HiOutlineUsers', description: 'Manage system users' },
    { id: 'roleManagement', name: 'Rights Management', icon: 'HiOutlineKey', description: 'Manage roles and permissions' },
    { id: 'settings', name: 'Settings', icon: 'HiOutlineCog', description: 'System settings' },
  ];

  res.json(modules);
};
