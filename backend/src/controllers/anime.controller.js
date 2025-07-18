import mongoose from "mongoose";
import Anime from "../models/anime.model.js";

function handleError(res, error, context = "") {
  console.error(`[AnimeController] ${context}:`, error?.message || error);
  res.status(500).json({
    success: false,
    message: "Server Error",
    error: error?.message || error,
  });
}

export const getAllEntries = async (req, res) => {
  try {
    // Only get animes for the authenticated user
    const animes = await Anime.find({ userId: req.user._id });
    res.status(200).json({ success: true, data: animes });
  } catch (error) {
    handleError(res, error, "Get All Entries");
  }
};

export const createEntry = async (req, res) => {
  // Remove empty string fields so Mongoose uses defaults
  const anime = Object.fromEntries(
    Object.entries(req.body).filter(([_, v]) => v !== "")
  );

  if (!anime.title || !anime.yourStatus) {
    return res.status(400).json({
      success: false,
      message: "Title and Your Status are compulsary fields",
    });
  }

  if (!anime.jikanId) {
    return res
      .status(400)
      .json({ success: false, message: "Error in fetching ID from database" });
  }

  // Add the authenticated user's ID to the anime entry
  anime.userId = req.user._id;

  const newEntry = new Anime(anime);

  try {
    await newEntry.save();
    res.status(201).json({ success: true, data: newEntry });
  } catch (error) {
    handleError(res, error, "Create Entry");
  }
};

export const updateEntry = async (req, res) => {
  const { id } = req.params;

  // Remove empty string fields so Mongoose uses defaults if not present
  const anime = Object.fromEntries(
    Object.entries(req.body).filter(([_, v]) => v !== "")
  );

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid MongoDB Id" });
  }

  try {
    // Only update if the anime belongs to the authenticated user
    const updatedEntry = await Anime.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      anime,
      { new: true }
    );
    if (!updatedEntry) {
      return res
        .status(404)
        .json({ success: false, message: "Entry not found" });
    }
    res.status(200).json({ success: true, data: updatedEntry });
  } catch (error) {
    handleError(res, error, "Update Entry");
  }
};

export const deleteEntry = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid MongoDB Id" });
  }

  try {
    // Only delete if the anime belongs to the authenticated user
    const deleted = await Anime.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Entry not found" });
    }
    res.status(200).json({ success: true, message: "Entry deleted" });
  } catch (error) {
    handleError(res, error, "Delete Entry");
  }
};

export const incrementWatchedEpisodes = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid MongoDB Id" });
  }

  try {
    // Only find anime that belongs to the authenticated user
    const anime = await Anime.findOne({ _id: id, userId: req.user._id });
    if (!anime) {
      return res
        .status(404)
        .json({ success: false, message: "Entry not found" });
    }

    // Don't increment past total episodes (unless total is 0/unknown)
    if (
      anime.episodesTotal > 0 &&
      anime.episodesWatched >= anime.episodesTotal
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot increment past total episodes",
      });
    }

    const newEpisodesWatched = anime.episodesWatched + 1;

    // Determine new status based on episodes watched
    let newStatus = anime.yourStatus;
    if (anime.episodesTotal > 0 && newEpisodesWatched >= anime.episodesTotal) {
      newStatus = "Completed";
    } else if (anime.yourStatus === "Planned") {
      newStatus = "Active";
    }

    const updatedEntry = await Anime.findByIdAndUpdate(
      id,
      {
        $inc: { episodesWatched: 1 },
        yourStatus: newStatus,
      },
      { new: true }
    );

    res.status(200).json({ success: true, data: updatedEntry });
  } catch (error) {
    handleError(res, error, "Increment Watched Episodes");
  }
};

export const decrementWatchedEpisodes = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid MongoDB Id" });
  }

  try {
    // Only find anime that belongs to the authenticated user
    const anime = await Anime.findOne({ _id: id, userId: req.user._id });
    if (!anime) {
      return res
        .status(404)
        .json({ success: false, message: "Entry not found" });
    }

    // Don't decrement below 0
    if (anime.episodesWatched <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot decrement below 0 episodes" });
    }

    const newEpisodesWatched = anime.episodesWatched - 1;

    // Determine new status based on episodes watched
    let newStatus = anime.yourStatus;
    if (
      anime.yourStatus === "Completed" &&
      anime.episodesTotal > 0 &&
      newEpisodesWatched < anime.episodesTotal
    ) {
      newStatus = "Active";
    }

    const updatedEntry = await Anime.findByIdAndUpdate(
      id,
      {
        $inc: { episodesWatched: -1 },
        yourStatus: newStatus,
      },
      { new: true }
    );

    res.status(200).json({ success: true, data: updatedEntry });
  } catch (error) {
    handleError(res, error, "Decrement Watched Episodes");
  }
};
