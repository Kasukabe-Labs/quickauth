import { Request, Response, Router } from "express";
import {
  signinController,
  signupController,
} from "../controllers/authController";

const AuthRouter = Router();

AuthRouter.post("/signup", (req: Request, res: Response) => {
  signupController(req, res);
});

AuthRouter.post("/signin", (req: Request, res: Response) => {
  signinController(req, res);
});

AuthRouter.post("/logout", (req: Request, res: Response) => {
  //logoutController()
});

AuthRouter.get("/me", (req: Request, res: Response) => {
  //me()
});

AuthRouter.get("/google", (req: Request, res: Response) => {
  //googleController()
});

AuthRouter.get("/google/callback", (req: Request, res: Response) => {
  //googleCallbackController()
});

AuthRouter.get("/github", (req: Request, res: Response) => {
  //githubController()
});

AuthRouter.get("/github/callback", (req: Request, res: Response) => {
  //githubCallbackController()
});

export default AuthRouter;
