import User from "../models/user.model.js";

export const addSection = async (req, res) => {
  const { section } = req.params;
  const userId = req.user._id;

  try {
    // Validate that section is provided
    if (!section) {
      return res.status(400).json({ error: "Section is required" });
    }

    // Find the user and check if section already exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if section already exists in user's sections
    if (user.sections.includes(section)) {
      return res.status(400).json({ error: "Section already exists" });
    }

    // Add the section to user's sections array
    user.sections.push(section);
    await user.save();

    res.status(200).json({
      message: "Section added successfully",
      sections: user.sections,
    });
  } catch (error) {
    console.error("Error adding section:", error.message);

    // Handle validation errors specifically
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteSection = async (req, res) => {
  const { section } = req.params;
  const userId = req.user._id;

  try {
    // Validate that section is provided
    if (!section) {
      return res.status(400).json({ error: "Section is required" });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if section exists in user's sections
    if (!user.sections.includes(section)) {
      return res
        .status(400)
        .json({ error: "Section not found in user's sections" });
    }

    // Remove the section from user's sections array
    user.sections = user.sections.filter((s) => s !== section);
    await user.save();

    res.status(200).json({
      message: "Section deleted successfully",
      sections: user.sections,
    });
  } catch (error) {
    console.error("Error deleting section:", error.message);

    // Handle validation errors specifically
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllSections = async (req, res) => {
  const userId = req.user._id;

  try {
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "Sections retrieved successfully",
      sections: user.sections,
    });
  } catch (error) {
    console.error("Error getting sections:", error.message);

    res.status(500).json({ error: "Internal server error" });
  }
};
