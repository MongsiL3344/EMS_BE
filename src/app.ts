import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { UserController } from "./user/User.Controller.js";
import { UserService } from "./user/User.Service.js";
import { UserRepository } from "./user/User.Repository.js";
import { pool } from "./config/db.js";
import { auth } from "./middleware/auth.js";

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
app.post("/api/login", userController.login);
app.get("/api/me", auth(userService));


app.listen(8080, () => console.log("http://localhost:8080"));
