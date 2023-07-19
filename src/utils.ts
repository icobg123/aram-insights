// utils/getURL.ts
const IS_SERVER = typeof window === "undefined";

export function getURL(path: string) {
  const env = process.env.NODE_ENV;
  let base = "";
  if (env == "development") {
    // do something
    base = "http://localhost:3000";
  } else if (env == "production") {
    // do something
    base = "https://aram-insights.vercel.app";
  }

  const baseURL = IS_SERVER ? base : window.location.origin;
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
