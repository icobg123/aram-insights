// utils/getURL.ts
const IS_SERVER = typeof window === "undefined";

export function getURL(path: string) {
  const baseURL = IS_SERVER
    ? process.env.NEXT_PUBLIC_SITE_URL!
    : window.location.origin;
  return new URL(path, baseURL).toString();
}

export function replaceAfterLastSlash(url?: string): string {
  if (!url) {
    return "";
  }
  const lastSlashIndex = url.lastIndexOf("/");
  if (lastSlashIndex !== -1) {
    const updatedURL = url.substring(0, lastSlashIndex + 1);
    return updatedURL + "64";
  } else {
    return url; // Return the original URL if there is no slash
  }
}
