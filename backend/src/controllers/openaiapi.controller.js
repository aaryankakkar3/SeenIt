import OpenAI from "openai";

export const getAISuggestions = async (req, res) => {
  const { context, mediaTypes, genresWanted, genresUnwanted, loggedData } =
    req.body;

  try {
    // Initialize OpenAI client when the function is called
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is not loaded from environment variables");
      return res.status(500).json({
        success: false,
        message: "OpenAI API key is not configured",
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    let userHistory = "";

    // Handle logged data - can be false or an object containing cached data
    if (loggedData && typeof loggedData === "object") {
      // loggedData is an object containing pre-fetched user data
      console.log("Using pre-fetched logged data");

      // Format the cached logged data for the AI
      const formatMediaList = (
        mediaArray,
        progressField = null,
        totalField = null
      ) => {
        if (!mediaArray || mediaArray.length === 0) return "None";
        return mediaArray
          .map((item) => {
            let entry = `${item.title} (Status: ${item.status}`;
            if (
              progressField &&
              totalField &&
              item[progressField] !== undefined &&
              item[totalField] !== undefined
            ) {
              entry += `, Progress: ${item[progressField]}/${item[totalField]}`;
            }
            if (item.genres && item.genres.length > 0) {
              entry += `, Genres: ${item.genres.join(", ")}`;
            }
            if (item.year) {
              entry += `, Year: ${item.year}`;
            }
            entry += ")";
            return entry;
          })
          .join(", ");
      };

      userHistory = `
User's tracked media:
Anime: ${formatMediaList(loggedData.animes, "progress", "total")}
Manga: ${formatMediaList(loggedData.manga, "progress", "total")}
Shows: ${formatMediaList(loggedData.shows, "progress", "total")}
Comics: ${formatMediaList(loggedData.comics, "progress", "total")}
Movies: ${formatMediaList(loggedData.movies)}
Books: ${formatMediaList(loggedData.books, "progress", "total")}
Games: ${formatMediaList(loggedData.games)}
      `.trim();
    } else {
      userHistory =
        "No user history provided - suggest based on filters and context only.";
    }

    // Format the user request
    const userRequest = `
Media Types Wanted: ${mediaTypes.length > 0 ? mediaTypes.join(", ") : "Any"}
Genres Wanted: ${genresWanted.length > 0 ? genresWanted.join(", ") : "No specific preferences"}
Genres to Avoid: ${genresUnwanted.length > 0 ? genresUnwanted.join(", ") : "None"}
Additional Context: ${context || "None provided"}
    `.trim();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a media recommendation AI. You MUST respond with ONLY a valid JSON array containing exactly 10 media suggestions.

Response format (respond with ONLY this, no other text):
[{"title":"string","type":"string","reason":"string"}]

Rules:
- Be strict about sticking to the filters in the request
- Avoid suggesting media that the user has already seen (if history provided)
- Use the user's tracked history to prioritize suggestions similar to what they liked
- The "type" field MUST be one of: anime, manga, shows, comics, movies, books, games
- The "reason" should explain why this matches their preferences (about 150 characters)
- Return EXACTLY 10 suggestions
- NO markdown formatting, NO backticks, NO explanatory text
- ONLY return the JSON array`,
        },
        {
          role: "user",
          content: `User's tracked history:\n${userHistory}\n\nUser request:\n${userRequest}`,
        },
      ],
      temperature: 0.7,
    });

    const suggestionsText = response.choices[0].message.content.trim();
    console.log("Raw AI response:", suggestionsText);
    console.log("AI response length:", suggestionsText.length);

    try {
      // Clean the response (remove potential markdown formatting)
      let cleanedResponse = suggestionsText;

      // Remove code block markers if present
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse
          .replace(/^```json\s*/, "")
          .replace(/\s*```$/, "");
      } else if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse
          .replace(/^```\s*/, "")
          .replace(/\s*```$/, "");
      }

      console.log("Cleaned response:", cleanedResponse);

      // Parse the JSON response
      const suggestions = JSON.parse(cleanedResponse);

      // Validate that it's an array with the expected structure
      if (!Array.isArray(suggestions)) {
        throw new Error("Response is not an array");
      }

      if (suggestions.length === 0) {
        throw new Error("No suggestions returned");
      }

      // Validate structure of first item
      const firstItem = suggestions[0];
      if (!firstItem.title || !firstItem.type || !firstItem.reason) {
        throw new Error("Invalid suggestion structure");
      }

      console.log(
        "Successfully parsed suggestions:",
        suggestions.length,
        "items"
      );
      res.json({ suggestions });
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:");
      console.error("Parse error:", parseError.message);
      console.error("Raw response:", suggestionsText);
      console.error("Response type:", typeof suggestionsText);

      res.status(500).json({
        success: false,
        message: "AI returned invalid format. Please try again.",
        debug: {
          rawResponse: suggestionsText.substring(0, 500), // First 500 chars for debugging
          error: parseError.message,
        },
      });
    }
  } catch (error) {
    console.error("AI Suggestions Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate AI suggestions. Please try again.",
    });
  }
};
