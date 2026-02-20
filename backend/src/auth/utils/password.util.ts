import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

/**
 * Hashes a plain-text password using bcrypt with 12 salt rounds.
 * @param plainPassword - The raw password from the user.
 * @returns The bcrypt hash string.
 */
export const hashPassword = async (plainPassword: string): Promise<string> => {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
};

/**
 * Securely compares a plain-text password against a stored bcrypt hash.
 * Uses bcrypt's constant-time comparison to prevent timing attacks.
 * @param plainPassword - The raw password to verify.
 * @param hash - The stored bcrypt hash.
 * @returns `true` if they match, `false` otherwise.
 */
export const comparePassword = async (
  plainPassword: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hash);
};
