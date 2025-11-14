import crypto from "crypto";
import nodemailer from "nodemailer";

// Request reset link
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(404).json({ message: "Admin not found" });

  const token = crypto.randomBytes(20).toString("hex");
  admin.resetToken = token;
  admin.resetTokenExpire = Date.now() + 15 * 60 * 1000; // 15 min
  await admin.save();

  const resetLink = `http://localhost:5500/frontend/admin/reset-password.html?token=${token}`;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Param Sundari Admin Password Reset",
    html: `<p>Click to reset password:</p><a href="${resetLink}">${resetLink}</a>`,
  });

  res.json({ message: "Reset link sent to email!" });
});

// Reset password using token
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  const admin = await Admin.findOne({
    resetToken: token,
    resetTokenExpire: { $gt: Date.now() },
  });
  if (!admin) return res.status(400).json({ message: "Invalid or expired token" });

  admin.password = newPassword;
  admin.resetToken = undefined;
  admin.resetTokenExpire = undefined;
  await admin.save();

  res.json({ message: "✅ Password reset successful!" });
});
