function mapReportFromAPI(r) {
  return {
    _id: r._id,                         
    code: r.code || r._id?.toString(),   
    date: r.tanggalKejadian,
    department: r.department,
    employeeName: r.namaPekerja,
    nip: r.nomorIndukPekerja,
    injuryScale: r.skalaCedera,
    description: r.detailKejadian,
    attachments: r.attachment ? [r.attachment] : [],
    status: r.status,                 
  };
}
module.exports = { mapReportFromAPI };