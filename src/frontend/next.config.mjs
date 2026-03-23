/** @type {import('next').NextConfig} */
const nextConfig = {
  // -------------------------------------------------
  // 1️⃣  STATIC EXPORT – the only mode that works
  // -------------------------------------------------
  output: 'export',                     // generate plain HTML/JS/CSS files

  // -------------------------------------------------
  // 2️⃣  TYPE‑SCRIPT – keep fast, ignore errors for now
  // -------------------------------------------------
  typescript: { ignoreBuildErrors: true },

  // -------------------------------------------------
  // 3️⃣  IMAGES – we pre‑convert everything, so disable runtime optimisation
  // -------------------------------------------------
  images: { unoptimized: true },

  // -------------------------------------------------
  // 4️⃣  EXPERIMENTAL – ONLY the *array* version of optimisePackageImports
  // -------------------------------------------------
  experimental: {
    // Keep only the packages you really import – this prunes dead code.
    // These packages are large and benefit from tree-shaking optimization.
    optimizePackageImports: [
      'lucide-react',      // Icon library – huge, only import needed icons
      'recharts',          // Charting library – only used components bundled
      'react-day-picker',  // Calendar component – modular tree-shaking
      'date-fns',          // Date utilities – import selectively (if used)
      'zod',               // Validation library – only validators used bundled
    ],
  },
};

export default nextConfig;