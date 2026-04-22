import mongoose from "mongoose";

let isConnected = false;

const connectDB = async (): Promise<boolean> => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/impactsphere";
    
    mongoose.set("strictQuery", true);
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    
    isConnected = true;
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (error: any) {
    isConnected = false;
    console.warn(`⚠️  MongoDB not available: ${error.message}`);
    console.warn(`   Update MONGO_URI in server/.env with your MongoDB connection string`);
    console.warn(`   You can use MongoDB Atlas (free): https://www.mongodb.com/atlas`);
    return false;
  }
};

export const getConnectionStatus = () => isConnected;

export default connectDB;
