import bcrypt from 'bcrypt'

/**
 * Utility function to hash passwords using bcrypt
 * @param password The plain text password to hash
 * @param saltRounds The number of salt rounds to use (default: 10)
 * @returns Promise<string> The hashed password
 */
export async function hashPassword(password: string, saltRounds: number = 10): Promise<string> {
  return bcrypt.hash(password, saltRounds)
}

/**
 * Utility function to compare a password with a hash
 * @param password The plain text password to check
 * @param hash The hash to compare against
 * @returns Promise<boolean> True if the password matches the hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
