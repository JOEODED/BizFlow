import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { listSales, createSale } from "../controllers/saleController";

const router = Router();
router.use(requireAuth);
router.get("/", listSales);
router.post("/", createSale);

export default router;
