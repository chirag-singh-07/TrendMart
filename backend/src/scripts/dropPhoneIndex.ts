import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const dropPhoneIndex = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("MONGODB_URI not found in env");
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB.");

    const db = mongoose.connection.db;
    if (!db) {
        throw new Error("DB connection not found");
    }
    
    const collection = db.collection("users");
    
    console.log("Dropping phone index if exists...");
    try {
      await collection.dropIndex("phone_1");
      console.log("Successfully dropped phone_1 index.");
    } catch (e: any) {
      if (e.codeName === "IndexNotFound") {
        console.log("Index phone_1 not found, nothing to drop.");
      } else {
        console.error("Error dropping index:", e.message);
      }
    }

    await mongoose.disconnect();
    console.log("Disconnected.");
    process.exit(0);
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
};

dropPhoneIndex();
