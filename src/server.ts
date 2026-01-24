import express from "express";
import dotenv from "dotenv";
import app from "./app";
import { connectToDB } from "./db/db.config";
dotenv.config();
const PORT = process.env.PORT || 4000;

const startSrver = () => {
  try {
    connectToDB();
    app.listen(PORT, () => {
      console.log("server is listenign on port: ", PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

startSrver();