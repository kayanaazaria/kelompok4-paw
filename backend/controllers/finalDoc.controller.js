// backend/controllers/finalDoc.controller.js
const { getHistoryByCode, getHistoryById, buildFinalPdf } = require('../services/finalDoc.service');

function inferStatusFromFlow(flow = []) {
  if (flow.some(s => s.status === 'REJECTED')) return 'DITOLAK';
  const last = flow[flow.length - 1] || {};
  if (last.status === 'APPROVED') return 'SELESAI';
  if (flow.some(s => s.status === 'PENDING')) return 'MENUNGGU_APPROVAL';
  return 'DRAFT';
}

function makeVerifyUrl(code) {
  const port = process.env.PORT || 5001;
  return `http://localhost:${port}/finaldoc/reports/${code}/verify`;
}

// GET /finaldoc/reports
async function listReports(_req, res, next) {
  try {
    const hist = await getHistoryByCode('RPT-001');
    if (!hist) return res.json([]);
    const { report, status, id, signFlow } = hist;
    res.json([{
      id,
      date: report.date,
      employeeName: report.employeeName,
      department: report.department,
      injuryScale: report.injuryScale,
      status: status || inferStatusFromFlow(signFlow),
    }]);
  } catch (e) { next(e); }
}

async function getHistoryByIdHandler(req, res, next) {
  try {
    const { id } = req.params;
    const data = await getHistoryById(id);
    if (!data) return res.status(404).json({ message: 'Report not found' });
    res.json({
      id: data.id,
      status: data.status || inferStatusFromFlow(data.signFlow),
      signFlow: data.signFlow,
    });
  } catch (e) { next(e); }
}

async function getFinalPdfById(req, res, next) {
  try {
    const { id } = req.params;
    const history = await getHistoryById(id);
    if (!history) return res.status(404).json({ message: 'Report not found' });

    const { pdfBuffer } = await buildFinalPdf({ ...history, qrLink: makeVerifyUrl(id) });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="final-${id}.pdf"`);
    res.send(pdfBuffer);
  } catch (e) { next(e); }
}

async function downloadFinalPdfById(req, res, next) {
  try {
    const { id } = req.params;
    const history = await getHistoryById(id);
    if (!history) return res.status(404).json({ message: 'Report not found' });

    const { pdfBuffer } = await buildFinalPdf({ ...history, qrLink: makeVerifyUrl(id) });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="final-${id}.pdf"`);
    res.send(pdfBuffer);
  } catch (e) { next(e); }
}

async function verifyPageById(req, res, next) {
  try {
    const { id } = req.params;
    const data = await getHistoryById(id);
    if (!data) return res.status(404).send('<h1>Not Found</h1>');

    const { report, signFlow, status } = data;
    const html = `
      <html>
        <head><meta charset="utf-8"><title>Verifikasi ${id}</title></head>
        <body style="font-family:Arial;max-width:720px;margin:20px auto;line-height:1.5">
          <h2>Verifikasi Dokumen: ${id}</h2>
          <p><b>Status:</b> ${status || inferStatusFromFlow(signFlow)}</p>
          <p><b>Nama:</b> ${report.employeeName} &nbsp; <b>NIP:</b> ${report.nip || '-'}</p>
          <p><b>Departemen:</b> ${report.department} &nbsp; 
             <b>Tanggal:</b> ${new Date(report.date).toLocaleDateString('id-ID')}</p>
          <h3>Alur Tanda Tangan</h3>
          <ul>
            ${signFlow.map(s => `<li>Step ${s.step} - ${s.role}: ${s.status}${s.userName ? ` (oleh ${s.userName})` : ''}${s.at ? `, ${new Date(s.at).toLocaleDateString('id-ID')}` : ''}</li>`).join('')}
          </ul>
        </body>
      </html>`;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (e) { next(e); }
}

module.exports = {
  listReports,

  getHistoryByIdHandler,
  getFinalPdfById,
  downloadFinalPdfById,
  verifyPageById,
};