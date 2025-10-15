import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 8080;
const USER = {
  email: "test@example.com",
  password: "pass1234",
} as const;

type LoginBody = { email: string; password: string };
type LoginResult = { ok: boolean; user?: { email: string }; message: string };

function isLoginBody(body: unknown): body is LoginBody {
  return (
    typeof (body as any)?.email === "string" &&
    typeof (body as any)?.password === "string"
  );
}

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

//POST ./api/login
app.post(
  "/api/login",
  (req: Request<{}, LoginResult, LoginBody>, res: Response<LoginResult>) => {
    const body = req.body;
    if (!isLoginBody(body)) {
      return res.status(400).json({ ok: false, message: "INVALID_BODY" });
    }

    const { email, password } = body;
    if (email === USER.email && password === USER.password) {
      console.log(`[SERVER_LOG]"${email}" Success to login`);
      return res.status(200).json({ ok: true, user: { email }, message: "Login Success" });
    }
    console.log(`[SERVER_LOG]"${email}" failed to login`);
    console.log(`[SERVER_LOG]"${email}" Failed to login`);
    return res.status(400).json({ ok: false, message: "INVALID_BODY" });
  }
);

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
