import type { Request, Response } from 'express';
import type {RentRequest} from "../types/Rent.Type.js";
import {rentItemService} from "./Rent.Service.js";
import {sessionConfig} from "../config/session.js";
import { userService } from '../user/User.Service.js';

/**
 * 대여 실행하는 컨트롤러 함수
 * 성공시에는 반환값 없음
 * 실패시에는 500
 * @return void | 500
 */
export async function rentItemController(req : Request, res:Response) {
  const sid = req.cookies[sessionConfig.cookieName];
  if (!sid) {
    return res.status(401).json({message: "NO_SESSION" });
  }
  try {
  const sessionStatus = await userService.checkSessionBySid(sid);
  if (sessionStatus.state === 'invalid') {
    return res.status(401).json({ message: 'SESSION_INVALID' });
  }
  if (sessionStatus.state === 'expired') {
    return res.status(401).json({ message: 'SESSION_EXPIRED' });
  }
  const userId = sessionStatus.user.id;

  const rentRequest: RentRequest = {
    userId,
    itemId: req.body.itemId,
    quantity: req.body.quantity
  };
    await rentItemService(rentRequest);
    res.status(200).json({message: 'rent success'});
  } catch (error) {
    console.error("대여 실패");
    res.status(500).json({error: 'Internal server error'});
  }
}