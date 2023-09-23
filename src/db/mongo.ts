import "dotenv/config";
import mongoose from "mongoose";

const url = process.env.database_url;

export async function connectDatabase() {
  await mongoose.connect(url ? url : "", {}).then(async () => {
    console.log("💾 Connection with database established");
  });
}
