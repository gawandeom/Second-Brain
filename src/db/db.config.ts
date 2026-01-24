import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      process.env.MONGODB_URI as string,
    );
    console.log(
      `MongoDB Connection Successfull :HOST : ${connectionInstance.connection.host} `,
    );
  } catch (error) {
    console.log(`MongoDB Connection Error : ${error}`);
    process.exit(1);
  }
};
export { connectToDB };
