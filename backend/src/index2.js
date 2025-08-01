import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import animeRoutes from "./routes/anime.route.js";
import mangaRoutes from "./routes/manga.route.js";
import showRoutes from "./routes/show.route.js";
import comicRoutes from "./routes/comic.route.js";
import bookRoutes from "./routes/book.route.js";
import gameRoutes from "./routes/game.route.js";
import movieRoutes from "./routes/movie.route.js";
import authRoutes from "./routes/auth.route.js";
import sectionsRoutes from "./routes/sections.route.js";
import externalQueryRoutes from "./routes/externalQuery.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cookieParser());
app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/anime", animeRoutes);
app.use("/api/manga", mangaRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/comics", comicRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/sections", sectionsRoutes);
app.use("/api/external", externalQueryRoutes);

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
  connectDB();
});
