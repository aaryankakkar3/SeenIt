import mongoose from "mongoose";

// Generic function to create media controllers
export const createMediaController = (
  MediaModel,
  CacheModel,
  getCachedMedia,
  cacheMediaFromSearch,
  mediaConfig
) => {
  // Check if this is a static media type that doesn't need cache updates
  const isStaticMediaType = ["Movies", "Games", "Books"].includes(
    mediaConfig.name
  );

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

      // Combine with cached data for all media types
      const combinedEntries = await Promise.all(
        userEntries.map(async (entry) => {
          try {
            // Get cached data - for static media types, this will be a one-time cache
            const cachedData = await getCachedMedia(entry.jikanId);

            // Build response data with correct field mapping
            const responseData = {
              _id: entry._id,
              userId: entry.userId,
              jikanId: entry.jikanId,
              yourStatus: entry.yourStatus,
              rating: entry.rating,
              // Cached data
              title: cachedData.title,
              imageUrl: cachedData.imageUrl,
              year: cachedData.year,
              released: cachedData.released,
              status: cachedData.status,
              createdAt: entry.createdAt,
              updatedAt: entry.updatedAt,
            };

            // Add progress field based on media type
            if (mediaConfig.watchedField === "consumed") {
              responseData.consumed = entry.consumed;
            } else if (mediaConfig.watchedField === "progress") {
              responseData.progress = entry.progress;
            }

            return responseData;
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
              consumed: entry.consumed,
              // Fallback data
              title: "Unknown Title",
              imageUrl: "https://placehold.co/90x129",
              year: 0,
              released: 0,
              status: "Unknown",
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
      console.log("Req body", req.body);
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

      // Get cached data for response (all media types use cache)
      let cachedData;
      if (mediaData.title && mediaData.imageUrl) {
        // Form data contains complete information, create cache entry
        console.log(
          `[${mediaConfig.name}Controller] Attempting to cache media from search with data:`,
          {
            jikanId: mediaData.jikanId,
            title: mediaData.title,
            year: mediaData.year || 0,
            imageUrl: mediaData.imageUrl,
            released: mediaData.released || 0,
            status: mediaData.status || "Unknown",
          }
        );

        try {
          cachedData = await cacheMediaFromSearch({
            jikanId: mediaData.jikanId,
            title: mediaData.title,
            year: mediaData.year || 0,
            imageUrl: mediaData.imageUrl,
            released: mediaData.released || 0,
            status: mediaData.status || "Unknown",
          });
          console.log(
            `[${mediaConfig.name}Controller] Cache operation successful, cached data:`,
            JSON.stringify(cachedData, null, 2)
          );
        } catch (cacheError) {
          console.error(
            `[${
              mediaConfig.name
            }Controller] ERROR: Failed to cache ${mediaConfig.name.toLowerCase()} data:`,
            cacheError
          );
          console.error(
            `[${mediaConfig.name}Controller] ERROR: Cache error details:`,
            cacheError.stack
          );
          cachedData = {
            title: mediaData.title,
            imageUrl: mediaData.imageUrl,
            year: mediaData.year || 0,
            released: mediaData.released || 0,
            status: mediaData.status || "Unknown",
          };
          console.log(
            `[${mediaConfig.name}Controller] Using fallback cached data:`,
            JSON.stringify(cachedData, null, 2)
          );
        }
      } else {
        // Fallback to getting existing cache or API data
        console.log(
          `[${mediaConfig.name}Controller] Media data incomplete, attempting to get cached data for jikanId:`,
          mediaData.jikanId
        );
        try {
          cachedData = await getCachedMedia(mediaData.jikanId);
          console.log(
            `[${mediaConfig.name}Controller] Successfully retrieved cached data:`,
            JSON.stringify(cachedData, null, 2)
          );
        } catch (cacheError) {
          console.error(
            `[${
              mediaConfig.name
            }Controller] ERROR: Failed to get cached ${mediaConfig.name.toLowerCase()} data for response:`,
            cacheError
          );
          console.error(
            `[${mediaConfig.name}Controller] ERROR: Cache retrieval error details:`,
            cacheError.stack
          );
          cachedData = {
            title: "Unknown Title",
            imageUrl: "https://placehold.co/90x129",
            year: 0,
            released: 0,
            status: "Unknown",
          };
          console.log(
            `[${mediaConfig.name}Controller] Using fallback data due to cache error:`,
            JSON.stringify(cachedData, null, 2)
          );
        }
      }

      // Build response data with correct field mapping (from cache for all media types)
      const responseData = {
        _id: newEntry._id,
        userId: newEntry.userId,
        jikanId: newEntry.jikanId,
        yourStatus: newEntry.yourStatus,
        rating: newEntry.rating,
        title: cachedData.title,
        imageUrl: cachedData.imageUrl,
        year: cachedData.year,
        released: cachedData.released,
        status: cachedData.status,
        createdAt: newEntry.createdAt,
        updatedAt: newEntry.updatedAt,
      };

      // Add progress field based on media type
      if (mediaConfig.watchedField === "consumed") {
        responseData.consumed = newEntry.consumed;
      } else if (mediaConfig.watchedField === "progress") {
        responseData.progress = newEntry.progress;
      }

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

      console.log(`[${mediaConfig.name}Controller] Update entry request:`, {
        id,
        updateData,
        userId: req.user._id,
      });

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid entry ID",
        });
      }

      // Filter out cached fields that shouldn't be stored in the database
      // Only keep fields that actually exist in the database model
      const dbFields = ["yourStatus", "rating", "consumed", "progress"];

      const filteredUpdateData = Object.keys(updateData)
        .filter((key) => dbFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = updateData[key];
          return obj;
        }, {});

      console.log(
        `[${mediaConfig.name}Controller] Filtered update data:`,
        filteredUpdateData
      );

      // Find and update the entry
      const updatedEntry = await MediaModel.findOneAndUpdate(
        { _id: id, userId: req.user._id },
        filteredUpdateData,
        { new: true, runValidators: true }
      );

      if (!updatedEntry) {
        return res.status(404).json({
          success: false,
          message: `${mediaConfig.name} entry not found`,
        });
      }

      // Get cached data and combine with proper field mapping (all media types use cache)
      let cachedData;
      console.log(
        `[${mediaConfig.name}Controller] Attempting to get cached data for updated entry, jikanId:`,
        updatedEntry.jikanId
      );
      try {
        cachedData = await getCachedMedia(updatedEntry.jikanId);
        console.log(
          `[${mediaConfig.name}Controller] Successfully retrieved cached data for update:`,
          JSON.stringify(cachedData, null, 2)
        );
      } catch (cacheError) {
        console.error(
          `[${
            mediaConfig.name
          }Controller] ERROR: Failed to get cached ${mediaConfig.name.toLowerCase()} data for update:`,
          cacheError
        );
        console.error(
          `[${mediaConfig.name}Controller] ERROR: Update cache error details:`,
          cacheError.stack
        );
        // If cache fails, try to recreate it from the original update data if available
        if (updateData.title && updateData.imageUrl) {
          console.log(
            `[${mediaConfig.name}Controller] Attempting to recreate cache from update data`
          );
          try {
            cachedData = await cacheMediaFromSearch({
              jikanId: updatedEntry.jikanId,
              title: updateData.title,
              year: updateData.year || 0,
              imageUrl: updateData.imageUrl,
              released: updateData.released || 0,
              status: updateData.status || "Unknown",
            });
            console.log(
              `[${mediaConfig.name}Controller] Successfully recreated cache:`,
              JSON.stringify(cachedData, null, 2)
            );
          } catch (recreateCacheError) {
            console.error(
              `[${
                mediaConfig.name
              }Controller] ERROR: Failed to recreate cache for ${mediaConfig.name.toLowerCase()}:`,
              recreateCacheError
            );
            console.error(
              `[${mediaConfig.name}Controller] ERROR: Recreate cache error details:`,
              recreateCacheError.stack
            );
            // Final fallback
            cachedData = {
              title: updateData.title || "Unknown Title",
              imageUrl: updateData.imageUrl || "https://placehold.co/90x129",
              year: updateData.year || 0,
              released: updateData.released || 0,
              status: updateData.status || "Unknown",
            };
            console.log(
              `[${mediaConfig.name}Controller] Using fallback cache data from update data:`,
              JSON.stringify(cachedData, null, 2)
            );
          }
        } else {
          console.log(
            `[${mediaConfig.name}Controller] No update data available, using default fallback`
          );
          // Provide fallback data if no original data available
          cachedData = {
            title: "Unknown Title",
            imageUrl: "https://placehold.co/90x129",
            year: 0,
            released: 0,
            status: "Unknown",
          };
          console.log(
            `[${mediaConfig.name}Controller] Using default fallback cache data:`,
            JSON.stringify(cachedData, null, 2)
          );
        }
      }

      console.log(
        `[${mediaConfig.name}Controller] Building response data with cached data:`,
        JSON.stringify(cachedData, null, 2)
      );

      const responseData = {
        _id: updatedEntry._id,
        userId: updatedEntry.userId,
        jikanId: updatedEntry.jikanId,
        yourStatus: updatedEntry.yourStatus,
        rating: updatedEntry.rating,
        title: cachedData.title,
        imageUrl: cachedData.imageUrl,
        year: cachedData.year,
        released: cachedData.released,
        status: cachedData.status,
        createdAt: updatedEntry.createdAt,
        updatedAt: updatedEntry.updatedAt,
      };

      // Add progress field based on media type
      if (mediaConfig.watchedField === "consumed") {
        responseData.consumed = updatedEntry.consumed;
      } else if (mediaConfig.watchedField === "progress") {
        responseData.progress = updatedEntry.progress;
      }

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
      const totalCount = cachedData.released || 0;

      // Get current progress based on media type
      let currentProgress = 0;
      if (mediaConfig.watchedField === "consumed") {
        currentProgress = entry.consumed || 0;
      } else if (mediaConfig.watchedField === "progress") {
        currentProgress = entry.progress || 0;
      }

      // Don't increment if already at max
      if (totalCount > 0 && currentProgress >= totalCount) {
        return res.status(400).json({
          success: false,
          message: `Already at maximum ${mediaConfig.watchedLabel.toLowerCase()}`,
        });
      }

      // Increment progress based on media type
      const updateData = {};
      if (mediaConfig.watchedField === "consumed") {
        updateData.consumed = currentProgress + 1;
      } else if (mediaConfig.watchedField === "progress") {
        updateData.progress = Math.min(currentProgress + 1, 100); // Cap at 100% for progress
      }

      // Auto-complete if reached total
      if (totalCount > 0 && currentProgress + 1 >= totalCount) {
        updateData.yourStatus = "Completed";
      }

      const updatedEntry = await MediaModel.findOneAndUpdate(
        { _id: id, userId: req.user._id },
        updateData,
        { new: true, runValidators: true }
      );

      // Return combined data with proper field mapping
      const responseData = {
        _id: updatedEntry._id,
        userId: updatedEntry.userId,
        jikanId: updatedEntry.jikanId,
        yourStatus: updatedEntry.yourStatus,
        rating: updatedEntry.rating,
        title: cachedData.title,
        imageUrl: cachedData.imageUrl,
        year: cachedData.year,
        released: cachedData.released,
        status: cachedData.status,
        createdAt: updatedEntry.createdAt,
        updatedAt: updatedEntry.updatedAt,
      };

      // Add progress field based on media type
      if (mediaConfig.watchedField === "consumed") {
        responseData.consumed = updatedEntry.consumed;
      } else if (mediaConfig.watchedField === "progress") {
        responseData.progress = updatedEntry.progress;
      }

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
      const totalCount = cachedData.released || 0;

      // Get current progress based on media type
      let currentProgress = 0;
      if (mediaConfig.watchedField === "consumed") {
        currentProgress = entry.consumed || 0;
      } else if (mediaConfig.watchedField === "progress") {
        currentProgress = entry.progress || 0;
      }

      // Don't decrement if already at 0
      if (currentProgress <= 0) {
        return res.status(400).json({
          success: false,
          message: `${mediaConfig.watchedLabel} cannot be less than 0`,
        });
      }

      // Decrement progress based on media type
      const updateData = {};
      if (mediaConfig.watchedField === "consumed") {
        updateData.consumed = Math.max(0, currentProgress - 1);
      } else if (mediaConfig.watchedField === "progress") {
        updateData.progress = Math.max(0, currentProgress - 1);
      }

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

      // Get cached data and combine with proper field mapping
      const responseCachedData = await getCachedMedia(updatedEntry.jikanId);
      const responseData = {
        _id: updatedEntry._id,
        userId: updatedEntry.userId,
        jikanId: updatedEntry.jikanId,
        yourStatus: updatedEntry.yourStatus,
        rating: updatedEntry.rating,
        title: responseCachedData.title,
        imageUrl: responseCachedData.imageUrl,
        year: responseCachedData.year,
        released: responseCachedData.released,
        status: responseCachedData.status,
        createdAt: updatedEntry.createdAt,
        updatedAt: updatedEntry.updatedAt,
      };

      // Add progress field based on media type
      if (mediaConfig.watchedField === "consumed") {
        responseData.consumed = updatedEntry.consumed;
      } else if (mediaConfig.watchedField === "progress") {
        responseData.progress = updatedEntry.progress;
      }

      res.status(200).json({ success: true, data: responseData });
    } catch (error) {
      handleError(res, error, "Decrement Progress");
    }
  };

  const preFetchCache = async (req, res) => {
    try {
      const { id } = req.params;

      console.log(
        `[${mediaConfig.name}Controller] Pre-fetching cache for ID:`,
        id
      );

      // Get cached data (this will fetch from API if not cached)
      const cachedData = await getCachedMedia(id);

      res.status(200).json({
        success: true,
        data: {
          jikanId: cachedData.jikanId,
          title: cachedData.title,
          imageUrl: cachedData.imageUrl,
          year: cachedData.year,
          released: cachedData.released,
          status: cachedData.status,
        },
      });
    } catch (error) {
      console.warn(
        `[${mediaConfig.name}Controller] Failed to pre-fetch cache:`,
        error
      );
      // Return a fallback response instead of error
      res.status(200).json({
        success: false,
        message: "Failed to fetch detailed data",
        data: null,
      });
    }
  };

  return {
    getAllEntries,
    createEntry,
    updateEntry,
    deleteEntry,
    incrementProgress,
    decrementProgress,
    preFetchCache,
  };
};
