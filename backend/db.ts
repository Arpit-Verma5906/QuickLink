import mongoose from "mongoose";

const mongoURI = "mongodb://localhost:27017/QuickLink";

mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err));
