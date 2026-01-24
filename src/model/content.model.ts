import mongoose, { model,Schema, Types } from "mongoose";

const contentTypes = ["image", "video", "article", "audio"];
const contentSchema = new Schema(
  {
    type: {
      type: String,
      enums: contentTypes,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: Types.ObjectId,
        ref: "Tag",
      },
    ],
    link: {
      type: String,
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const ContentModel =  model("Content",contentSchema)
export default ContentModel