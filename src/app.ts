import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { UserController } from "./user/User.Controller.js";
import { UserService } from "./user/User.Service.js";
import { UserRepository } from "./user/User.Repository.js";
import { pool } from "./config/db.js";

// express app
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

// 레이어별 인스턴스 생성 + 주입
const userRepository = new UserRepository(pool);
const userService  = new UserService(userRepository);
const userController = new UserController(userService);

//라우팅
app.post("/api/login", userController.login);                 // 로그인 요청
app.post("/api/logout", userController.logout);               // 로그아웃 요청
app.get("/api/checkSession", userController.checkSession);    // 세션 확인용


app.listen(8080, () => console.log("http://localhost:8080"));
