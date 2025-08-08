import nodemailer from "nodemailer";

// Create transporter using Gmail SMTP
const createTransporter = () => {
  console.log("Creating Gmail transporter with:", {
    user: process.env.GMAIL_EMAIL,
    passwordSet: !!process.env.GMAIL_APP_PASSWORD,
  });

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};

export const sendVerificationEmail = async (to, token) => {
  try {
    const transporter = createTransporter();
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    const mailOptions = {
      from: {
        name: "SeenIt",
        address: process.env.GMAIL_EMAIL,
      },
      to: to,
      subject: "Verify Your Email Address",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
          <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;600&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: 'Roboto Mono', monospace;
              line-height: 1.2rem;
              color: #f2f2f2;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #000000;
            }
            .container {
              background-color: #0d0d0d;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #c6ff01;
              margin: 0;
              font-size: 40px;
              font-weight: 600;
              letter-spacing: -1.5px;
            }
            .content {
              margin-bottom: 30px;
            }
            .content h2 {
              color: #f2f2f2;
              font-size: 32px;
              font-weight: 600;
              letter-spacing: -1.5px;
              margin: 0 0 20px 0;
            }
            .content p {
              color: #f2f2f2;
              font-size: 16px;
              margin: 16px 0;
            }
            .button {
              display: inline-block;
              background-color: #c6ff01;
              color: #000000;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 4px;
              font-weight: 600;
              text-align: center;
              margin: 20px 0;
              font-size: 16px;
            }
            .button:hover {
              background-color: #e3ff80;
              color: #000000;
            }
            .button:visited {
              color: #000000;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 14px;
              color: #b2b2b2;
            }
            .link {
              word-break: break-all;
              color: #c6ff01;
              text-decoration: none;
            }
            .link:visited {
              color: #c6ff01;
            }
            .link:hover {
              color: #e3ff80;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>SeenIt</h1>
            </div>
            <div class="content">
              <h2>Welcome to SeenIt!</h2>
              <p>Thank you for signing up. To complete your registration and start tracking your favorite media, please verify your email address by clicking the button below:</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>
              
              <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
              <p><a href="${verificationUrl}" class="link">${verificationUrl}</a></p>
              
              <p><strong>Important:</strong> This verification link will expire in 1 hour for security reasons.</p>
              
              <p>If you didn't create an account with SeenIt, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2025 SeenIt. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully:", info.messageId);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

export const sendPasswordResetEmail = async (to, token) => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const mailOptions = {
      from: {
        name: "SeenIt",
        address: process.env.GMAIL_EMAIL,
      },
      to: to,
      subject: "Reset Your Password",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;600&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: 'Roboto Mono', monospace;
              line-height: 1.2rem;
              color: #f2f2f2;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #000000;
            }
            .container {
              background-color: #0d0d0d;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #c6ff01;
              margin: 0;
              font-size: 40px;
              font-weight: 600;
              letter-spacing: -1.5px;
            }
            .content {
              margin-bottom: 30px;
            }
            .content h2 {
              color: #f2f2f2;
              font-size: 32px;
              font-weight: 600;
              letter-spacing: -1.5px;
              margin: 0 0 20px 0;
            }
            .content p {
              color: #f2f2f2;
              font-size: 16px;
              margin: 16px 0;
            }
            .button {
              display: inline-block;
              background-color: #c6ff01;
              color: #000000;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 4px;
              font-weight: 600;
              text-align: center;
              margin: 20px 0;
              font-size: 16px;
            }
            .button:hover {
              background-color: #e3ff80;
              color: #000000;
            }
            .button:visited {
              color: #000000;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 14px;
              color: #b2b2b2;
            }
            .link {
              word-break: break-all;
              color: #c6ff01;
              text-decoration: none;
            }
            .link:visited {
              color: #c6ff01;
            }
            .link:hover {
              color: #e3ff80;
            }
            .warning {
              background-color: #1a1a1a;
              border: 1px solid #c6ff01;
              border-radius: 4px;
              padding: 15px;
              margin: 20px 0;
              color: #f2f2f2;
            }
            .warning ul {
              margin: 10px 0;
              padding-left: 20px;
            }
            .warning li {
              margin: 8px 0;
              color: #f2f2f2;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>SeenIt</h1>
            </div>
            <div class="content">
              <h2>Password Reset Request</h2>
              <p>We received a request to reset your password for your SeenIt account. If you made this request, click the button below to reset your password:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              
              <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
              <p><a href="${resetUrl}" class="link">${resetUrl}</a></p>
              
              <div class="warning">
                <p><strong>Important Security Information:</strong></p>
                <ul>
                  <li>This password reset link will expire in 1 hour for security reasons</li>
                  <li>If you didn't request a password reset, you can safely ignore this email</li>
                  <li>Your password will remain unchanged until you create a new one using the link above</li>
                </ul>
              </div>
              
              <p>If you continue to have problems, please contact our support team.</p>
            </div>
            <div class="footer">
              <p>© 2025 SeenIt. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully:", info.messageId);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};
