const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  tanggalKejadian: { type: Date, required: true },
  bagian: { 
    type: String, 
    enum: ["Mechanical Assembly", "Electronical Assembly", "Software Installation", "Quality Assurance", "Warehouse"],
    required: true
  },
  namaPekerja: { type: String, required: true },
  nomorInduk: { type: String, required: true },
  detail: { type: String, required: true },
  skalaCedera: { type: String, enum: ["ringan", "menengah", "berat"], required: true },

  statusHead: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  statusHR: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
}, { timestamps: true });

module.exports = mongoose.model("Report", ReportSchema);
