import mongoose from "mongoose";
require('dotenv').config({ path: './config/config.env' });

const dbconnection = async () => {
  try {
           
     await mongoose.connect(process.env.DB_URL || "mongodb://localhost:27017/LMSdatabase");
      console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process with failure
  }  
};
export default dbconnection;