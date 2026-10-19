/** Static export for GitHub Pages (org site at the domain root, so no basePath). */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};
export default nextConfig;
