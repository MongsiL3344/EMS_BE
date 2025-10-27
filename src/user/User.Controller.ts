import type { Request, Response, NextFunction} from "express";
import { UserBody , type UserServiceInterface} from "../types/User.Type.js";
import { sessionConfig } from "../config/session.js";

export class UserController {

  constructor(private readonly userService : UserServiceInterface) {}

  // 메인 로그인
  public login = async (req: Request, res: Response, next : NextFunction)=> {
    try{
      const userInputData = UserBody.parse(req.body); // zod로 검증한 입력값을 유저인풋데이터로 활용
      const serviceResponse = await this.userService.login(userInputData); //service레이어 로그인 처리 (리턴값 -> serviceResponse에 저장)
      if (!serviceResponse.ok) {
        return res.status(400).json({ ok: false, user: serviceResponse.user, message: serviceResponse.message });
      }

      // 로그인처리가 잘 됐을 시 -> serviceResponse에 세션,쿠키 정보가 담겨옴 -> 해당 정보 이용해 쿠키 굽고 클라이언트로 전송
      res.cookie(sessionConfig.cookieName, serviceResponse.session.session_id, sessionConfig.cookie);

      return res.status(200).json({ ok: true, user: serviceResponse.user, message: serviceResponse.message });
    } catch (error) {
      console.error("[CONTROLLER] UNKNOWN_ERROR");
      return res.status(400).json({ok : false, message : "LOGIN_FAILED"});
    }
  }
}