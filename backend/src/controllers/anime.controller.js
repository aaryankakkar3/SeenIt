import mongoose from "mongoose";
import Anime from "../models/anime.model.js";
import AnimeCache from "../models/animeCache.model.js";
import {
  getCachedAnime,
  cacheAnimeFromSearch,
} from "../services/animeCacheService.js";

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
    // Get all user anime entries
    const userEntries = await Anime.find({ userId: req.user._id });

    // Combine with cached anime data
    const combinedEntries = await Promise.all(
      userEntries.map(async (entry) => {
        try {
          // Get cached anime data (will refresh if stale)
          const cachedAnime = await getCachedAnime(entry.jikanId);

          return {
            _id: entry._id,
            userId: entry.userId,
            jikanId: entry.jikanId,
            yourStatus: entry.yourStatus,
            rating: entry.rating,
            episodesWatched: entry.episodesWatched,
            // Cached anime data
            title: cachedAnime.title,
            imageUrl: cachedAnime.imageUrl,
            year: cachedAnime.year,
            episodesTotal: cachedAnime.episodesTotal,
            animeStatus: cachedAnime.animeStatus,
            createdAt: entry.createdAt,
            updatedAt: entry.updatedAt,
          };
        } catch (cacheError) {
          // If cache fails, return entry with basic info
          console.error(
            `Failed to get cached data for anime ${entry.jikanId}:`,
            cacheError
          );
          return {
            _id: entry._id,
            userId: entry.userId,
            jikanId: entry.jikanId,
            yourStatus: entry.yourStatus,
            rating: entry.rating,
            episodesWatched: entry.episodesWatched,
            // Fallback data
            title: "Unknown Title",
            imageUrl: "https://placehold.co/90x129",
            year: 0,
            episodesTotal: 0,
            animeStatus: "Unknown",
            createdAt: entry.createdAt,
            updatedAt: entry.updatedAt,
          };
        }
      })
    );

    res.status(200).json({ success: true, data: combinedEntries });
  } catch (error) {
    handleError(res, error, "Get All Entries");
  }
};

export const createEntry = async (req, res) => {
  // Remove empty string fields so Mongoose uses defaults
  const animeData = Object.fromEntries(
    Object.entries(req.body).filter(([_, v]) => v !== "")
  );

  if (!animeData.yourStatus) {
    return res.status(400).json({
      success: false,
      message: "Your Status is a compulsary field",
    });
  }

  if (!animeData.jikanId) {
    return res
      .status(400)
      .json({ success: false, message: "Error in fetching ID from database" });
  }

  try {
    // First, cache the anime data from search results
    await cacheAnimeFromSearch(animeData);

    // Create user-specific anime entry with only relevant fields
    const userEntry = {
      userId: req.user._id,
      jikanId: animeData.jikanId,
      yourStatus: animeData.yourStatus,
      rating: animeData.rating,
      episodesWatched: animeData.episodesWatched || 0,
    };

    const newEntry = new Anime(userEntry);
    await newEntry.save();

    // Get the cached anime data to return complete entry
    const cachedAnime = await getCachedAnime(animeData.jikanId);

    // Return combined data
    const completeEntry = {
      _id: newEntry._id,
      userId: newEntry.userId,
      jikanId: newEntry.jikanId,
      yourStatus: newEntry.yourStatus,
      rating: newEntry.rating,
      episodesWatched: newEntry.episodesWatched,
      // Cached anime data
      title: cachedAnime.title,
      imageUrl: cachedAnime.imageUrl,
      year: cachedAnime.year,
      episodesTotal: cachedAnime.episodesTotal,
      animeStatus: cachedAnime.animeStatus,
      createdAt: newEntry.createdAt,
      updatedAt: newEntry.updatedAt,
    };

    res.status(201).json({ success: true, data: completeEntry });
  } catch (error) {
    handleError(res, error, "Create Entry");
  }
};

export const updateEntry = async (req, res) => {
  const { id } = req.params;

  // Remove empty string fields so Mongoose uses defaults if not present
  const updateData = Object.fromEntries(
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
      updateData,
      { new: true }
    );

    if (!updatedEntry) {
      return res
        .status(404)
        .json({ success: false, message: "Entry not found" });
    }

    // Get cached anime data to return complete entry
    const cachedAnime = await getCachedAnime(updatedEntry.jikanId);

    // Return combined data
    const completeEntry = {
      _id: updatedEntry._id,
      userId: updatedEntry.userId,
      jikanId: updatedEntry.jikanId,
      yourStatus: updatedEntry.yourStatus,
      rating: updatedEntry.rating,
      episodesWatched: updatedEntry.episodesWatched,
      // Cached anime data
      title: cachedAnime.title,
      imageUrl: cachedAnime.imageUrl,
      year: cachedAnime.year,
      episodesTotal: cachedAnime.episodesTotal,
      animeStatus: cachedAnime.animeStatus,
      createdAt: updatedEntry.createdAt,
      updatedAt: updatedEntry.updatedAt,
    };

    res.status(200).json({ success: true, data: completeEntry });
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

    // Get cached anime data to check episodesTotal
    const cachedAnime = await getCachedAnime(anime.jikanId);

    // Don't increment past total episodes (unless total is 0/unknown)
    if (
      cachedAnime.episodesTotal > 0 &&
      anime.episodesWatched >= cachedAnime.episodesTotal
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot increment past total episodes",
      });
    }

    const newEpisodesWatched = anime.episodesWatched + 1;

    // Determine new status based on episodes watched
    let newStatus = anime.yourStatus;
    if (
      cachedAnime.episodesTotal > 0 &&
      newEpisodesWatched >= cachedAnime.episodesTotal
    ) {
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

    // Return combined data
    const completeEntry = {
      _id: updatedEntry._id,
      userId: updatedEntry.userId,
      jikanId: updatedEntry.jikanId,
      yourStatus: updatedEntry.yourStatus,
      rating: updatedEntry.rating,
      episodesWatched: updatedEntry.episodesWatched,
      // Cached anime data
      title: cachedAnime.title,
      imageUrl: cachedAnime.imageUrl,
      year: cachedAnime.year,
      episodesTotal: cachedAnime.episodesTotal,
      animeStatus: cachedAnime.animeStatus,
      createdAt: updatedEntry.createdAt,
      updatedAt: updatedEntry.updatedAt,
    };

    res.status(200).json({ success: true, data: completeEntry });
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

    // Get cached anime data to check episodesTotal
    const cachedAnime = await getCachedAnime(anime.jikanId);

    // Determine new status based on episodes watched
    let newStatus = anime.yourStatus;
    if (
      anime.yourStatus === "Completed" &&
      cachedAnime.episodesTotal > 0 &&
      newEpisodesWatched < cachedAnime.episodesTotal
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

    // Return combined data
    const completeEntry = {
      _id: updatedEntry._id,
      userId: updatedEntry.userId,
      jikanId: updatedEntry.jikanId,
      yourStatus: updatedEntry.yourStatus,
      rating: updatedEntry.rating,
      episodesWatched: updatedEntry.episodesWatched,
      // Cached anime data
      title: cachedAnime.title,
      imageUrl: cachedAnime.imageUrl,
      year: cachedAnime.year,
      episodesTotal: cachedAnime.episodesTotal,
      animeStatus: cachedAnime.animeStatus,
      createdAt: updatedEntry.createdAt,
      updatedAt: updatedEntry.updatedAt,
    };

    res.status(200).json({ success: true, data: completeEntry });
  } catch (error) {
    handleError(res, error, "Decrement Watched Episodes");
  }
};
