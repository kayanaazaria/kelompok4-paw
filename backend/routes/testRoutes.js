const express = require("express");
const router = express.Router();
const sendEmail = require("../utils/sendEmail");

// Endpoint GET untuk cek server jalan
router.get("/", (req, res) => {
  res.json({ message: "Test route OK ✅" });
});

// Endpoint GET untuk uji kirim email
router.get("/send", async (req, res) => {
  try {
    await sendEmail(
      "alamat_email_penerima@gmail.com", // ganti dgn emailmu
      "Test Email dari HSE System",
      "Halo! Ini adalah email percobaan dari backend."
    );
    res.json({ message: "Email test terkirim!" });
  } catch (err) {
    console.error("Gagal kirim email:", err);
    res.status(500).json({ message: "Gagal kirim email" });
  }
});

module.exports = router;
