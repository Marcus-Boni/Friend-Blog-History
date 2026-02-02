import { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Centuriões Verbum",
    short_name: "Centuriões",
    description: "O Universo de Baltazar",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#dc143c",
    icons: [
      {
        src: "/Crown.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  }
}
