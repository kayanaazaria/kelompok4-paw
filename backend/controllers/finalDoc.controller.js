// backend/controllers/finalDoc.controller.js
const { getHistoryByCode, buildFinalPdf } = require('../services/finalDoc.service');

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
    // sementara: tampilkan 1 contoh (RPT-001). Nanti bisa dibuat list dari query DB
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

// GET /finaldoc/reports/:code/history
async function getHistory(req, res, next) {
  try {
    const { code } = req.params;
    const data = await getHistoryByCode(code);
    if (!data) return res.status(404).json({ message: 'Report not found' });
    res.json({
      id: data.id,
      status: data.status || inferStatusFromFlow(data.signFlow),
      signFlow: data.signFlow,
    });
  } catch (e) { next(e); }
}

// GET /finaldoc/reports/:code/final.pdf
async function getFinalPdf(req, res, next) {
  try {
    const { code } = req.params;
    const history = await getHistoryByCode(code);
    if (!history) return res.status(404).json({ message: 'Report not found' });

    const { pdfBuffer } = await buildFinalPdf({ ...history, qrLink: makeVerifyUrl(code) });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="final-${code}.pdf"`);
    res.send(pdfBuffer);
  } catch (e) { next(e); }
}

// GET /finaldoc/reports/:code/final/download
async function downloadFinalPdf(req, res, next) {
  try {
    const { code } = req.params;
    const history = await getHistoryByCode(code);
    if (!history) return res.status(404).json({ message: 'Report not found' });

    const { pdfBuffer } = await buildFinalPdf({ ...history, qrLink: makeVerifyUrl(code) });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="final-${code}.pdf"`);
    res.send(pdfBuffer);
  } catch (e) { next(e); }
}

// GET /finaldoc/reports/:code/verify
async function verifyPage(req, res, next) {
  try {
    const { code } = req.params;
    const data = await getHistoryByCode(code);
    if (!data) return res.status(404).send('<h1>Not Found</h1>');

    const { report, signFlow, status } = data;
    const html = `
      <html>
        <head><meta charset="utf-8"><title>Verifikasi ${code}</title></head>
        <body style="font-family:Arial;max-width:720px;margin:20px auto;line-height:1.5">
          <h2>Verifikasi Dokumen: ${code}</h2>
          <p><b>Status:</b> ${status || inferStatusFromFlow(signFlow)}</p>
          <p><b>Nama:</b> ${report.employeeName} &nbsp; <b>NIP:</b> ${report.employeeNip || report.nip || '-'}</p>
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
  getHistory,
  getFinalPdf,
  downloadFinalPdf,
  verifyPage,
};