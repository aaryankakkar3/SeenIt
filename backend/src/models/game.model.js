import mongoose from "mongoose";

const gameEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jikanId: {
      type: Number, // RAWG uses numeric IDs
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
    progress: {
      type: Number,
      default: 0,
      min: [0, "Progress percentage cannot be negative"],
      max: [100, "Progress percentage cannot exceed 100"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries by userId and jikanId
gameEntrySchema.index({ userId: 1, jikanId: 1 });

const GameEntry = mongoose.model("Game", gameEntrySchema);
export default GameEntry;
