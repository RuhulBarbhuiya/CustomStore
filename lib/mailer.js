import nodemailer from "nodemailer";

export function createMailTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP email settings are missing");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

export async function sendOtpEmail({ to, otp, purpose = "signup" }) {
  const transporter = createMailTransport();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const title = purpose === "signup" ? "Signup OTP" : "Login OTP";

  await transporter.sendMail({
    from,
    to,
    subject: `Your ${purpose} OTP`,
    text: `Your ${purpose} OTP is ${otp}. It will expire in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>${title}</h2>
        <p>Your one-time password is:</p>
        <p style="font-size: 28px; font-weight: 700; letter-spacing: 4px;">${otp}</p>
        <p>This OTP will expire in 10 minutes.</p>
      </div>
    `,
  });
}
