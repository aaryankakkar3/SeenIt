import mongoose from "mongoose";

const movieCacheSchema = new mongoose.Schema(
  {
    jikanId: {
      type: String, // OMDB uses string IDs (IMDB IDs)
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
movieCacheSchema.index({ jikanId: 1, lastUpdated: 1 });

const MovieCache = mongoose.model("MovieCache", movieCacheSchema);

export default MovieCache;
