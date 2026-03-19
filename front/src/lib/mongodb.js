import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://mesterab20_db_user:abdo@cluster0.z1kci3p.mongodb.net/takaful?retryWrites=true&w=majority&appName=Cluster0";

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // If already connected and connection is ready, return it
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // Reset if connection was lost
  if (cached.conn && mongoose.connection.readyState !== 1) {
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 60000,
      family: 4,
      maxPoolSize: 10,
      retryWrites: true,
      retryReads: true,
    };

    console.log('Connecting to MongoDB Atlas...');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB Atlas connected successfully');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    console.error('MongoDB connection error:', e.message);
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
