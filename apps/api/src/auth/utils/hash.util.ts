import argon2 from 'argon2';

/**
 * Hashes a plain-text password using Argon2id.
 *
 * @param password - The plain-text password to hash.
 * @returns The hashed password string.
 */
export async function hashPassword(password: string) {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
  });
}

/**
 * Verifies a plain-text password against a hashed value.
 *
 * @param hash - The hashed password stored in DB.
 * @param password - The plain-text password to verify.
 * @returns `true` if the password matches the hash.
 */
export async function verifyPassword(
  hashedPassword: string,
  plainPassword: string
) {
  try {
    return await argon2.verify(hashedPassword, plainPassword);
  } catch (error) {
    return false;
  }
}
