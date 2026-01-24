import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/apiError";
import jwt, { JwtPayload } from "jsonwebtoken";
import UserModel from "../model/user.model";
interface AccessTokenPayload extends JwtPayload {
  _id: string;
}
const verifyJwt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
    if (!token) throw new ApiError(400, "Expired Access Token");
    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!,
    ) as AccessTokenPayload;
    const user = await UserModel.findById(decodedToken._id);
    if (!user) {
      return res.status(401).json(new ApiError(401, "User not found"));
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json(new ApiError(401, "Invalid or Expired Access Token"));
  }
};

export default verifyJwt;
