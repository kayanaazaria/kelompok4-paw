function mapReportFromAPI(r) {
  return {
    _id: r._id,
    code: r.code || (r._id && r._id.toString()),

    date: r.date || r.tanggal || r.tanggalKejadian,

    department: r.department || r.bagian,

    employeeName: r.employeeName || r.namaPekerja,

    nip: r.nip || r.nomorIndukPekerja,

    injuryScale: r.injuryScale || r.skala || r.skalaCedera,
    description: r.description || r.detail || r.detailKejadian,

    attachments: r.attachments || (r.attachment ? [r.attachment] : []),

    status: r.status,
  };
}
module.exports = { mapReportFromAPI };