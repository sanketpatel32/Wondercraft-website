import mongoose from "mongoose";
import fs from "fs";
import bcrypt from "bcryptjs";
import User from "../models/user";

const envPath = ".env";

async function seed() {
  let uri = process.env.MONGODB_URI || "";
  if (!uri) {
    try {
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, "utf-8");
        const match = envContent.match(/^MONGODB_URI=(.+)$/m);
        if (match) {
          uri = match[1].trim();
        }
      }
    } catch (err) {
      console.warn("Could not read .env file:", err);
    }
  }

  if (!uri) {
    console.error("❌ MONGODB_URI is not defined in process.env or .env file!");
    process.exit(1);
  }

  try {
    console.log("Connecting to database to seed Super Admin...");
    await mongoose.connect(uri);
    
    const hashedPassword = await bcrypt.hash("Codecode21@", 10);
    
    const superAdmin = await User.findOneAndUpdate(
      { role: "superadmin" },
      {
        name: "Super Admin",
        email: "sanpatel323@gmail.com",
        password: hashedPassword,
        status: "active",
      },
      { new: true, upsert: true }
    );
    
    console.log("✅ Super Admin upserted successfully in MongoDB!");
    console.log("Email:", superAdmin.email);
    console.log("Role:", superAdmin.role);
    
    await mongoose.disconnect();
  } catch (err: any) {
    console.error("❌ Seeding failed:", err.message || err);
    process.exit(1);
  }
}

seed();
