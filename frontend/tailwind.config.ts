import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17211b",
        panel: "#f7f8f4",
        line: "#dbe2d6",
        leaf: "#2f7d52",
        amber: "#b7791f",
        clay: "#b4483d"
      }
    }
  },
  plugins: []
};

export default config;
