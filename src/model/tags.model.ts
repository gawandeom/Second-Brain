import { model, Schema, Types } from "mongoose";
import { lowercase } from "zod";

const tagsSchema = new Schema({
  userId:{
    type:Types.ObjectId,
    ref:"User"
  },
  tags: [{
    type: String,
    required: true,
    unique: true,
    trim:true,
    lowercase:true
  }],
});

const TagsModel = model("Tag", tagsSchema);

export default TagsModel;
