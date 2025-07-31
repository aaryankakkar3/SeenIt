import mongoose from "mongoose";

const movieEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jikanId: {
      type: String, // OMDB uses string IDs (IMDB IDs)
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
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries by userId and jikanId
movieEntrySchema.index({ userId: 1, jikanId: 1 });

const MovieEntry = mongoose.model("Movie", movieEntrySchema);
export default MovieEntry;
