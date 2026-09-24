import { Response } from "express";
import { pool } from "../config/db";
import { AuthRequest } from "../middleware/auth";

export async function listProducts(req: AuthRequest, res: Response) {
  const [rows] = await pool.query(
    "SELECT * FROM products WHERE user_id = ? ORDER BY created_at DESC",
    [req.userId]
  );
  res.json(rows);
}

export async function createProduct(req: AuthRequest, res: Response) {
  const { name, sku, price, cost, quantity, lowStockThreshold } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({ error: "name and price are required" });
  }

  const [result]: any = await pool.query(
    `INSERT INTO products (user_id, name, sku, price, cost, quantity, low_stock_threshold)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [req.userId, name, sku ?? null, price, cost ?? 0, quantity ?? 0, lowStockThreshold ?? 5]
  );

  res.status(201).json({ id: result.insertId, name, sku, price, cost, quantity });
}

export async function updateProduct(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const { name, sku, price, cost, quantity, lowStockThreshold } = req.body;

  const [result]: any = await pool.query(
    `UPDATE products SET name = ?, sku = ?, price = ?, cost = ?, quantity = ?, low_stock_threshold = ?
     WHERE id = ? AND user_id = ?`,
    [name, sku, price, cost, quantity, lowStockThreshold, id, req.userId]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json({ id, name, sku, price, cost, quantity });
}

export async function deleteProduct(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const [result]: any = await pool.query(
    "DELETE FROM products WHERE id = ? AND user_id = ?",
    [id, req.userId]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.status(204).send();
}
