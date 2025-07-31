import mongoose from "mongoose";

const gameCacheSchema = new mongoose.Schema(
  {
    jikanId: {
      type: Number, // RAWG uses numeric IDs
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
gameCacheSchema.index({ jikanId: 1, lastUpdated: 1 });

const GameCache = mongoose.model("GameCache", gameCacheSchema);

export default GameCache;
