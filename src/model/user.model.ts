import mongoose, { Model, model, Schema } from "mongoose";
import { compare, hash } from "bcrypt-ts";
interface IUser{
  username:string,
  email:string,
  password:string
}

interface UserMethods{
  isPasswordCorrect(passwrod:string):Promise<boolean>
}

type UserModelType = Model<IUser,{},UserMethods>

const UserSchema = new Schema<IUser,UserModelType,UserMethods>({
  username:{
    type:String,
    required:true,
    unique:true,
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true,
    select:false,
  }
})


UserSchema.pre("save",async function(){
  if(!this.isModified('password'))return;
  this.password = await hash(this.password,10)
})

UserSchema.methods.isPasswordCorrect = async function (password:string){
return await compare(password,this.password)
}


const UserModel =  model<IUser,UserModelType>("User",UserSchema)
export default UserModel