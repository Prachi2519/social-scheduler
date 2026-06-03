import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error(
        "Missing MONGODB_URI. Add it to server/.env, for example: MONGODB_URI=mongodb://127.0.0.1:27017/social-scheduler",
      );
    }

    mongoose.connection.on("connected", async () => {
      console.log("MongoDB connected");
    });

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    console.error(`MongoDB connection failed: ${message}`);
    console.error(
      "Start MongoDB locally, or set MONGODB_URI in server/.env to your MongoDB Atlas connection string.",
    );
    process.exit(1);
  }
};

export default connectDB;
