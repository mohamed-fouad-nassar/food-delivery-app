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
  const verificationUrl = `${appConfig.app_url}/api/auth/verify?token=${token}`;
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
  console.log("Email Sent Successfully!");
  console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
  console.log("Token: ", token);
  console.log("-----------------------------------------");
}

export async function sendResetPasswordToken(
  name: string,
  email: string,
  token: string,
) {
  const resetPasswordUrl = `${appConfig.app_url}/api/auth/reset-password?token=${token}`;
  const transporter = await createMailTransporter();
  const mailOptions = {
    from: '"Security Team" <no-reply@food-delivery.com>',
    to: email,
    subject: "Reset Your Account Password",
    html: `<div style="font-family: sans-serif; background-color: #f9f9f9; padding: 20px;">
    <div style="background: #ffffff; border-radius: 8px; padding: 40px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      <h2>Reset Your Password</h2>
      <p>Hi ${name}, we received a request to reset the password for your account.</p>
      <p>Click the button below to choose a new password:</p>
      <br />
      <a
        href="${resetPasswordUrl}"
        style="background-color: #ff5a1f; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;"
      >Reset Password</a>
      <br /><br />
      <p style="color: #666; font-size: 12px;">This link will expire in 15 minutes.</p>
      <p style="color: #666; font-size: 12px;">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
    </div>
  </div>`,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("-----------------------------------------");
  console.log("Email Sent Successfully!");
  console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
  console.log("Token: ", token);
  console.log("-----------------------------------------");
}
