import mongoose from "mongoose";

const animeEntrySchema = new mongoose.Schema(
  {
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
      default: "0000",
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
    jikanId: {
      type: Number,
      required: true,
    },
    episodesWatched: {
      type: Number,
      default: 0,
      min: [0, "Episodes watched cannot be negative"],
      validate: {
        validator: function (value) {
          // Allow any value if episodesTotal is 0 (unknown)
          return this.episodesTotal === 0 || value <= this.episodesTotal;
        },
        message: "Episodes watched cannot exceed total episodes",
      },
    },
    episodesTotal: {
      type: Number,
      default: 0,
    },
    animeStatus: {
      type: String,
      default: "Unknown",
    },
  },
  {
    timestamps: true,
  }
);

const AnimeEntry = mongoose.model("Anime", animeEntrySchema);
export default AnimeEntry;
