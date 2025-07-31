import mongoose from "mongoose";

const bookCacheSchema = new mongoose.Schema(
  {
    jikanId: {
      type: String, // Google Books uses string IDs
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
      type: Number, // Total pages for books
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
bookCacheSchema.index({ jikanId: 1, lastUpdated: 1 });

const BookCache = mongoose.model("BookCache", bookCacheSchema);

export default BookCache;
