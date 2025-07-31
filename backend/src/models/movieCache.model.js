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

// Add pre-save logging
movieCacheSchema.pre("save", function (next) {
  console.log(
    `[MovieCache] Pre-save hook - attempting to save cache with jikanId:`,
    this.jikanId,
    "title:",
    this.title
  );
  next();
});

// Add post-save logging
movieCacheSchema.post("save", function (doc) {
  console.log(
    `[MovieCache] Post-save hook - successfully saved cache:`,
    JSON.stringify(doc, null, 2)
  );
});

// Add save error logging
movieCacheSchema.post("save", function (error, doc, next) {
  if (error) {
    console.error(
      `[MovieCache] Save error for jikanId ${doc?.jikanId}:`,
      error
    );
  }
  next();
});

const MovieCache = mongoose.model("MovieCache", movieCacheSchema);

export default MovieCache;
