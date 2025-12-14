import { Resend } from "resend";

export async function sendMail(to: string, subject: string, body: string) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY missing");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: `vartaX <${process.env.MAIL_FROM}>`,
    to: [to],
    subject,
    text: body,
  });
}
