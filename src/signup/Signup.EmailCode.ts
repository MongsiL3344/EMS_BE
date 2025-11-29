import crypto from 'crypto';
import 'dotenv/config';
import type { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';

/**
 * gmail == env
 *
 * @param req email
 * @param res emailcode
 */
export async function sendCode(req: Request, res: Response) {
  const resend = new Resend(process.env.RESEND_API);
  resend.domains.create({ name: 'ems.sendmail.com' });

  try {
    const code = generateSecureCode();
    //resend code
    const { data, error } = await resend.emails.send({
      from: 'turt1e18@turt1e18.work',
      to: [req.body.email],
      subject: 'Your Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Verification Code</h2>
          <p>Your verification code is:</p>
          <h1 style="color: #4CAF50; letter-spacing: 5px;">${code}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      return res.status(400).json({ error });
    }

    res.status(200).json({
      success: true,
      code: code,
    });

    //gamil code
    // const mailOptions = {
    //   from: process.env.GMAIL_USER,
    //   to: req.body.email,
    //   subject: 'Your Verification Code',
    //   html: `
    //     <div style="font-family: Arial, sans-serif; padding: 20px;">
    //       <h2>Verification Code</h2>
    //       <p>Your verification code is:</p>
    //       <h1 style="color: #4CAF50; letter-spacing: 5px;">${code}</h1>
    //       <p>This code will expire in 10 minutes.</p>
    //       <p>If you didn't request this code, please ignore this email.</p>
    //     </div>
    //   `,
    // };
    // await transporter.sendMail(mailOptions).then(() => {
    //   res.status(200).json({
    //     success: true,
    //     code: code,
    //   });
    // });
  } catch (err) {
    console.error('Send code error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to send verification code',
    });
  }
}

// 지메일
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address
    pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password
  },
});

// 6자리 코드 생성
export const generateSecureCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';

  // Use crypto for secure random generation
  const randomBytes = crypto.randomBytes(6);

  for (let i = 0; i < 6; i++) {
    const byte = randomBytes[i];
    if (byte !== undefined) {
      code += chars[byte % chars.length];
    }
  }

  return code;
};
