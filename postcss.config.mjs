/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {
      content: [
        "./src/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./node_modules/react-table-craft/dist/**/*.{js,mjs}",

      ],
    },
  },
};

export default config;
