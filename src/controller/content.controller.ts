import { Request, Response } from "express";
import { z } from "zod";
import ContentModel from "../model/content.model";
import TagsModel from "../model/tags.model";

export const createContent = async (req: Request, res: Response) => {
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


  const content = await ContentModel.create({
    title,
    type,
    link,
    userId: req.user._id,
  });
  const uniqueTags = [...new Set(tags)];
   const tagsobj =  uniqueTags.map((tag:string)=>({tag}))
   console.log(tagsobj)
      const createtags = await TagsModel.insertMany(tagsobj,{ordered:false})
  res.json({
    content,
    createtags
  });
};
