// Service untuk membangun PDF Final Laporan Kecelakaan Kerja (adaptasi dari branch finaldoc)
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const Laporan = require('../models/LaporanKecelakaan');
const User = require('../models/userModel');

function mapFromLaporan(laporanDoc) {
  return {
    _id: laporanDoc._id,
    code: laporanDoc._id.toString(),
    date: laporanDoc.tanggalKejadian,
    department: laporanDoc.department,
    employeeName: laporanDoc.namaPekerja,
    nip: laporanDoc.nomorIndukPekerja,
    injuryScale: laporanDoc.skalaCedera,
    description: laporanDoc.detailKejadian,
    status: laporanDoc.status,
  };
}

function deriveSignFlow(laporan) {
  // Mapping status sekarang ke flow langkah-langkah
  const flow = [
    { step: 1, role: 'HSE', status: 'APPROVED' },
    { step: 2, role: 'KEPALA_BIDANG', status: 'PENDING' },
    { step: 3, role: 'DIREKTUR_SDM', status: 'PENDING' }
  ];
  switch (laporan.status) {
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

function fmtDate(d) {
  if (!d) return '-';
  return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

async function buildFinalPdfFromLaporan(laporan, { qrLink }) {
  const data = mapFromLaporan(laporan);
  const signFlow = deriveSignFlow(laporan);

  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const chunks = [];

  const divider = () => { doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#cccccc').stroke().moveDown(0.8).strokeColor('black'); };
  const labelVal = (label, val) => { doc.font('Helvetica-Bold').text(label, { continued: true }); doc.font('Helvetica').text(' ' + (val ?? '-')); };

  return new Promise(async (resolve, reject) => {
    doc.on('data', c => chunks.push(c));
    doc.on('error', reject);
    doc.on('end', () => resolve({ pdfBuffer: Buffer.concat(chunks) }));

    doc.font('Helvetica-Bold').fontSize(18).text('LAPORAN KECELAKAAN KERJA', { align: 'center' }).moveDown(1.2);
    divider();

    doc.fontSize(12);
    labelVal('Tanggal:', fmtDate(data.date));
    labelVal('Departemen:', data.department || '-');
    labelVal('Nama Pekerja:', data.employeeName || '-');
    labelVal('NIP:', data.nip || '-');
    labelVal('Skala Cedera:', (data.injuryScale || '-').toString().toLowerCase());
    doc.moveDown(0.8);

    doc.font('Helvetica-Bold').text('Deskripsi:');
    doc.font('Helvetica').text(data.description || '-', { align: 'justify' });
    doc.moveDown(0.8);

    divider();

    doc.font('Helvetica-Bold').text('Alur Tanda Tangan:').moveDown(0.2);
    doc.font('Helvetica');
    signFlow.forEach(s => {
      doc.text(`• Step ${s.step} — ${s.role}: ${s.status}`);
    });
    doc.moveDown(0.8);
    divider();

    try {
      const dataUrl = await QRCode.toDataURL(qrLink);
      const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
      doc.font('Helvetica-Bold').text('Scan QR untuk verifikasi dokumen:').moveDown(0.2);
      doc.image(Buffer.from(base64, 'base64'), { width: 120 });
      doc.moveDown(0.4);
      doc.fillColor('gray').font('Helvetica').fontSize(9).text(qrLink, { align: 'left' }).fillColor('black');
    } catch (e) {
      doc.font('Helvetica').text('QR tidak tersedia.');
    }

    doc.end();
  });
}

async function getLaporanHistory(laporanId) {
  const laporan = await Laporan.findById(laporanId).lean();
  if (!laporan) return null;
  const signFlow = deriveSignFlow(laporan);
  return { laporan, signFlow };
}

module.exports = {
  buildFinalPdfFromLaporan,
  getLaporanHistory,
  deriveSignFlow,
};
