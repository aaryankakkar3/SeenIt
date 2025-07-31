import mongoose from "mongoose";

const bookEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jikanId: {
      type: String, // Google Books uses string IDs
      required: true,
    },
    yourStatus: {
      type: String,
      enum: ["Completed", "Planned", "Active", "Dropped"],
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      validate: {
        validator: function (v) {
          return v === undefined || (v >= 0 && v <= 5);
        },
        message: "Rating must be between 0 and 5.",
      },
    },
    consumed: {
      type: Number,
      default: 0,
      min: [0, "Pages read cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries by userId and jikanId
bookEntrySchema.index({ userId: 1, jikanId: 1 });

const BookEntry = mongoose.model("Book", bookEntrySchema);
export default BookEntry;
