import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";

/**
 * Generates a URL-friendly slug from text
 * @param text The text to slugify
 * @returns slug string
 */
export const generateSlug = (text: string): string => {
  return slugify(text, { lower: true, strict: true });
};

/**
 * Generates a unique slug by checking database and appending uuid if conflict exists
 * @param text The text to slugify
 * @param Model The Mongoose model to check against
 * @returns Promise<string> unique slug
 */
export const generateUniqueSlug = async (
  text: string,
  Model: any,
): Promise<string> => {
  const baseSlug = generateSlug(text);
  const existing = await Model.findOne({ slug: baseSlug });

  if (!existing) {
    return baseSlug;
  }

  const suffix = uuidv4().split("-")[0].substring(0, 4);
  return `${baseSlug}-${suffix}`;
};
