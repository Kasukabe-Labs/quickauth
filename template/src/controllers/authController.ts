import { Request, Response } from "express";
import { UserModel } from "../models/user.schema";
import { comparePassword, encryptPassword } from "../utils/encryptPassword";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken";
import { sendToken } from "../utils/sendToken";
import jwt from "jsonwebtoken";

export async function signupController(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Email, password and name are required",
      });
    }

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await encryptPassword(password);

    const newUser = new UserModel({
      email,
      password: hashedPassword,
      name,
    });
    await newUser.save();

    const refreshToken = generateRefreshToken(newUser._id!.toString());
    const accessToken = generateAccessToken(newUser._id!.toString());

    sendToken(res, accessToken, refreshToken, "User created successfully");

    res.status(201).json({
      message: "User created successfully",
    });

    return;
  } catch (error) {
    console.log("Signup error", error);
    return res.status(500).json({
      message: "Signup error",
      error: error,
    });
  }
}

export async function signinController(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email, password and name are required",
      });
    }
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "User not found, please signup",
      });
    }

    const passwordMatched = await comparePassword(password, user?.password);

    if (!passwordMatched) {
      return res.status(401).json({
        message: "Password not matched",
      });
    }
    const refreshToken = generateRefreshToken(user._id!.toString());
    const accessToken = generateAccessToken(user._id!.toString());

    sendToken(res, accessToken, refreshToken);

    res.status(200).json({
      message: "Login successful",
    });
    return;
  } catch (error) {
    console.log("Login error", error);
    return res.status(500).json({
      message: "Login error",
      error: error,
    });
  }
}

export function logoutController(_req: Request, res: Response) {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({ message: "Logged out" });
}

export async function me(req: Request, res: Response) {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_SECRET!) as {
      id: string;
    };

    const user = await UserModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const accessToken = generateAccessToken(user._id!.toString());

    return res.status(200).json({
      user,
      accessToken,
      message: "User verified",
    });
  } catch (error) {
    console.log("Me controller error: ", error);
    return res.status(500).json({
      message: "Error in me controller",
      error: error,
    });
  }
}
