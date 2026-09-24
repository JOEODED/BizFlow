import { Response } from "express";
import { pool } from "../config/db";
import { AuthRequest } from "../middleware/auth";

export async function listSales(req: AuthRequest, res: Response) {
  const [rows] = await pool.query(
    `SELECT sales.*, products.name AS product_name
     FROM sales JOIN products ON sales.product_id = products.id
     WHERE sales.user_id = ? ORDER BY sold_at DESC LIMIT 100`,
    [req.userId]
  );
  res.json(rows);
}

export async function createSale(req: AuthRequest, res: Response) {
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({ error: "productId and a positive quantity are required" });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [rows] = await conn.query(
      "SELECT * FROM products WHERE id = ? AND user_id = ? FOR UPDATE",
      [productId, req.userId]
    );
    const product = (rows as any[])[0];

    if (!product) {
      await conn.rollback();
      return res.status(404).json({ error: "Product not found" });
    }
    if (product.quantity < quantity) {
      await conn.rollback();
      return res.status(400).json({ error: `Only ${product.quantity} units left in stock` });
    }

    const total = Number(product.price) * quantity;

    await conn.query(
      "INSERT INTO sales (user_id, product_id, quantity, unit_price, total) VALUES (?, ?, ?, ?, ?)",
      [req.userId, productId, quantity, product.price, total]
    );
    await conn.query("UPDATE products SET quantity = quantity - ? WHERE id = ?", [
      quantity,
      productId,
    ]);

    await conn.commit();
    res.status(201).json({ productId, quantity, unitPrice: product.price, total });
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
