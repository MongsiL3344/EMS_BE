import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import { pool } from '../config/db.js';

export async function addUser(req: Request, res: Response) {
  try {
    const { email, password, name, dept, team, position } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(req.body);
    const sql = `
      INSERT INTO users
      (email, password_hash, name, dept, team, position)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await pool.execute(sql, [
      email,
      hashedPassword,
      name || null,
      dept || null,
      team || null,
      position || null,
    ]);

    return res.status(201).json({ message: '회원가입 성공' });
  } catch (error: any) {
    console.error('회원가입 에러:', error);

    // 이메일 중복 처리
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
    }

    return res.status(500).json({ message: '서버 오류' });
  }
}
