import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Please enter a valid email address",
      },
    },
    fullName: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          const words = v.trim().split(/\s+/);
          return words.length === 2;
        },
        message:
          "Full name must contain exactly two words (first and last name)",
      },
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Password must be at least 8 characters long"],
    },
    profilePic: {
      type: String,
      default: "",
    },
    sections: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          const allowedSections = [
            "animes",
            "mangas",
            "shows",
            "comics",
            "movies",
            "books",
            "games",
          ];
          return v.every((section) => allowedSections.includes(section));
        },
        message:
          "Sections can only contain: animes, manga, shows, comics, movies, books, games",
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
