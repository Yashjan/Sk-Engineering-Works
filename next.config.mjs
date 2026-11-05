const isProduction = process.env.NODE_ENV === "production";
const basePath = isProduction ? "/Sk-Engineering-Works" : "";

/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  experimental: {
    // The installed stable TypeScript compiler API is available. Using it
    // avoids the extensionless CLI wrapper issue in Next 16's CLI checker.
    useTypeScriptCli: false,
  },
};

export default nextConfig;
