import mongoose from "mongoose";

const animeEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jikanId: {
      type: Number,
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
      min: [0, "Episodes watched cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries by userId and jikanId
animeEntrySchema.index({ userId: 1, jikanId: 1 });

const AnimeEntry = mongoose.model("Anime", animeEntrySchema);
export default AnimeEntry;
