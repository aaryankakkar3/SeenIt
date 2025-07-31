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

// Add pre-save logging
gameCacheSchema.pre("save", function (next) {
  console.log(
    `[GameCache] Pre-save hook - attempting to save cache with jikanId:`,
    this.jikanId,
    "title:",
    this.title
  );
  next();
});

// Add post-save logging
gameCacheSchema.post("save", function (doc) {
  console.log(
    `[GameCache] Post-save hook - successfully saved cache:`,
    JSON.stringify(doc, null, 2)
  );
});

// Add save error logging
gameCacheSchema.post("save", function (error, doc, next) {
  if (error) {
    console.error(`[GameCache] Save error for jikanId ${doc?.jikanId}:`, error);
  }
  next();
});

const GameCache = mongoose.model("GameCache", gameCacheSchema);

export default GameCache;
