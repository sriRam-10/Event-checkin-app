import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export function getUserFromToken(token: string) {
  try {
    if (!token) return null;
    const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET) as {
      id: string;
    };
    return decoded;
  } catch (err) {
    return null;
  }
}
