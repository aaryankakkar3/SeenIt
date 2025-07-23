import mongoose from "mongoose";

const animeCacheSchema = new mongoose.Schema(
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
    episodesTotal: {
      type: Number,
      default: 0,
    },
    animeStatus: {
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
animeCacheSchema.index({ jikanId: 1, lastUpdated: 1 });

const AnimeCache = mongoose.model("AnimeCache", animeCacheSchema);

export default AnimeCache;
