const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"HSE System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    });
    console.log(`✅ Email terkirim ke ${to}`);
  } catch (err) {
    console.error("❌ Gagal kirim email:", err.message);
  }
};

module.exports = sendEmail;
