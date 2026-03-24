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
    ],

    // Enable Turbopack's filesystem cache during production builds for faster rebuilds.
    turbopackFileSystemCacheForBuild: true,

    // Enable tree-shaking in Turbopack to remove unused code and reduce bundle size.
    // turbopackTreeShaking: true,

    // Remove unused exports in Turbopack to further optimize the bundle size.
    turbopackRemoveUnusedExports: true,

    // Remove unused imports in Turbopack to clean up the code and reduce bundle size.
    turbopackRemoveUnusedImports: true,

    // Enable minification in Turbopack to reduce the size of the output bundles.
    turbopackMinify: true,
  },
};

export default nextConfig;