import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Comic Cache Schema (simplified for this script)
const comicCacheSchema = new mongoose.Schema({
  jikanId: { type: mongoose.Schema.Types.Mixed, required: true, unique: true },
  title: { type: String, required: true },
  year: { type: Number, default: 0 },
  imageUrl: { type: String, default: "https://placehold.co/90x129" },
  lastUpdated: { type: Date, default: Date.now },
  released: { type: Number, default: 0 },
  status: { type: String, default: "Unknown" },
});

const ComicCache = mongoose.model("ComicCache", comicCacheSchema);

async function clearComicCache() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Delete all comic cache entries
    const result = await ComicCache.deleteMany({});
    console.log(`Deleted ${result.deletedCount} comic cache entries`);

    // Close connection
    await mongoose.connection.close();
    console.log("Comic cache cleared successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error clearing comic cache:", error);
    process.exit(1);
  }
}

clearComicCache();
