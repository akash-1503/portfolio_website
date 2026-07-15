import bcrypt from "bcryptjs";

/**
 * Hash Password Before Saving
 */
export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

/**
 * Compare Password During Login
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
) {
  return bcrypt.compare(password, hashedPassword);
}