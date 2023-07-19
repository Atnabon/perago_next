import mongoose from "mongoose";

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to database")
  } catch (error) {
    throw new Error("Connection failed!");
  }
};

export default connect;
