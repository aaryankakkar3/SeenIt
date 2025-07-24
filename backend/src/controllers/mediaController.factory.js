import mongoose from "mongoose";

// Generic function to create media controllers
export const createMediaController = (
  MediaModel,
  CacheModel,
  getCachedMedia,
  mediaConfig
) => {
  function handleError(res, error, context = "") {
    console.error(
      `[${mediaConfig.name}Controller] ${context}:`,
      error?.message || error
    );
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error?.message || error,
    });
  }

  const getAllEntries = async (req, res) => {
    try {
      // Get all user entries
      const userEntries = await MediaModel.find({ userId: req.user._id });

      // Combine with cached data
      const combinedEntries = await Promise.all(
        userEntries.map(async (entry) => {
          try {
            // Get cached data (will refresh if stale)
            const cachedData = await getCachedMedia(entry.jikanId);

            return {
              _id: entry._id,
              userId: entry.userId,
              jikanId: entry.jikanId,
              yourStatus: entry.yourStatus,
              rating: entry.rating,
              [mediaConfig.watchedField]: entry[mediaConfig.watchedField],
              // Cached data
              title: cachedData.title,
              imageUrl: cachedData.imageUrl,
              year: cachedData.year,
              [mediaConfig.releasedField]:
                cachedData[mediaConfig.releasedField],
              [mediaConfig.statusField]: cachedData[mediaConfig.statusField],
              createdAt: entry.createdAt,
              updatedAt: entry.updatedAt,
            };
          } catch (cacheError) {
            // If cache fails, return entry with basic info
            console.error(
              `Failed to get cached data for ${mediaConfig.name.toLowerCase()} ${
                entry.jikanId
              }:`,
              cacheError
            );
            return {
              _id: entry._id,
              userId: entry.userId,
              jikanId: entry.jikanId,
              yourStatus: entry.yourStatus,
              rating: entry.rating,
              [mediaConfig.watchedField]: entry[mediaConfig.watchedField],
              // Fallback data
              title: "Unknown Title",
              imageUrl: "https://placehold.co/90x129",
              year: 0,
              [mediaConfig.releasedField]: 0,
              [mediaConfig.statusField]: "Unknown",
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

  const createEntry = async (req, res) => {
    try {
      console.log(`[${mediaConfig.name}Controller] Create entry request:`, {
        body: req.body,
        userId: req.user._id,
        userEmail: req.user.email,
      });

      // Remove empty string fields so Mongoose uses defaults
      const mediaData = Object.fromEntries(
        Object.entries(req.body).filter(([_, value]) => value !== "")
      );

      console.log(
        `[${mediaConfig.name}Controller] Processed media data:`,
        mediaData
      );

      // Validate required fields
      if (!mediaData.jikanId) {
        return res.status(400).json({
          success: false,
          message: "jikanId is required",
        });
      }

      // Check if entry already exists for this user
      const existingEntry = await MediaModel.findOne({
        userId: req.user._id,
        jikanId: mediaData.jikanId,
      });

      if (existingEntry) {
        return res.status(400).json({
          success: false,
          message: `${mediaConfig.name} entry already exists`,
        });
      }

      // Set userId from authenticated user
      mediaData.userId = req.user._id;

      // Create new entry
      const newEntry = new MediaModel(mediaData);
      await newEntry.save();

      // Get cached data for response
      let cachedData;
      try {
        cachedData = await getCachedMedia(mediaData.jikanId);
      } catch (cacheError) {
        console.warn(
          `Failed to get cached ${mediaConfig.name.toLowerCase()} data for response:`,
          cacheError
        );
        // Provide fallback data if cache fails
        cachedData = {
          title: "Unknown Title",
          imageUrl: "https://placehold.co/90x129",
          year: 0,
          [mediaConfig.releasedField]: 0,
          [mediaConfig.statusField]: "Unknown",
        };
      }
      const responseData = {
        _id: newEntry._id,
        userId: newEntry.userId,
        jikanId: newEntry.jikanId,
        yourStatus: newEntry.yourStatus,
        rating: newEntry.rating,
        [mediaConfig.watchedField]: newEntry[mediaConfig.watchedField],
        title: cachedData.title,
        imageUrl: cachedData.imageUrl,
        year: cachedData.year,
        [mediaConfig.releasedField]: cachedData[mediaConfig.releasedField],
        [mediaConfig.statusField]: cachedData[mediaConfig.statusField],
        createdAt: newEntry.createdAt,
        updatedAt: newEntry.updatedAt,
      };

      res.status(201).json({ success: true, data: responseData });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          success: false,
          message: "Validation Error",
          errors: Object.values(error.errors).map((err) => err.message),
        });
      }
      handleError(res, error, "Create Entry");
    }
  };

  const updateEntry = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid entry ID",
        });
      }

      // Find and update the entry
      const updatedEntry = await MediaModel.findOneAndUpdate(
        { _id: id, userId: req.user._id },
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedEntry) {
        return res.status(404).json({
          success: false,
          message: `${mediaConfig.name} entry not found`,
        });
      }

      // Get cached data and combine
      const cachedData = await getCachedMedia(updatedEntry.jikanId);
      const responseData = {
        _id: updatedEntry._id,
        userId: updatedEntry.userId,
        jikanId: updatedEntry.jikanId,
        yourStatus: updatedEntry.yourStatus,
        rating: updatedEntry.rating,
        [mediaConfig.watchedField]: updatedEntry[mediaConfig.watchedField],
        title: cachedData.title,
        imageUrl: cachedData.imageUrl,
        year: cachedData.year,
        [mediaConfig.releasedField]: cachedData[mediaConfig.releasedField],
        [mediaConfig.statusField]: cachedData[mediaConfig.statusField],
        createdAt: updatedEntry.createdAt,
        updatedAt: updatedEntry.updatedAt,
      };

      res.status(200).json({ success: true, data: responseData });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          success: false,
          message: "Validation Error",
          errors: Object.values(error.errors).map((err) => err.message),
        });
      }
      handleError(res, error, "Update Entry");
    }
  };

  const deleteEntry = async (req, res) => {
    try {
      const { id } = req.params;

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid entry ID",
        });
      }

      // Find and delete the entry
      const deletedEntry = await MediaModel.findOneAndDelete({
        _id: id,
        userId: req.user._id,
      });

      if (!deletedEntry) {
        return res.status(404).json({
          success: false,
          message: `${mediaConfig.name} entry not found`,
        });
      }

      res.status(200).json({
        success: true,
        message: `${mediaConfig.name} entry deleted successfully`,
      });
    } catch (error) {
      handleError(res, error, "Delete Entry");
    }
  };

  const incrementProgress = async (req, res) => {
    try {
      const { id } = req.params;

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid entry ID",
        });
      }

      // Find the entry
      const entry = await MediaModel.findOne({
        _id: id,
        userId: req.user._id,
      });

      if (!entry) {
        return res.status(404).json({
          success: false,
          message: `${mediaConfig.name} entry not found`,
        });
      }

      // Get cached data to check total
      const cachedData = await getCachedMedia(entry.jikanId);
      const totalCount = cachedData[mediaConfig.releasedField] || 0;
      const currentProgress = entry[mediaConfig.watchedField] || 0;

      // Don't increment if already at max
      if (totalCount > 0 && currentProgress >= totalCount) {
        return res.status(400).json({
          success: false,
          message: `Already at maximum ${mediaConfig.watchedLabel.toLowerCase()}`,
        });
      }

      // Increment progress
      const updateData = {
        [mediaConfig.watchedField]: currentProgress + 1,
      };

      // Auto-complete if reached total
      if (totalCount > 0 && currentProgress + 1 >= totalCount) {
        updateData.yourStatus = "Completed";
      }

      const updatedEntry = await MediaModel.findOneAndUpdate(
        { _id: id, userId: req.user._id },
        updateData,
        { new: true, runValidators: true }
      );

      // Return combined data
      const responseData = {
        _id: updatedEntry._id,
        userId: updatedEntry.userId,
        jikanId: updatedEntry.jikanId,
        yourStatus: updatedEntry.yourStatus,
        rating: updatedEntry.rating,
        [mediaConfig.watchedField]: updatedEntry[mediaConfig.watchedField],
        title: cachedData.title,
        imageUrl: cachedData.imageUrl,
        year: cachedData.year,
        [mediaConfig.releasedField]: cachedData[mediaConfig.releasedField],
        [mediaConfig.statusField]: cachedData[mediaConfig.statusField],
        createdAt: updatedEntry.createdAt,
        updatedAt: updatedEntry.updatedAt,
      };

      res.status(200).json({ success: true, data: responseData });
    } catch (error) {
      handleError(res, error, "Increment Progress");
    }
  };

  const decrementProgress = async (req, res) => {
    try {
      const { id } = req.params;

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid entry ID",
        });
      }

      // Find the entry
      const entry = await MediaModel.findOne({
        _id: id,
        userId: req.user._id,
      });

      if (!entry) {
        return res.status(404).json({
          success: false,
          message: `${mediaConfig.name} entry not found`,
        });
      }

      // Get cached data to check total
      const cachedData = await getCachedMedia(entry.jikanId);
      const totalCount = cachedData[mediaConfig.releasedField] || 0;
      const currentProgress = entry[mediaConfig.watchedField] || 0;

      // Don't decrement if already at 0
      if (currentProgress <= 0) {
        return res.status(400).json({
          success: false,
          message: `${mediaConfig.watchedLabel} cannot be less than 0`,
        });
      }

      // Decrement progress
      const updateData = {
        [mediaConfig.watchedField]: Math.max(0, currentProgress - 1),
      };

      // If decreasing from completed total, change status back to Active
      if (
        entry.yourStatus === "Completed" &&
        totalCount > 0 &&
        currentProgress === totalCount &&
        currentProgress > 1
      ) {
        updateData.yourStatus = "Active";
      }

      const updatedEntry = await MediaModel.findOneAndUpdate(
        { _id: id, userId: req.user._id },
        updateData,
        { new: true, runValidators: true }
      );

      // Get cached data and combine
      const responseCachedData = await getCachedMedia(updatedEntry.jikanId);
      const responseData = {
        _id: updatedEntry._id,
        userId: updatedEntry.userId,
        jikanId: updatedEntry.jikanId,
        yourStatus: updatedEntry.yourStatus,
        rating: updatedEntry.rating,
        [mediaConfig.watchedField]: updatedEntry[mediaConfig.watchedField],
        title: responseCachedData.title,
        imageUrl: responseCachedData.imageUrl,
        year: responseCachedData.year,
        [mediaConfig.releasedField]:
          responseCachedData[mediaConfig.releasedField],
        [mediaConfig.statusField]: responseCachedData[mediaConfig.statusField],
        createdAt: updatedEntry.createdAt,
        updatedAt: updatedEntry.updatedAt,
      };

      res.status(200).json({ success: true, data: responseData });
    } catch (error) {
      handleError(res, error, "Decrement Progress");
    }
  };

  return {
    getAllEntries,
    createEntry,
    updateEntry,
    deleteEntry,
    incrementProgress,
    decrementProgress,
  };
};
