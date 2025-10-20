import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ARAM Insights - League of Legends Balance Changes",
    short_name: "ARAM Insights",
    description:
      "Track League of Legends champion, item, and rune balance changes for ARAM, Arena, and URF game modes. Stay updated with the latest nerfs and buffs.",
    start_url: "/",
    display: "standalone",
    background_color: "#111827",
    theme_color: "#1f2937",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/maskable_icon_x48.png",
        sizes: "48x48",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/maskable_icon_x72.png",
        sizes: "72x72",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/maskable_icon_x128.png",
        sizes: "128x128",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/maskable_icon_x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/maskable_icon_x384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/maskable_icon_x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
