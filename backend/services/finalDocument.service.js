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
  // Mapping status sekarang ke flow langkah-langkah dengan informasi lengkap
  const flow = [
    { 
      step: 1, 
      role: 'HSE', 
      status: 'APPROVED',
      name: laporan.createdByHSE?.username || 'HSE',
      date: laporan.createdAt
    },
    { 
      step: 2, 
      role: 'KEPALA_BIDANG', 
      status: 'PENDING',
      name: laporan.signedByKabid?.username || '-',
      date: laporan.signedByKabid ? laporan.updatedAt : null
    },
    { 
      step: 3, 
      role: 'DIREKTUR_SDM', 
      status: 'PENDING',
      name: laporan.approvedByDirektur?.username || '-',
      date: laporan.approvedByDirektur ? laporan.updatedAt : null
    }
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
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

async function buildFinalPdfFromLaporan(laporan, { qrLink }) {
  const data = mapFromLaporan(laporan);
  const signFlow = deriveSignFlow(laporan);

  const doc = new PDFDocument({ size: 'A4', margins: { top: 30, bottom: 40, left: 40, right: 40 } });
  const chunks = [];

  // Register Poppins fonts dengan fallback ke Helvetica
  const path = require('path');
  const fs = require('fs');
  const poppinsRegular = path.join(__dirname, '../fonts/Poppins-Regular.ttf');
  const poppinsBold = path.join(__dirname, '../fonts/Poppins-Bold.ttf');

  // Cek apakah font files tersedia, jika tidak gunakan Helvetica
  try {
    if (fs.existsSync(poppinsRegular) && fs.existsSync(poppinsBold)) {
      doc.registerFont('Poppins', poppinsRegular);
      doc.registerFont('Poppins-Bold', poppinsBold);
      console.log('[PDF] Using custom Poppins fonts');
    } else {
      // Gunakan Helvetica sebagai fallback (built-in PDFKit)
      doc.registerFont('Poppins', 'Helvetica');
      doc.registerFont('Poppins-Bold', 'Helvetica-Bold');
      console.log('[PDF] Poppins fonts not found, using Helvetica as fallback');
    }
  } catch (err) {
    // Jika error, fallback ke Helvetica
    doc.registerFont('Poppins', 'Helvetica');
    doc.registerFont('Poppins-Bold', 'Helvetica-Bold');
    console.log('[PDF] Error loading fonts, using Helvetica:', err.message);
  }

  const colors = {
    primary: '#16a34a', // green-600
    secondary: '#2563eb', // blue-600
    text: '#1f2937', // gray-800
    lightGray: '#e5e7eb', // gray-200
    darkGray: '#6b7280', // gray-500
  };

  const divider = () => { 
    doc.moveTo(40, doc.y).lineTo(555, doc.y).strokeColor(colors.lightGray).stroke().moveDown(0.8).strokeColor('black'); 
  };

  return new Promise(async (resolve, reject) => {
    doc.on('data', c => chunks.push(c));
    doc.on('error', reject);
    doc.on('end', () => resolve({ pdfBuffer: Buffer.concat(chunks) }));

    // Header: Logo di kiri, Text di kanan (sejajar)
    const pageWidth = 595.28; // A4 width in points
    const logoWidth = 180; // Logo dikecilkan
    const logoX = 40; // Left alignment
    const logoY = 35; // Top position

    try {
      const logoPath = path.join(__dirname, '../../frontend/public/logo_solanum_landscape.png');
      // Hanya set width, biarkan height auto untuk maintain aspect ratio
      doc.image(logoPath, logoX, logoY, { width: logoWidth, fit: [logoWidth, 80] });
    } catch (e) {
      console.log('Logo not found, skipping');
    }

    // Text di kanan, sejajar dengan logo
    const textX = logoX + logoWidth + 30; // Posisi text mulai setelah logo + spacing
    const textWidth = pageWidth - textX - 40; // Width untuk text area
    const textY = logoY + 15; // Vertical alignment dengan logo

    doc.font('Poppins-Bold').fontSize(18).fillColor(colors.primary)
       .text('LAPORAN KECELAKAAN KERJA', textX, textY, { align: 'right', width: textWidth })
       .fillColor(colors.text);

    // Subtitle
    doc.fontSize(9).fillColor(colors.darkGray)
       .text('SOLANUM AGROTECH - Incident Report Management System', textX, textY + 24, { align: 'right', width: textWidth })
       .fillColor(colors.text);

    doc.moveDown(1.5);
    divider();

    // Information Section
    doc.fontSize(14).font('Poppins-Bold').text('DETAIL INSIDEN', 40, doc.y, { align: 'center', width: pageWidth - 80 }).moveDown(1);

    doc.fontSize(11);
    let currentY = doc.y;
    const labelWidth = 140;
    const valueX = 180;

    // Row 1: Tanggal Kejadian
    doc.font('Poppins-Bold').text('Tanggal Kejadian', 40, currentY, { width: labelWidth, continued: false });
    doc.font('Poppins').text(fmtDate(data.date), valueX, currentY);
    currentY += 20;

    // Row 2: Nama Pekerja
    doc.font('Poppins-Bold').text('Nama Pekerja', 40, currentY, { width: labelWidth, continued: false });
    doc.font('Poppins').text(data.employeeName || '-', valueX, currentY);
    currentY += 20;

    // Row 3: Departemen
    doc.font('Poppins-Bold').text('Departemen', 40, currentY, { width: labelWidth, continued: false });
    doc.font('Poppins').text(data.department || '-', valueX, currentY);
    currentY += 20;

    // Row 4: NIP
    doc.font('Poppins-Bold').text('NIP', 40, currentY, { width: labelWidth, continued: false });
    doc.font('Poppins').text(data.nip || '-', valueX, currentY);
    currentY += 20;

    // Row 5: Skala Cedera
    doc.font('Poppins-Bold').text('Skala Cedera', 40, currentY, { width: labelWidth, continued: false });
    doc.font('Poppins').text((data.injuryScale || '-').toString(), valueX, currentY);

    doc.y = currentY + 20;

    doc.moveDown(1);
    divider();

    // Description Section - single row with label and value
    doc.fontSize(11);
    const descY = doc.y;
    const descLabelWidth = 140;
    const descValueX = 180;

    doc.font('Poppins-Bold').text('DESKRIPSI INSIDEN', 40, descY, { width: descLabelWidth, continued: false });
    doc.font('Poppins').text(data.description || '-', descValueX, descY, { width: 375 });

    doc.moveDown(1);
    divider();

    // Approval Flow Section - Table Format
    doc.font('Poppins-Bold').fontSize(12).text('ALUR PERSETUJUAN', 40).moveDown(0.5);

    // Table settings
    const tableTop = doc.y;
    const col1X = 40;   // No
    const col2X = 80;   // Jabatan (dikecilkan)
    const col3X = 213;  // Nama
    const col4X = 363;  // Tanggal Disetujui (diperlebar)
    const rowHeight = 25;
    const headerHeight = 30;

    // Draw table header
    doc.rect(col1X, tableTop, 515, headerHeight).stroke();
    doc.font('Poppins-Bold').fontSize(10);

    // Header columns with center alignment and vertical center
    const headerTextY = tableTop + (headerHeight / 2) - 5; // Vertical center
    doc.text('No', col1X, headerTextY, { width: 40, align: 'center' });
    doc.rect(col2X, tableTop, 133, headerHeight).stroke();
    doc.text('Jabatan', col2X, headerTextY, { width: 133, align: 'center' });
    doc.rect(col3X, tableTop, 150, headerHeight).stroke();
    doc.text('Nama', col3X, headerTextY, { width: 150, align: 'center' });
    doc.rect(col4X, tableTop, 192, headerHeight).stroke();
    doc.text('Tanggal Disetujui', col4X, headerTextY, { width: 192, align: 'center' });

    let tableRowY = tableTop + headerHeight;

    // Draw table rows
    doc.font('Poppins').fontSize(9);
    signFlow.forEach((s, idx) => {
      let roleName = s.role;
      if (s.role === 'HSE') roleName = 'HSE';
      if (s.role === 'KEPALA_BIDANG') roleName = 'Kepala Bidang';
      if (s.role === 'DIREKTUR_SDM') roleName = 'Direktur SDM';

      const statusText = s.status === 'APPROVED' ? 'Disetujui' : 
                        s.status === 'REJECTED' ? 'Ditolak' : 'Menunggu';

      // Draw row border
      doc.rect(col1X, tableRowY, 515, rowHeight).stroke();

      const rowTextY = tableRowY + (rowHeight / 2) - 4; // Vertical center for content

      // No column - center aligned
      doc.text((idx + 1).toString(), col1X, rowTextY, { width: 40, align: 'center' });

      // Jabatan column - center aligned
      doc.rect(col2X, tableRowY, 133, rowHeight).stroke();
      doc.text(roleName, col2X, rowTextY, { width: 133, align: 'center' });

      // Nama column - center aligned
      doc.rect(col3X, tableRowY, 150, rowHeight).stroke();
      doc.text(s.name || '-', col3X, rowTextY, { width: 150, align: 'center' });

      // Tanggal Disetujui column - center aligned
      doc.rect(col4X, tableRowY, 192, rowHeight).stroke();
      const dateText = s.status === 'APPROVED' && s.date ? 
        new Date(s.date).toLocaleDateString('id-ID', { 
          weekday: 'long',
          day: 'numeric', 
          month: 'long', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) : statusText;
      doc.text(dateText, col4X, rowTextY, { width: 192, align: 'center' });

      tableRowY += rowHeight;
    });

    doc.y = tableRowY + 5;

    // Add "Diajukan oleh..." text - right aligned, italic
    const submitterName = laporan.createdByHSE?.username || 'HSE';
    const submittedDate = new Date(laporan.createdAt).toLocaleDateString('id-ID', { 
      weekday: 'long',
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    doc.font('Poppins').fontSize(9).fillColor(colors.darkGray)
       .text(`Diajukan oleh ${submitterName} pada ${submittedDate}`, 40, doc.y, { 
         width: 515, 
         align: 'right',
         oblique: true  // Italic style
       })
       .fillColor(colors.text);

    doc.moveDown(1);
    divider();

    // QR Code Section - dalam tabel
    const qrTableTop = doc.y + 5;
    const qrSize = 60; // QR diperkecil
    const qrCellWidth = 80;
    const textCellWidth = 435;
    const tableHeight = 70; // Tinggi tabel diperkecil

    try {
      // Generate QR Code
      const dataUrl = await QRCode.toDataURL(qrLink, { width: 120, margin: 1 });
      const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
      
      // Draw outer border hitam
      doc.strokeColor('#000000')
         .rect(40, qrTableTop, qrCellWidth + textCellWidth, tableHeight).stroke();

      // Draw garis vertikal pembatas dengan warna transparan (tidak terlihat)
      doc.strokeColor('#transparent')
         .moveTo(40 + qrCellWidth, qrTableTop)
         .lineTo(40 + qrCellWidth, qrTableTop + tableHeight)
         .stroke();

      // Reset stroke color ke hitam
      doc.strokeColor('#000000');

      // QR Code - centered dalam cell
      const qrXPos = 40 + (qrCellWidth - qrSize) / 2;
      const qrYPos = qrTableTop + (tableHeight - qrSize) / 2;
      doc.image(Buffer.from(base64, 'base64'), qrXPos, qrYPos, { width: qrSize });

      // Teks - centered vertical dalam cell dengan spacing kecil
      const textX = 40 + qrCellWidth + 10;
      const totalTextHeight = 30; // Perkiraan tinggi total 2 baris
      const textStartY = qrTableTop + (tableHeight - totalTextHeight) / 2; // Vertical center

      doc.fontSize(8).font('Poppins').fillColor(colors.text)
         .text('Dokumen ini telah melalui proses approval secara daring sebelum QR Code dibubuhkan.', 
               textX, textStartY, { 
                 width: textCellWidth - 20,
                 align: 'left',
                 lineGap: 0
               });

      doc.fontSize(8).fillColor(colors.text)
         .text('Scan QR Code yang ada di halaman dokumen ini untuk verifikasi.', 
               textX, textStartY + 14, { 
                 width: textCellWidth - 20,
                 align: 'left',
                 lineGap: 0
               })
         .fillColor(colors.text);
         
    } catch (e) {
      console.error('QR generation failed:', e);
    }

    // Close the PDF document
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
