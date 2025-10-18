import { getPlaiceholder } from "plaiceholder";

// In-memory cache for image data to avoid duplicate fetches during build
const imageCache = new Map<
  string,
  Promise<{
    base64: string;
    img: { src: string; height: number; width: number };
  }>
>();

export async function getImage(src: string) {
  // Check if we already have this image cached
  const cached = imageCache.get(src);
  if (cached) {
    return cached;
  }

  // Create the fetch promise and cache it immediately
  // This ensures concurrent requests for the same image share the same promise
  const imagePromise = (async () => {
    const buffer = await fetch(src, {
      next: { revalidate: 604800 }, // Cache for 7 days
    }).then(async (res) => Buffer.from(await res.arrayBuffer()));

    const {
      metadata: { height, width },
      ...plaiceholder
    } = await getPlaiceholder(buffer, { size: 10 });

    return {
      ...plaiceholder,
      img: { src, height, width },
    };
  })();

  imageCache.set(src, imagePromise);
  return imagePromise;
}

/*
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
*/
