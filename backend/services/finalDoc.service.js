// backend/services/finalDoc.service.js
const Report   = require('../models/Report');
const Approval = require('../models/Approval');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const { mapReportFromAPI } = require('./finalDoc.adapter');

// DB UTILITIES
async function getReportByCode(code) {
  return Report.findOne({ code }).lean();
}

async function getApprovalsByReportId(reportId) {
  // sekarang pakai relasi by reportId (ObjectId)
  return Approval.find({ reportId }).sort({ step: 1 }).lean();
}

function signflowFromApprovals(approvals = []) {
  const byStep = new Map(approvals.map(a => [a.step, a]));
  const spec = [
    { step: 1, role: 'HSE' },
    { step: 2, role: 'KEPALA_BIDANG' },
    { step: 3, role: 'DIREKTUR_SDM' },
  ];
  return spec.map(s => {
    const a = byStep.get(s.step);
    return a
      ? { step: s.step, role: s.role, status: a.status, userName: a.userName, at: a.at }
      : { step: s.step, role: s.role, status: 'PENDING' };
  });
}

function inferStatusFromFlow(flow = []) {
  if (flow.some(s => s.status === 'REJECTED')) return 'DITOLAK';
  if (flow.every(s => s.status === 'APPROVED')) return 'SELESAI';
  if (flow.some(s => s.status === 'PENDING'))  return 'MENUNGGU_APPROVAL';
  return 'DRAFT';
}

function signflowFromReportStatus(status) {
  const flow = [
    { step: 1, role: 'HSE',           status: 'APPROVED' },
    { step: 2, role: 'KEPALA_BIDANG', status: 'PENDING' },
    { step: 3, role: 'DIREKTUR_SDM',  status: 'PENDING' },
  ];

  switch (status) {
    case 'Menunggu Persetujuan Direktur SDM':
      flow[1].status = 'APPROVED';
      break;
    case 'Disetujui':
      flow[1].status = 'APPROVED';
      flow[2].status = 'APPROVED';
      break;
    case 'Ditolak Kepala Bidang':
      flow[1].status = 'REJECTED';
      break;
    case 'Ditolak Direktur SDM':
      flow[1].status = 'APPROVED';
      flow[2].status = 'REJECTED';
      break;
    case 'Draft':
      flow[0].status = 'PENDING';
      break;
  }

  return flow;
}

// Ambil history final: report + signFlow + status terhitung
async function getHistoryByCode(code) {
  const report = await getReportByCode(code);
  if (!report) return null;

  const approvals = await getApprovalsByReportId(report._id);
  const signFlow  = approvals.length > 0 
    ? signflowFromApprovals(approvals) 
    : signflowFromReportStatus(report.status);

  const status = report.status || inferStatusFromFlow(signFlow);
  return { id: report.code, status, report, signFlow };
}

// PDF
// formater tanggal sederhana
function fmtID(d) {
  if (!d) return '-';
  const dt = new Date(d);
  return dt.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Membuat PDF final dan mengembalikan { pdfBuffer }
async function buildFinalPdf(data) {
  // Normalisasi field agar robust ke 2 bentuk input
  const report = data.report || data;
  const signFlow = data.signFlow || report.signFlow || [];
  const qrLink = data.qrLink || report.qrLink || 'http://localhost/';

  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  // kumpulkan buffer
  const chunks = [];
  return new Promise(async (resolve, reject) => {
    doc.on('data', c => chunks.push(c));
    doc.on('error', reject);
    doc.on('end', () => resolve({ pdfBuffer: Buffer.concat(chunks) }));

    // Judul
    doc.fontSize(18).text('Laporan Kecelakaan Kerja', { align: 'center' }).moveDown();

    // Identitas
    doc.fontSize(12)
      .text(`Tanggal      : ${fmtID(report.date)}`)
      .text(`Departemen   : ${report.department || '-'}`)
      .text(`Nama Pekerja : ${report.employeeName || '-'}`)
      .text(`NIP          : ${report.nip || '-'}`)
      .text(`Skala Cedera : ${report.injuryScale || '-'}`)
      .moveDown()
      .text('Deskripsi:', { underline: true })
      .text(report.description || '-', { align: 'left' })
      .moveDown()
      .text('Alur Tanda Tangan:', { underline: true });

    signFlow.forEach(s => {
      const when = s.at ? ` (${fmtID(s.at)})` : '';
      doc.text(`• Step ${s.step} - ${s.role}: ${s.status}${when}${s.userName ? `, oleh ${s.userName}` : ''}`);
    });

    // QR Code
    try {
      const dataUrl = await QRCode.toDataURL(qrLink);
      const base64  = dataUrl.replace(/^data:image\/png;base64,/, '');
      doc.moveDown().text('Scan QR untuk verifikasi dokumen:');
      doc.image(Buffer.from(base64, 'base64'), { width: 120 });
      doc.fillColor('gray').fontSize(9).text(qrLink, { align: 'left' }).fillColor('black');
    } catch (_) {
      // kalau QR gagal, tetap lanjutkan PDF
    }

    doc.end();
  });
}

// Ambil history final berdasarkan _id (ObjectId dari laporan)
async function getHistoryById(id) {
  const laporan = await Report.findById(id).lean();
  if (!laporan) return null;

  // mapping field ke format finaldoc
  const report = mapReportFromAPI(laporan);

  // kalau ada approvals terpisah
  const approvals = await getApprovalsByReportId(report._id);
  let signFlow = [];
  if (approvals.length > 0) {
    signFlow = signflowFromApprovals(approvals);
  } else {
    // fallback → derive dari status string
    signFlow = signflowFromReportStatus(report.status);
  }

  const status = report.status || inferStatusFromFlow(signFlow);
  return { id: report.code, status, report, signFlow };
}

module.exports = {
  // DB helpers
  getHistoryByCode,
  getHistoryById,
  signflowFromApprovals,
  inferStatusFromFlow,

  // PDF
  buildFinalPdf,
};