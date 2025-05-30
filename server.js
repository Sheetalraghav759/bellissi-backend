import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDb } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import projectRoutes from "./routes/projectRoutesss.js";
import serviceRoutes from "./routes/serviceRoutes.js"
import popUpRoutes from "./routes/popUpRoutes.js"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
connectDb();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/gallery", galleryRoutes)
app.use("/api/v1/review", reviewRoutes);
app.use("/api/v1/project", projectRoutes);
app.use("/api/v1/service", serviceRoutes);
app.use("/api/v1/popup", popUpRoutes);

app.use(express.static(path.join(__dirname, "./sdcrane/build")));
    
app.listen(process.env.PORT, () => {
  console.log(
    `Server Running on port ${process.env.PORT} in ${process.env.MODE}`
  );
});
