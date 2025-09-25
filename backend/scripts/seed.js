require('dotenv').config();
const mongoose = require('mongoose');
const Report = require('../models/Report');
const Approval = require('../models/Approval');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const rpt = await Report.findOneAndUpdate(
    { code: 'RPT-001' },
    { code:'RPT-001', date:new Date('2025-09-20T02:30:00Z'),
      department:'Electronical Assembly', employeeName:'Bima Setia', nip:'E12345',
      injuryScale:'RINGAN', description:'Terserempet solder pada jari saat perakitan.',
      status:'MENUNGGU_APPROVAL'
    },
    { upsert:true, new:true }
  );

  await Approval.deleteMany({ reportId: rpt._id });
  await Approval.create([
    { reportId:rpt._id, step:1, role:'HSE', status:'APPROVED', userName:'Sinta HSE', at:new Date('2025-09-20T03:00:00Z') },
    { reportId:rpt._id, step:2, role:'KEPALA_BIDANG', status:'PENDING' },
    { reportId:rpt._id, step:3, role:'DIREKTUR_SDM',  status:'PENDING' },
  ]);

  console.log('Seed done'); process.exit(0);
})();