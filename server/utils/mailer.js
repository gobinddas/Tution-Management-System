import nodemailer from "nodemailer";

export default async function sendMail(to, body) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "gobind98077@gmail.com",        // ✅ your real Gmail
      pass: "tnvomzhwekixuaet",             // ✅ your 16-character App Password (remove spaces!)
    },
  });

  await transporter.sendMail({
    from: '"Zenith Panther" <gobind98077@gmail.com>', // ✅ match "from" email with authenticated user
    to,
    subject: "OTP Verification",
    text: body,
  });
}
