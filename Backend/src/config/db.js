import mongoose from 'mongoose';
import { env } from './env.js';
export async function connectDB(){
  mongoose.connection.on('error',err=>console.error('MongoDB error:',err.message));
  await mongoose.connect(env.MONGODB_URI,{serverSelectionTimeoutMS:10000});
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}
export async function disconnectDB(){await mongoose.disconnect();}
