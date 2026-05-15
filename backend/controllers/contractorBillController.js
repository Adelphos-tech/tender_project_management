const ContractorBill = require('../models/ContractorBill');

exports.getStats = async (req, res) => {
    try {
        const bills = await ContractorBill.find();
        let totalBills = bills.length;
        let totalContractValueSum = 0;
        let pendingPayments = 0;
        let highVarianceCount = 0;

        // Using sets to just grab unique projects / contracts based on basic strings matching if needed
        const unqProjectsMap = new Map();

        bills.forEach(bill => {
            if (!unqProjectsMap.has(bill.projectName)) {
                unqProjectsMap.set(bill.projectName, bill.totalContractValue);
                totalContractValueSum += bill.totalContractValue;
            }

            if (bill.paymentStatus !== 'paid') {
                pendingPayments += (bill.paymentRequested - bill.amountPaid);
            }

            // High Variance if On-Site % differs significantly from Paper Bill % (e.g. > 15%)
            if (bill.totalContractValue > 0) {
                const paperBillPctRaw = (bill.paperBillAmount / bill.totalContractValue) * 100;
                const variance = Math.abs(bill.onSiteCompletionPct - paperBillPctRaw);
                if (variance > 15) {
                    highVarianceCount++;
                }
            }
        });

        res.status(200).json({
            success: true,
            stats: { totalBills, totalContractValue: totalContractValueSum, pendingPayments, highVarianceCount }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

exports.getAllBills = async (req, res) => {
    try {
        const bills = await ContractorBill.find().populate('createdBy', 'name email').sort({ createdAt: -1 });
        res.status(200).json({ success: true, bills });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const bill = await ContractorBill.findById(req.params.id).populate('createdBy', 'name email');
        if (!bill) return res.status(404).json({ success: false, message: 'Bill not found' });
        res.status(200).json({ success: true, bill });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

exports.createBill = async (req, res) => {
    try {
        const data = { ...req.body, createdBy: req.user.id };
        const bill = await ContractorBill.create(data);
        res.status(201).json({ success: true, bill });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

exports.updateBill = async (req, res) => {
    try {
        const bill = await ContractorBill.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!bill) return res.status(404).json({ success: false, message: 'Bill not found' });
        res.status(200).json({ success: true, bill });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

exports.deleteBill = async (req, res) => {
    try {
        const bill = await ContractorBill.findById(req.params.id);
        if (!bill) return res.status(404).json({ success: false, message: 'Bill not found' });
        await bill.deleteOne();
        res.status(200).json({ success: true, message: 'Bill deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

exports.recordPayment = async (req, res) => {
    try {
        const { amountToPay } = req.body;
        const bill = await ContractorBill.findById(req.params.id);
        
        if (!bill) return res.status(404).json({ success: false, message: 'Bill not found' });
        if (amountToPay <= 0) return res.status(400).json({ success: false, message: 'Invalid payment amount' });

        const newTotalPaid = bill.amountPaid + amountToPay;
        
        if (newTotalPaid >= bill.paymentRequested) {
            bill.paymentStatus = 'paid';
            bill.status = 'paid';
            bill.amountPaid = bill.paymentRequested;
        } else {
            bill.paymentStatus = 'partial';
            bill.amountPaid = newTotalPaid;
        }

        bill.paymentDate = new Date();
        await bill.save();

        res.status(200).json({ success: true, bill });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
