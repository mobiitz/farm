/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        farm: "0 30px 80px rgba(15, 23, 42, 0.45)",
      },
      backgroundImage: {
        "farm-grid":
          "radial-gradient(circle at top, rgba(100, 116, 139, 0.18), transparent 36%), linear-gradient(rgba(15, 23, 42, 0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.18) 1px, transparent 1px)",
      },
      backgroundSize: {
        "farm-grid": "auto, 32px 32px, 32px 32px",
      },
    },
  },
  plugins: [],
};
