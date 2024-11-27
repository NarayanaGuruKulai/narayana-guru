import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react"; // Importing Uploadthing components
import type { OurFileRouter } from "~/server/uploadthing"; // Importing custom file router type

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      colors: {
        lightgreen: '#90EE90',
        brown: '#8B4513',
        lightblue: '#ADD8E6',
      }
    },
  },
  plugins: [],
} satisfies Config;

// Uploadthing button and dropzone components
export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

