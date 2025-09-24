const { buildFinalPdf } = require('../services/finalDoc.service');

// MOCK DATA SEMENTARA (tanpa DB)
const mockReports = [
  {
    _id: 'RPT-001',
    date: '2025-09-20T02:30:00.000Z',
    department: 'Electronical Assembly',
    employeeName: 'Bima Setia',
    employeeNip: 'E12345',
    injuryScale: 'RINGAN',
    description: 'Terserempet solder pada jari saat perakitan.',
    signFlow: [
      { step: 1, role: 'HSE',           status: 'APPROVED', userName: 'Sinta HSE', at: '2025-09-20T03:00:00.000Z' },
      { step: 2, role: 'KEPALA_BIDANG', status: 'PENDING' },
      { step: 3, role: 'DIREKTUR_SDM',  status: 'PENDING' }
    ],
    status: 'MENUNGGU_APPROVAL'
  }
];

function findReport(id) {
  return mockReports.find(r => r._id === id);
}

function inferStatusFromFlow(flow = []) {
  if (flow.some(s => s.status === 'REJECTED')) return 'DITOLAK';
  const last = flow[flow.length - 1] || {};
  if (last.status === 'APPROVED') return 'SELESAI';
  if (flow.some(s => s.status === 'PENDING')) return 'MENUNGGU_APPROVAL';
  return 'DRAFT';
}

// GET /finaldoc/reports -> daftar ringkas
async function listReports(req, res) {
  const list = mockReports.map(r => ({
    id: r._id,
    date: r.date,
    employeeName: r.employeeName,
    department: r.department,
    injuryScale: r.injuryScale,
    status: r.status || inferStatusFromFlow(r.signFlow)
  }));
  res.json(list);
}

// GET /finaldoc/reports/:id/history -> timeline tanda tangan
async function getHistory(req, res) {
  const r = findReport(req.params.id);
  if (!r) return res.status(404).json({ message: 'Report not found' });
  res.json({
    id: r._id,
    status: r.status || inferStatusFromFlow(r.signFlow),
    signFlow: r.signFlow
  });
}

// GET /finaldoc/reports/:id/final.pdf -> kirim PDF + QR
async function getFinalPdf(req, res) {
  const r = findReport(req.params.id);
  if (!r) return res.status(404).json({ message: 'Report not found' });
  // set qrLink default utk PDF
  const port = process.env.PORT || 5001;
  r.qrLink = r.qrLink || `http://localhost:${port}/finaldoc/reports/${r._id}/final.pdf`;

  const { pdfBuffer } = await buildFinalPdf(r);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="final-${r._id}.pdf"`);
  res.send(pdfBuffer);
}

module.exports = { listReports, getHistory, getFinalPdf };