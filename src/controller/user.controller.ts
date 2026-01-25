import { Request, Response } from "express";
import { z } from "zod";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/ApiResponse";
import UserModel from "../model/user.model";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";

const passwordValidation = z
  .string()
  .min(3, "password must have at least 3 character")
  .max(12, "password can have maximum 12 characters")
  .regex(/[a-z]/, "password must have at least one lowercase letter")
  .regex(/[A-Z]/, "password must have at least one Uppercase letter")
  .regex(/[0-9]/, "Password must have at least one numeric value")
  .regex(/[^A-Za-z0-9]/, "must have at least one special cahracter");

export const registerUser = async (req: Request, res: Response) => {
  const registerBodySchema = z.object({
    username: z.string().min(3, "username must have at least 3 character"),
    email: z.email(),
    password: passwordValidation,
  });
  const result = registerBodySchema.safeParse(req.body);
  if (!result.success) {
    res.status(411).json({
      message: "invalid credentials",
      errors: result.error.issues,
    });
    return;
  }
  const { username, email, password } = result.data;
  const userexist = await UserModel.findOne({ username });
  if (userexist) throw new ApiError(403, "User already exists");
  const user = await UserModel.create({ username, email, password });
  if (!user) {
    throw new ApiError(500, "User not createed");
  }
  const safeUser = await UserModel.findOne({ username: user.username });

  res
    .status(200)
    .json(new ApiResponse(200, safeUser, "User created Successfully"));
};

export const loginUser = async (req: Request, res: Response) => {
  const loginbody = z.object({
    email: z.email(),
    password: passwordValidation,
  });
  const result = loginbody.safeParse(req.body);
  if (!result.success) {
    res.json({
      message: "invalid credentials",
      errors: result.error.issues,
    });
    return;
  }
  const { email, password } = result.data;
  const user = await UserModel.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(400, "User does not exits");
  }
  const isPassValid = user.isPasswordCorrect(password);
  if (!isPassValid) throw new ApiError(400, "Invalid Credentials");

  const accessToken = jwt.sign(
    { _id: user._id.toString() },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "1d" },
  );

  res
    .status(200)
    .cookie("accessToken", accessToken)
    .json(new ApiResponse(200, user, "User Loged In successfully"));
};


export const logout = asyncHandler(async(req:Request,res:Response)=>{
  const user = req.user._id;
  if(!user) throw new ApiError(400,"unothorized Access")
    res.clearCookie("accessToken").status(200).json(new ApiResponse(200,{},"user Loged out"))
})
