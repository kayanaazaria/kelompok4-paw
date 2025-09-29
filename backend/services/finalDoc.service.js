const Report   = require('../models/Report');
const Approval = require('../models/Approval');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const { mapReportFromAPI } = require('./finalDoc.adapter');

async function getReportByCode(code) {
  return Report.findOne({ code }).lean();
}

async function getApprovalsByReportId(reportId) {
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

function fmtID(d) {
  if (!d) return '-';
  const dt = new Date(d);
  return dt.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

async function buildFinalPdf(data) {
  const report   = data.report   || data;
  const signFlow = data.signFlow || report.signFlow || [];
  const qrLink   = data.qrLink   || report.qrLink   || 'http://localhost/';

  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  const divider = () => { doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#cccccc').stroke().moveDown(0.8).strokeColor('black'); };
  const labelVal = (label, val) => {
    doc.font('Helvetica-Bold').text(label, { continued: true });
    doc.font('Helvetica').text(` ${val ?? '-'}`);
  };

  const chunks = [];
  return new Promise(async (resolve, reject) => {
    doc.on('data', (c) => chunks.push(c));
    doc.on('error', reject);
    doc.on('end', () => resolve({ pdfBuffer: Buffer.concat(chunks) }));

    doc.font('Helvetica-Bold')
       .fontSize(18)
       .text('LAPORAN KECELAKAAN KERJA', { align: 'center' })
       .moveDown(1.2);

    divider();

    doc.fontSize(12);
    labelVal('Tanggal:', fmtID(report.date));
    labelVal('Departemen:', report.department || '-');
    labelVal('Nama Pekerja:', report.employeeName || '-');
    labelVal('NIP:', report.nip || '-');
    labelVal('Skala Cedera:', (report.injuryScale || '-').toString().toLowerCase()); // biar “berat/ringan” terlihat konsisten
    doc.moveDown(0.8);

    doc.font('Helvetica-Bold').text('Deskripsi:');
    doc.font('Helvetica').text(report.description || '-', { align: 'justify' });
    doc.moveDown(0.8);

    divider();

    doc.font('Helvetica-Bold').text('Alur Tanda Tangan:').moveDown(0.2);
    doc.font('Helvetica');

    signFlow.forEach((s) => {
      const when = s.at ? ` (${fmtID(s.at)})` : '';
      const who  = s.userName ? `, oleh ${s.userName}` : '';
      doc.text(`• Step ${s.step} — ${s.role}: ${s.status}${when}${who}`);
    });

    doc.moveDown(0.8);
    divider();

    try {
      const dataUrl = await QRCode.toDataURL(qrLink);
      const base64  = dataUrl.replace(/^data:image\/png;base64,/, '');
      doc.font('Helvetica-Bold').text('Scan QR untuk verifikasi dokumen:').moveDown(0.2);
      doc.image(Buffer.from(base64, 'base64'), { width: 120 });
      doc.moveDown(0.4);
      doc.fillColor('gray').font('Helvetica').fontSize(9).text(qrLink, { align: 'left' }).fillColor('black');
    } catch {
      doc.font('Helvetica').text('QR tidak tersedia.');
    }

    doc.end();
  });
}

async function getHistoryById(id) {
  const laporan = await Report.findById(id).lean();
  if (!laporan) return null;

  const report = mapReportFromAPI(laporan);

  const approvals = await getApprovalsByReportId(report._id);
  let signFlow = [];
  if (approvals.length > 0) {
    signFlow = signflowFromApprovals(approvals);
  } else {
    signFlow = signflowFromReportStatus(report.status);
  }

  const status = report.status || inferStatusFromFlow(signFlow);
  return { id: report.code, status, report, signFlow };
}

module.exports = {
  getHistoryByCode,
  getHistoryById,
  signflowFromApprovals,
  inferStatusFromFlow,

  buildFinalPdf,
};