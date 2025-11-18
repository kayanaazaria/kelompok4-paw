const Approval = require('../models/approvalModel');

// bikin approval baru
exports.createApproval = async (req, res) => {
  try {
    const approval = new Approval(req.body);
    await approval.save();
    res.status(201).json(approval);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ambil semua approval
exports.getApprovals = async (req, res) => {
  try {
    const approvals = await Approval.find().populate('userId', 'username email');
    res.json(approvals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update approval
exports.updateApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const approval = await Approval.findByIdAndUpdate(id, req.body, { new: true });
    if (!approval) return res.status(404).json({ message: 'Approval not found' });
    res.json(approval);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// hapus approval
exports.deleteApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const approval = await Approval.findByIdAndDelete(id);
    if (!approval) return res.status(404).json({ message: 'Approval not found' });
    res.json({ message: 'Approval deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
