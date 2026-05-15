const Project = require('../models/Project');
const PaymentInstallment = require('../models/PaymentInstallment');

// Auto-mark overdue installments across all active projects
const checkOverdueInstallments = async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        
        await PaymentInstallment.updateMany(
            { 
                status: 'pending', 
                dueDate: { $lt: today } 
            },
            { 
                $set: { status: 'overdue' } 
            }
        );
    } catch (error) {
        console.error('Error updating overdue installments:', error);
    }
};

// 1. Get stats
exports.getFundFlowStats = async (req, res) => {
    try {
        await checkOverdueInstallments();

        const totalProjectsCount = await Project.countDocuments({ status: { $ne: 'cancelled' } });
        
        const installments = await PaymentInstallment.find().populate('project');
        
        // Filter out installments for cancelled projects
        const activeInstallments = installments.filter(inst => inst.project && inst.project.status !== 'cancelled');

        let totalCollected = 0;
        let totalPending = 0;
        let overdueCount = 0;

        activeInstallments.forEach(inst => {
            if (inst.status === 'paid') {
                totalCollected += inst.amount;
            } else if (inst.status === 'pending') {
                totalPending += inst.amount;
            } else if (inst.status === 'overdue') {
                totalPending += inst.amount; // Overdue is technically pending money
                overdueCount++;
            }
        });

        res.status(200).json({
            success: true,
            stats: {
                totalProjects: totalProjectsCount,
                totalCollected,
                totalPending,
                overdueCount
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// 2. Create Project
exports.createProject = async (req, res) => {
    try {
        const { projectName, clientName, description, totalAmount, startDate, endDate, paymentMode, installmentsData } = req.body;

        if (!installmentsData || installmentsData.length === 0) {
            return res.status(400).json({ success: false, message: 'Installment data is required' });
        }

        const projectData = {
            projectName,
            clientName,
            description,
            totalAmount,
            startDate,
            paymentMode,
            totalInstallments: installmentsData.length,
            createdBy: req.user.id
        };

        if (endDate) {
            projectData.endDate = endDate;
        }

        const project = await Project.create(projectData);

        const installmentDocs = installmentsData.map((data, index) => ({
            project: project._id,
            installmentNo: index + 1,
            amount: data.amount,
            dueDate: data.dueDate,
            status: 'pending',
            createdBy: req.user.id
        }));

        await PaymentInstallment.insertMany(installmentDocs);

        res.status(201).json({ success: true, project });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// 3. Get All Projects (with summary)
exports.getAllProjects = async (req, res) => {
    try {
        await checkOverdueInstallments();

        const projects = await Project.find().sort({ createdAt: -1 });
        
        // Aggregate payment progress for each project
        const installments = await PaymentInstallment.find();
        
        const projectSummaries = projects.map(proj => {
            const projInstallments = installments.filter(inst => inst.project.toString() === proj._id.toString());
            
            let paidAmount = 0;
            let overdueCount = 0;
            
            projInstallments.forEach(inst => {
                if (inst.status === 'paid') paidAmount += inst.amount;
                if (inst.status === 'overdue') overdueCount++;
            });

            return {
                ...proj.toObject(),
                paidAmount,
                progressPercentage: proj.totalAmount > 0 ? Math.round((paidAmount / proj.totalAmount) * 100) : 0,
                overdueCount
            };
        });

        res.status(200).json({ success: true, projects: projectSummaries });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// 4. Get Project By ID (with installments)
exports.getProjectById = async (req, res) => {
    try {
        await checkOverdueInstallments();

        const project = await Project.findById(req.params.id).populate('createdBy', 'name');
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

        const installments = await PaymentInstallment.find({ project: project._id }).sort({ installmentNo: 1 });

        let paidAmount = 0;
        installments.forEach(inst => {
            if (inst.status === 'paid') paidAmount += inst.amount;
        });

        res.status(200).json({
            success: true,
            project: {
                ...project.toObject(),
                paidAmount,
                progressPercentage: project.totalAmount > 0 ? Math.round((paidAmount / project.totalAmount) * 100) : 0,
            },
            installments
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// 5. Update Project
exports.updateProject = async (req, res) => {
    try {
        const { projectName, clientName, description, status, endDate } = req.body;
        
        const updateData = { projectName, clientName, description, status };
        if (endDate) {
            updateData.endDate = endDate;
        } else {
            updateData.$unset = { endDate: 1 };
        }
        
        // Exclude totalAmount and paymentMode to prevent breaking existing installments
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

        res.status(200).json({ success: true, project });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// 6. Delete Project
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

        await PaymentInstallment.deleteMany({ project: project._id });
        await project.deleteOne();

        res.status(200).json({ success: true, message: 'Project deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// 7. Edit Installment
exports.updateInstallment = async (req, res) => {
    try {
        const { amount, dueDate, notes } = req.body;
        
        // Validate
        if (amount < 0) return res.status(400).json({ success: false, message: 'Amount cannot be negative' });

        const installment = await PaymentInstallment.findById(req.params.installmentId);
        if (!installment) return res.status(404).json({ success: false, message: 'Installment not found' });
        
        // Prevent editing paid installments
        if (installment.status === 'paid') {
            return res.status(400).json({ success: false, message: 'Cannot edit an already paid installment' });
        }

        installment.amount = amount ?? installment.amount;
        if (dueDate) installment.dueDate = dueDate;
        if (notes !== undefined) installment.notes = notes;

        // Reset to pending if it was overdue but due date is moved to future
        if (installment.status === 'overdue' && new Date(installment.dueDate) >= new Date().setHours(0,0,0,0)) {
            installment.status = 'pending';
        }

        await installment.save();

        res.status(200).json({ success: true, installment });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
}

// 8. Mark Installment Paid
exports.payInstallment = async (req, res) => {
    try {
        const installment = await PaymentInstallment.findById(req.params.installmentId);
        if (!installment) return res.status(404).json({ success: false, message: 'Installment not found' });

        if (installment.status === 'paid') {
            return res.status(400).json({ success: false, message: 'Installment already paid' });
        }

        installment.status = 'paid';
        installment.paidDate = new Date();
        installment.notes = req.body.notes || installment.notes;

        await installment.save();

        res.status(200).json({ success: true, installment });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
