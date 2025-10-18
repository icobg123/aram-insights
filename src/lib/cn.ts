import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 * This is a client-safe version that doesn't import server-only packages
 * Also exported from @/utils but that file includes plaiceholder (server-only)
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
