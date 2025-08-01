import { Resend } from "resend";

export const sendVerificationEmail = async (to, token) => {
  try {
    // Create Resend instance inside the function to ensure env vars are loaded
    const resend = new Resend(process.env.RESEND_API_KEY);

    const verificationUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-email?token=${token}`;

    const { data, error } = await resend.emails.send({
      from: "SeenIt <onboarding@resend.dev>", // Using Resend's test domain
      to: [to],
      subject: "Verify Your Email Address",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
          <style>
            body {
              font-family: 'Roboto Mono', monospace;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .container {
              background-color: #ffffff;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #526020;
              margin: 0;
              font-size: 28px;
            }
            .content {
              margin-bottom: 30px;
            }
            .button {
              display: inline-block;
              background-color: #526020;
              color: #ffffff;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 4px;
              font-weight: 600;
              text-align: center;
              margin: 20px 0;
            }
            .button:hover {
              background-color: #3d4818;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 14px;
              color: #666;
            }
            .link {
              word-break: break-all;
              color: #526020;
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
              <p class="link">${verificationUrl}</p>
              
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
    });

    if (error) {
      console.error("Error sending verification email:", error);
      throw new Error("Failed to send verification email");
    }

    console.log("Verification email sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Error in sendVerificationEmail:", error);
    throw error;
  }
};
