import clsx, { ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Extended twMerge configuration that handles DaisyUI classes
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      // DaisyUI component size variants
      "font-size": [
        "input-xs",
        "input-sm",
        "input-md",
        "input-lg",
        "btn-xs",
        "btn-sm",
        "btn-md",
        "btn-lg",
      ],
    },
  },
});

/**
 * Utility function to merge Tailwind CSS classes
 * This is a client-safe version that doesn't import server-only packages
 * Also exported from @/utils but that file includes plaiceholder (server-only)
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
