import * as nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL } = process.env;

export async function sendMail(to: string, subject: string, text: string) {
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });
    await transporter.sendMail({
      from: FROM_EMAIL || SMTP_USER,
      to,
      subject,
      text
    });
    return true;
  } else {
    // No SMTP configured — fallback: log OTP to console (safe for dev)
    console.log(`---- EMAIL Fallback ----\nTo: ${to}\nSubject: ${subject}\n\n${text}\n-----------------------`);
    return false;
  }
}
