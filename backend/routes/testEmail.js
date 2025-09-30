const express = require("express");
const router = express.Router();
const sendEmail = require("../utils/sendEmail");

router.get("/send-test", async (req, res) => {
  try {
    await sendEmail(
      "alamat.email.kamu@gmail.com",  // penerima uji coba
      "Test Email dari Sistem Laporan",
      "Halo, ini hanya test email apakah sistem bisa kirim notifikasi."
    );
    res.json({ message: "Email test terkirim!" });
  } catch (error) {
    console.error("Email test gagal:", error);
    res.status(500).json({ error: "Email test gagal terkirim" });
  }
});

module.exports = router;
