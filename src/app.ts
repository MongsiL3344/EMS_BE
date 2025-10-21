import bcrypt from 'bcrypt';
import cors from 'cors';
import crypto from 'crypto';
import dotenv from 'dotenv';
import 'dotenv/config';
import type { Request, Response } from 'express';
import express from 'express';
import nodemailer from 'nodemailer';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 8080;
const USER = {
  email: 'test@example.com',
  password: 'pass1234',
} as const;

type LoginBody = { email: string; password: string };
type LoginResult = { ok: boolean; user?: { email: string }; message: string };

function isLoginBody(body: unknown): body is LoginBody {
  return typeof (body as any)?.email === 'string' && typeof (body as any)?.password === 'string';
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address
    pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password
  },
});

// 6자리 코드 제작
const generateSecureCode = (): string => {
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

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

//POST ./api/login
app.post('/api/login', (req: Request<{}, LoginResult, LoginBody>, res: Response<LoginResult>) => {
  const body = req.body;
  if (!isLoginBody(body)) {
    return res.status(400).json({ ok: false, message: 'INVALID_BODY' });
  }

  const { email, password } = body;
  if (email === USER.email && password === USER.password) {
    console.log(`[SERVER_LOG]"${email}" Success to login`);
    return res.status(200).json({ ok: true, user: { email }, message: 'Login Success' });
  }
  console.log(`[SERVER_LOG]"${email}" failed to login`);
  console.log(`[SERVER_LOG]"${email}" Failed to login`);
  return res.status(400).json({ ok: false, message: 'INVALID_BODY' });
});

// testing
app.post('/api/signup', async (req: Request, res: Response) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.pw, 10);
    console.log(req.body);
    res.status(201).json({
      success: true,
      message: 'Member registered successfully',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

//testing
app.post('/api/send-code', async (req: Request, res: Response) => {
  try {
    const code = generateSecureCode();
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: req.body.email,
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
    };
    await transporter.sendMail(mailOptions).then(() => {
      res.status(200).json({
        success: true,
        code: code,
      });
    });
  } catch (err) {
    console.error('Send code error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to send verification code',
    });
  }
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
