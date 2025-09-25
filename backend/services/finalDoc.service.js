const Report = require('../models/Report');
const Approval = require('../models/Approval');

async function getReportByCode(code) {
  return Report.findOne({ code }).lean();
}

async function getApprovalsByReport(reportId) {
  return Approval.find({ reportId }).sort({ step: 1 }).lean();
}

function signflowFromApprovals(approvals) {
  const map = new Map(approvals.map(a => [a.step, a]));
  return [
    { step:1, role:'HSE',           status: map.get(1)?.status ?? 'PENDING', userName: map.get(1)?.userName, at: map.get(1)?.at },
    { step:2, role:'KEPALA_BIDANG', status: map.get(2)?.status ?? 'PENDING', userName: map.get(2)?.userName, at: map.get(2)?.at },
    { step:3, role:'DIREKTUR_SDM',  status: map.get(3)?.status ?? 'PENDING', userName: map.get(3)?.userName, at: map.get(3)?.at },
  ];
}

async function getHistoryByCode(code) {
  const report = await getReportByCode(code);
  if (!report) return null;
  const approvals = await getApprovalsByReport(report._id);
  const signFlow = signflowFromApprovals(approvals);
  return { id: report.code, status: report.status, report, signFlow };
}

module.exports = { getHistoryByCode };