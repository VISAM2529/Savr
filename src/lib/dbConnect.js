const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log("Database already connected.");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("Connecting to database...");
    cached.promise = mongoose
      .connect(MONGODB_URI, {})
      .then((mongoose) => {
        console.log("Database connected successfully.");
        return mongoose;
      })
      .catch((error) => {
        console.error("Database connection failed:", error);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = dbConnect;
