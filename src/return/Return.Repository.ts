import type { RentedListType } from '../types/Return.Type.js';
import { pool } from '../config/db.js';
import type { RowDataPacket } from 'mysql2';

interface RentedRow extends RowDataPacket {
  item_id: number;
  item_name: string;
  quantity: number;
  rented_at: Date;
  due_at: Date;
}

/**
 * 유저의 대여중인 물품 목록 조회 (물품 이름 포함)
 * @param userId 유저 아이디
 * @returns RentedListType[] 대여 목록
 */
export async function getRentedItemListRepository(userId: number): Promise<RentedListType[]> {
  try {
    const sql = `
      SELECT 
        r.id,
        r.item_id,
        i.name AS item_name,
        r.quantity,
        r.rented_at,
        r.due_at
      FROM rentals r
      JOIN items i ON r.item_id = i.id
      WHERE r.user_id = ? AND r.returned_at IS NULL
      ORDER BY r.rented_at DESC
    `;

    const [rows] = await pool.query<RentedRow[]>(sql, [userId]);

    return rows.map((row) => ({
      id: row.id,
      itemId: row.item_id,
      itemName: row.item_name,
      quantity: row.quantity,
      rentedAt: row.rented_at,
      dueAt: row.due_at,
    }));
  } catch (error) {
    console.error('[REPOSITORY] getRentedItemListRepository error:', error);
    return [];
  }
}
