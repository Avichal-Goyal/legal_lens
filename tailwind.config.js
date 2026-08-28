/** @type {import('tailwindcss').Config} */
export default {
  // Tells Tailwind which files to look at for CSS classes
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // You can add your "Legal Lens" branding colors here
      colors: {
        legalIndigo: "#4f46e5",
      },
    },
  },
  plugins: [
    // REQUIRED: This styles the AI's Markdown (tables, lists, etc.)
    require('@tailwindcss/typography'),
  ],
};