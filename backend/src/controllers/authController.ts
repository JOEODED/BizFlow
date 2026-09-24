import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db";

export async function register(req: Request, res: Response) {
  const { businessName, email, password } = req.body;

  if (!businessName || !email || !password) {
    return res.status(400).json({ error: "businessName, email and password are required" });
  }

  const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
  if ((existing as any[]).length > 0) {
    return res.status(400).json({ error: "Email already registered" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [result]: any = await pool.query(
    "INSERT INTO users (business_name, email, password_hash) VALUES (?, ?, ?)",
    [businessName, email, passwordHash]
  );

  const token = jwt.sign({ userId: result.insertId }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  res.status(201).json({ token, businessName, email });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  const user = (rows as any[])[0];

  // Same generic message whether the email or password is wrong,
  // so no one can probe which emails are registered.
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  res.json({ token, businessName: user.business_name, email: user.email });
}
