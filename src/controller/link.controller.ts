import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/apiError";
import LinkModle from "../model/link.model";
import ContentModel from "../model/content.model";

const randomString = () => {
  const string = "qwertpoiuadjhzcnxme12354987";
  let ans = "";
  for (let i = 0; i <= 10; i++) {
    ans = string[Math.floor(Math.random() * string.length)] + ans;
  }
  return ans;
};

export const shareLink = asyncHandler(async (req: Request, res: Response) => {
  const share = req.body.share;
  if (!share) {
    await LinkModle.deleteOne({ userId: req.user._id });
    return res.json({ meassage: "link Deactivated1" });
  }
  const existingLink = await LinkModle.findOne({ userId: req.user._id });
  if (existingLink) {
    await LinkModle.deleteOne({ userId: req.user._id });
    return res.json({ meassage: "link Deactivated2" });
  }
  const hash = randomString();
  const link = await LinkModle.create({
    hash,
    userId: req.user._id,
  });

  res
    .status(200)
    .json(new ApiResponse(200, { link: "api/v1/" + hash }, "sharebale Link"));
});

export const showdataViaLink = asyncHandler(
  async (req: Request, res: Response) => {
    const hash = req.params.shareLink;
    if (!hash) {
      throw new ApiError(400, "no hash value");
    }

    const link = await LinkModle.aggregate([
      { $match: { hash } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "contents",
          localField: "userId",
          foreignField: "userId",
          as: "content",
        },
      },

      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 0,
          hash: 1,
          user: {
            username: 1,
          },
          content: 1,
        },
      },
    ]);

    if (!link) throw new ApiError(500, "cannot featched link");

    res.status(200).json(new ApiResponse(200, link, "content "));
  },
);
