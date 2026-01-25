import mongoose from "mongoose";

const linkSchema = new mongoose.Schema(
  {
    hash: { type: String, required: true, unique: true },
    userId: { type: mongoose.Types.ObjectId, ref: "User" , unique: true},
   
  },
  { timestamps: true },
);

const LinkModle = mongoose.model("Link", linkSchema);
export default LinkModle;
