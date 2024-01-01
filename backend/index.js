import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import cors from "cors";

import corsOptions from "./config/corsOptions.js";
import connectDB from "./config/dbConn.js";

import { init } from './controllers/initController.js';
import { mark_article_read, fetch_new_articles, mark_all_read } from './controllers/articleController.js';
import { export_feeds, import_opml_file } from './controllers/importController.js';

import multer from "multer";
import { create_category } from "./controllers/categoryController.js";
import { create_feed } from "./controllers/feedController.js";
const upload = multer({ dest: "uploads/" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 35000;

// Connect to MongoDB
connectDB();

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());


app.get("/all", init);

app.get("/mark_article_read/:article_id", mark_article_read);
app.get("/mark_all_read", mark_all_read);
app.get("/export", export_feeds);

app.post("/import_opml_file", upload.single('file'), import_opml_file);

app.post("/create_category", create_category);
app.post("/create_feed", create_feed);

app.get("/fetch_new_articles", fetch_new_articles);


mongoose.connection.once("open", () => {
	console.log("Connected to MongoDB");
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
