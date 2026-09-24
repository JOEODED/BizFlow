import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testConnection } from "./config/db";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import saleRoutes from "./routes/sales";
import dashboardRoutes from "./routes/dashboard";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;

testConnection().then(() => {
  app.listen(PORT, () => console.log(`🚀 BizFlow API running on port ${PORT}`));
});
