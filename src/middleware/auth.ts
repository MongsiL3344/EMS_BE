import type { NextFunction, Request, Response } from "express";
import type { UserServiceInterface } from "../types/User.Type.js";
import { sessionConfig } from "../config/session.js";

/* 인증 미들웨어 -> 세션 확인 시에는 여기서 바로 리턴 */
export const auth =
  (userService: UserServiceInterface) =>
  async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 쿠키에서 sid 존재 찾기 -> 쿠키가 없으면 NOT_SID 응답
    const sid = (req as any).cookies?.[sessionConfig.cookieName];
    if (!sid) {
      return res.status(400).json({ok: false, message: "NOT_SID"});
    }

    // 세션 존재시 -> 쿠키에 담긴 세션ID로 세션상태 확인하기
    const check = await userService.checkSessionBySid(sid);

    // 세션상태 : valid 일시 -> 유저정보 응답
    if (check.state === "valid") {
      return res.status(200).json(check.user);
    }

    // 세션상태 : expired 일시 -> SESSION_EXPIRED 응답
    if (check.state === "expired") {
      return res.status(400).json({ok: false, message: "SESSION_EXPIRED"});
    }

    // 세션상태 : 세션없을 시 UNAUTHORIZED 응답
    return res.status(400).json({ok: false, message: "UNAUTHORIZED"});
  } catch (error) {
    console.error("[MIDDLEWARE] UNKNOWN_ERROR");
  }
};
