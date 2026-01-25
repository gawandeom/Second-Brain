import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import ContentModel from "../model/content.model";
import TagsModel from "../model/tags.model";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/ApiResponse";
import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";

export const createContent = asyncHandler(async (req: Request, res: Response) => {
  const contentBodyValidations = z.object({
    title: z.string().min(6, "Title must have at least 6 character"),
    type: z.string(),
    tags: z.array(z.string()),
    link: z.string(),
  });

  const result = contentBodyValidations.safeParse(req.body);
  if (!result.success) {
    return res.json({
      error: result.error.issues,
    });
  }

  const { title, type, tags, link } = result.data;
  const createtags = await TagsModel.updateOne(
    { userId: req.user._id },
    {
      $addToSet: { tags: { $each: tags } },
    },
    { upsert: true },
  );
  if (!createtags.acknowledged) {
    throw new ApiError(500, "Failed to create tags");
  }
  const content = await ContentModel.create({
    title,
    type,
    tags,
    link,
    userId: req.user._id,
  });

  res.status(201).json(new ApiResponse(200,content,"content added successfully"))
});

export const getContent =asyncHandler( async(req:Request,res:Response,next:NextFunction)=>{
  
    if (!req.user || !req.user._id) {
        throw new ApiError(401, "Authentication required");
      }
    const content =await ContentModel.find({userId:req.user._id}).sort({
        createdAt: -1,
      });
    res.status(200).json(new ApiResponse(200,content,"all Content fetched"))
 
})
export const getContentById = asyncHandler(async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  
    const id = req.params.id;
    if (!id || isValidObjectId(id)) {
      throw new ApiError(400, "Invalid content id");
    }

    const content = await ContentModel.findById(id);

    if (!content) {
      throw new ApiError(404, "Content not found");
    }

    // Optionally verify ownership:
    if (req.user && content.userId.toString() !== req.user._id) {
      throw new ApiError(403, "Not authorized to access this content");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, content, "Content fetched"));
  
});