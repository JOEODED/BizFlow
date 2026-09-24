import { Response } from "express";
import { pool } from "../config/db";
import { AuthRequest } from "../middleware/auth";

export async function getSummary(req: AuthRequest, res: Response) {
  const userId = req.userId;

  const [salesRows] = await pool.query(
    `SELECT COALESCE(SUM(total), 0) AS todaySales, COUNT(*) AS saleCount
     FROM sales WHERE user_id = ? AND DATE(sold_at) = CURDATE()`,
    [userId]
  );
  const [productRows] = await pool.query(
    `SELECT COUNT(*) AS totalProducts,
            SUM(CASE WHEN quantity <= low_stock_threshold THEN 1 ELSE 0 END) AS lowStock
     FROM products WHERE user_id = ?`,
    [userId]
  );

  const sales = (salesRows as any[])[0];
  const products = (productRows as any[])[0];

  res.json({
    todaySales: Number(sales.todaySales),
    saleCount: sales.saleCount,
    totalProducts: products.totalProducts,
    lowStock: products.lowStock ?? 0,
  });
}
