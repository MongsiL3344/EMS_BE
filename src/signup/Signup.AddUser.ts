import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import { pool } from '../config/db.js';

/**
 *
 * @param req 기존 body 값 + type 1
 * @param res
 * @returns
 */
export async function addUserByAuto(req: Request, res: Response) {
  try {
    const { email, pw, name, dept, team, position, type } = req.body;
    // console.log(req.body);

    const hashedpw = await bcrypt.hash(pw, 10);
    const sql = `
      INSERT INTO users
      (email, password_hash, name, dept, team, position, user_level)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.execute(sql, [
      email,
      hashedpw,
      name || null,
      dept || null,
      team || null,
      position || null,
      type + 2,
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

/**
 *
 * @param req 기존 body 값 + type 2
 * @param res
 * @returns
 */
export async function addUserByManual(req: Request, res: Response) {
  try {
    const { email, pw, name, dept, team, position, type } = req.body;

    const hashedPassword = await bcrypt.hash(pw, 10);
    // console.log(req.body);
    const sql = `
      INSERT INTO signup_requests
      (email, pw, name, dept, team, position, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.execute(sql, [
      email,
      hashedPassword,
      name || null,
      dept || null,
      team || null,
      position || null,
      type - 2,
    ]);

    return res.status(201).json({ message: '회원가입 신청 성공' });
  } catch (error: any) {
    console.error('회원가입 에러:', error);

    // 이메일 중복 처리
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
    }

    return res.status(500).json({ message: '서버 오류' });
  }
}
