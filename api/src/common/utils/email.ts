import nodemailer from "nodemailer";
import appConfig from "../config/app.configs";

async function createMailTransporter() {
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  return transporter;
}

export async function sendVerificationEmail(
  name: string,
  email: string,
  token: string,
) {
  const verificationUrl = `http://localhost:${appConfig.port}/api/auth/verify?token=${token}`;
  const transporter = await createMailTransporter();
  const mailOptions = {
    from: '"Security Team" <no-reply@food-delivery.com>',
    to: email,
    subject: "Verify Your Email Address",
    html: `<div style="font-family: sans-serif; background-color: #f9f9f9; padding: 20px;">
    <div style="background: #ffffff; border-radius: 8px; padding: 40px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      <h2>Welcome to the Platform, ${name}!</h2>
      <p>Thank you for signing up. Please verify your email address to secure your account:</p>
      <br />
      <a href="${verificationUrl}" style="background-color: #ff5a1f; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Verify Email Address</a>
      <br /><br />
      <p style="color: #666; font-size: 12px;">This link will expire in 24 hours.</p>
    </div>
  </div>`,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("-----------------------------------------");
  console.log("Mock Email Sent Successfully!");
  console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
  console.log("Token: ", token);
  console.log("-----------------------------------------");
}

// -------------------- RESEND ----------------------
// import { Resend } from "resend";
// import appConfig from "../config/app.configs";

// const resend = new Resend(appConfig.resend_api_key);

// export async function sendVerificationEmail(
//   name: string,
//   email: string,
//   token: string,
// ) {
//   const verificationUrl = `http://localhost:${appConfig.port}/api/auth/verify?token=${token}`;

//   try {
//     await resend.emails.send({
//       from: "onboarding@resend.dev",
//       to: email,
//       subject: "Verify you email address",
//       template: {
//         id: "email-verification",
//         variables: {
//           name,
//           verificationUrl,
//         },
//       },
//     });
//   } catch (err) {
//     console.error("Failed to send real email via Resend:", err);
//   }
// }
