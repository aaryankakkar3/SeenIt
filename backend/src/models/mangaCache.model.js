import mongoose from "mongoose";

const mangaCacheSchema = new mongoose.Schema(
  {
    jikanId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: "https://placehold.co/90x129",
    },
    year: {
      type: Number,
      default: 0,
    },
    released: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "Unknown",
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries by jikanId and lastUpdated
mangaCacheSchema.index({ jikanId: 1, lastUpdated: 1 });

const MangaCache = mongoose.model("MangaCache", mangaCacheSchema);

export default MangaCache;
