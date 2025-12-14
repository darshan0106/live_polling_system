export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        text: "var(--color-text)",
        muted: "var(--color-muted)",
        bg: "var(--color-bg)",
      },
    },
  },
  plugins: [],
};
