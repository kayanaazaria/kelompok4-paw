const { buildFinalPdfFromLaporan, getLaporanHistory } = require('../services/finalDocument.service');
const Laporan = require('../models/LaporanKecelakaan');

function makeVerifyUrl(id) {
  const port = process.env.PORT || 5001;
  return `http://localhost:${port}/finaldoc/laporan/${id}/verify`;
}

// GET /finaldoc/laporan/:id/pdf (inline view)
async function viewFinalDoc(req, res) {
  try {
    const { id } = req.params;
    const laporan = await Laporan.findById(id).lean();
    if (!laporan) return res.status(404).json({ message: 'Laporan tidak ditemukan' });

    const { pdfBuffer } = await buildFinalPdfFromLaporan(laporan, { qrLink: makeVerifyUrl(id) });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="laporan-final-${id}.pdf"`);
    res.send(pdfBuffer);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Gagal generate PDF' });
  }
}

// GET /finaldoc/laporan/:id/download (force download)
async function downloadFinalDoc(req, res) {
  try {
    const { id } = req.params;
    console.log('[Download] Starting download for ID:', id);

    const laporan = await Laporan.findById(id)
      .populate('createdByHSE', 'username email')
      .populate('signedByKabid', 'username email')
      .populate('approvedByDirektur', 'username email')
      .lean();

    if (!laporan) {
      console.log('[Download] Laporan not found:', id);
      return res.status(404).json({ message: 'Laporan tidak ditemukan' });
    }

    console.log('[Download] Laporan found, generating PDF...');
    const { pdfBuffer } = await buildFinalPdfFromLaporan(laporan, { qrLink: makeVerifyUrl(id) });

    console.log('[Download] PDF generated, size:', pdfBuffer.length, 'bytes');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Content-Disposition', `attachment; filename="laporan-final-${id}.pdf"`);
    res.end(pdfBuffer);
  } catch (e) {
    console.error('[Download] Error:', e.message);
    console.error('[Download] Stack:', e.stack);
    res.status(500).json({ message: 'Gagal download PDF', error: e.message });
  }
}

// GET /finaldoc/laporan/:id/verify (public verification page)
async function verifyPage(req, res) {
  try {
    const { id } = req.params;
    const laporan = await Laporan.findById(id).lean();
    if (!laporan) return res.status(404).send('<h1>Dokumen tidak ditemukan</h1>');

    const { signFlow } = await getLaporanHistory(id) || { signFlow: [] };

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8" /><title>Verifikasi ${id}</title>
      <style>body{font-family:Arial;max-width:760px;margin:24px auto;line-height:1.5}ul{padding-left:18px}</style></head><body>
      <h2>Verifikasi Laporan Kecelakaan Kerja</h2>
      <p><b>ID:</b> ${id}</p>
      <p><b>Nama:</b> ${laporan.namaPekerja} &nbsp; <b>NIP:</b> ${laporan.nomorIndukPekerja || '-'}<br/>
         <b>Departemen:</b> ${laporan.department} &nbsp; <b>Tanggal:</b> ${new Date(laporan.tanggalKejadian).toLocaleDateString('id-ID')}</p>
      <h3>Alur Tanda Tangan</h3>
      <ul>
        ${signFlow.map(s => `<li>Step ${s.step} - ${s.role}: ${s.status}</li>`).join('')}
      </ul>
      </body></html>`;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (e) {
    console.error(e);
    res.status(500).send('<h1>Terjadi kesalahan</h1>');
  }
}

module.exports = {
  viewFinalDoc,
  downloadFinalDoc,
  verifyPage,
};

// ========================= PENJELASAN & TAMBAHAN ENDPOINT =========================
// Endpoint yang dimaksud "daftar final docs" = daftar semua laporan yang sudah final (status 'Disetujui').
// Ini berguna untuk halaman arsip / index dokumen siap diunduh, tanpa perlu filter manual di frontend.

// GET /finaldoc/laporan/final  (opsional query: department, from, to)
// Contoh: /finaldoc/laporan/final?department=Produksi&from=2025-09-01&to=2025-09-30
async function listFinalDocs(req, res) {
  try {
    const { department, from, to } = req.query;
    const filter = { status: 'Disetujui' };
    if (department) filter.department = department;
    if (from || to) {
      filter.tanggalKejadian = {};
      if (from) filter.tanggalKejadian.$gte = new Date(from);
      if (to) filter.tanggalKejadian.$lte = new Date(to);
    }

    const docs = await Laporan.find(filter).sort({ tanggalKejadian: -1 }).lean();
    const port = process.env.PORT || 5001;
    const base = `http://localhost:${port}`; // Bisa diganti sesuai deployment

    const mapped = docs.map(d => ({
      id: d._id,
      namaPekerja: d.namaPekerja,
      nip: d.nomorIndukPekerja,
      department: d.department,
      tanggal: d.tanggalKejadian,
      skalaCedera: d.skalaCedera,
      status: d.status,
      pdfUrl: `${base}/finaldoc/laporan/${d._id}/pdf`,
      downloadUrl: `${base}/finaldoc/laporan/${d._id}/download`,
      verifyUrl: `${base}/finaldoc/laporan/${d._id}/verify`,
    }));

    res.json({ count: mapped.length, data: mapped });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Gagal mengambil daftar final dokumen' });
  }
}

module.exports.listFinalDocs = listFinalDocs;
