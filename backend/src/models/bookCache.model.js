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

// Add pre-save logging
bookCacheSchema.pre("save", function (next) {
  console.log(
    `[BookCache] Pre-save hook - attempting to save cache with jikanId:`,
    this.jikanId,
    "title:",
    this.title
  );
  next();
});

// Add post-save logging
bookCacheSchema.post("save", function (doc) {
  console.log(
    `[BookCache] Post-save hook - successfully saved cache:`,
    JSON.stringify(doc, null, 2)
  );
});

// Add save error logging
bookCacheSchema.post("save", function (error, doc, next) {
  if (error) {
    console.error(`[BookCache] Save error for jikanId ${doc?.jikanId}:`, error);
  }
  next();
});

const BookCache = mongoose.model("BookCache", bookCacheSchema);

export default BookCache;
