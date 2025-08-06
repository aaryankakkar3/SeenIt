import dotenv from "dotenv";

// Load environment variables
dotenv.config();

console.log("=== ENVIRONMENT TEST ===");
console.log("Current working directory:", process.cwd());
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT:", process.env.PORT);
console.log("OPENAI_API_KEY exists:", !!process.env.OPENAI_API_KEY);
console.log("OPENAI_API_KEY length:", process.env.OPENAI_API_KEY?.length || 0);
console.log(
  "OPENAI_API_KEY first 20 chars:",
  process.env.OPENAI_API_KEY?.substring(0, 20) || "NOT FOUND"
);
console.log(
  "All env keys containing 'OPENAI':",
  Object.keys(process.env).filter((key) => key.includes("OPENAI"))
);
console.log("========================");
