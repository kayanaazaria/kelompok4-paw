const express = require("express");
const Report = require("../models/Report");
const auth = require("../middleware/auth");
const router = express.Router();

// HSE buat laporan
router.post("/", auth("hse"), async (req, res) => {
  try {
    const report = new Report({
      ...req.body,
      createdBy: req.user.id
    });
    await report.save();
    res.json(report);
  } catch (err) {
    res.status(500).json({ msg: "Error creating report" });
  }
});

// Head of Department approve/reject
router.put("/:id/approve-head", auth("head_of_department"), async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ msg: "Report not found" });

    report.statusHead = req.body.status; // "approved" atau "rejected"
    await report.save();
    res.json(report);
  } catch (err) {
    res.status(500).json({ msg: "Error updating report" });
  }
});

// HR Director approve/reject
router.put("/:id/approve-hr", auth("hr_director"), async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ msg: "Report not found" });

    if (report.statusHead !== "approved") {
      return res.status(400).json({ msg: "Head of Department belum approve" });
    }

    report.statusHR = req.body.status;
    await report.save();
    res.json(report);
  } catch (err) {
    res.status(500).json({ msg: "Error updating report" });
  }
});

// Semua user bisa lihat daftar report
router.get("/", auth(), async (req, res) => {
  const reports = await Report.find().populate("createdBy", "name email role");
  res.json(reports);
});

module.exports = router;
