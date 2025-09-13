import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export function getUserFromToken(token: string) {
  try {
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET) as { id: string };
  } catch (err) {
    return null;
  }
}
