import { Request, Response } from "express";
import { getGoogleAuthUrl, getGoogleUser } from "../utils/google";
import { UserModel } from "../models/user.schema";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken";
import { sendToken } from "../utils/sendToken";

export async function googleAuthRedirect(_req: Request, res: Response) {
  const url = getGoogleAuthUrl();
  res.redirect(url);
}

export async function googleAuthCallback(req: Request, res: Response) {
  const code = req.query.code as string;
  if (!code) return res.status(400).json({ message: "Code is missing" });

  try {
    const googleUser = await getGoogleUser(code);
    const existingUser = await UserModel.findOne({ email: googleUser.email });

    let user = existingUser;

    if (!user) {
      user = await UserModel.create({
        email: googleUser.email,
        pfp: googleUser.picture,
        name: googleUser.name,
        oauth: true,
      });
    }

    const refreshToken = generateRefreshToken(user._id!.toString());
    const accessToken = generateAccessToken(user._id!.toString());

    sendToken(res, accessToken, refreshToken, "Google login successful");

    res.send(`
      <html>
        <head>
          <meta http-equiv="refresh" content="0; URL='${process.env.CLIENT_URL}'" />
          <script>
            window.location.href = '${process.env.CLIENT_URL}';
          </script>
        </head>
        <body>
          Redirecting...
        </body>
      </html>
    `);
    return;
  } catch (error) {}
}
