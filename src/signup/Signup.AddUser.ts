import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';

export async function addUser(req: Request, res: Response) {
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
}
