const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

/**
 * Membangun PDF final dokumen (in-memory Buffer) + QR link
 * @param {Object} report - data laporan
 * @returns {Promise<{pdfBuffer: Buffer, qrLink: string}>}
 */
async function buildFinalPdf(report) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  const chunks = [];
  doc.on('data', (c) => chunks.push(c));
  const done = new Promise((resolve) => doc.on('end', () => resolve(Buffer.concat(chunks))));

  // Judul
  doc.fontSize(18).text('Laporan Kecelakaan Kerja', { align: 'center' });
  doc.moveDown();

  // Info dasar
  const tgl = report.date ? new Date(report.date).toLocaleDateString('id-ID') : '-';
  doc.fontSize(12);
  doc.text(`Tanggal        : ${tgl}`);
  doc.text(`Departemen     : ${report.department || '-'}`);
  doc.text(`Nama Pekerja   : ${report.employeeName || '-'}`);
  doc.text(`NIP            : ${report.employeeNip || '-'}`);
  doc.text(`Skala Cedera   : ${report.injuryScale || '-'}`);
  doc.moveDown();
  doc.text('Deskripsi:', { underline: true });
  doc.text(report.description || '-');
  doc.moveDown();

  // Alur tanda tangan
  doc.text('Alur Tanda Tangan:', { underline: true });
  (report.signFlow || []).forEach((s) => {
    const waktu = s.at ? new Date(s.at).toLocaleString('id-ID') : '-';
    const oleh  = s.userName ? `oleh ${s.userName}` : '';
    doc.text(`• Step ${s.step} - ${s.role}: ${s.status} ${oleh} (${waktu})`);
  });
  doc.moveDown();

  // QR code
  const port = process.env.PORT || 5001;
  const qrLink = report.qrLink || `http://localhost:${port}/finaldoc/reports/${report._id}/final.pdf`;
  const qrBuf  = await QRCode.toBuffer(qrLink, { margin: 1, scale: 6 });

  doc.text('Scan QR untuk verifikasi dokumen:');
  doc.image(qrBuf, { width: 120 });
  doc.fontSize(10).fillColor('gray').text(qrLink);

  doc.end();
  const pdfBuffer = await done;
  return { pdfBuffer, qrLink };
}

module.exports = { buildFinalPdf };