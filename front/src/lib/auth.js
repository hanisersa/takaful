import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "hackin_expedition_jwt_secret_2026";

export function signToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
