function mapReportFromAPI(r = {}) {
  return {
    _id: r._id,                         
    code: r.code || r._id?.toString(),  // fallback kalau tidak ada code
    date: r.tanggal || r.tanggalKejadian || r.date,
    department: r.bagian || r.department || '-',
    employeeName: r.namaPekerja || r.employeeName || '-',
    employeeNip: r.nip || r.nomorIndukPekerja || '-',
    injuryScale: r.skala || r.skalaCedera || '-',
    description: r.detail || r.detailKejadian || '-',
    attachments: r.attachment ? [r.attachment] : [],
    status: r.status || 'Draft',
  };
}

module.exports = { mapReportFromAPI };