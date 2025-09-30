const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // bisa ganti pakai SMTP lain
  auth: {
    user: process.env.EMAIL_USER, // email pengirim
    pass: process.env.EMAIL_PASS  // app password / smtp password
  }
});

/**
 * Kirim email notifikasi
 * @param {string} to - email penerima
 * @param {string} subject - judul email
 * @param {string} text - isi email (plain text)
 */
const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"HSE System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    });
  } catch (err) {
    console.error("Gagal kirim email:", err);
  }
};

module.exports = sendEmail;
