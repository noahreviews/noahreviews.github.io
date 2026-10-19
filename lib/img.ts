/** Responsive srcset for Shopify CDN images (they resize on the fly with ?width=). Other URLs pass through. */
export function cdnSrcSet(url: string, widths = [480, 720, 960, 1200]) {
  if (!url.includes('/cdn/shop/')) return undefined;
  const base = url.replace(/([?&])width=\d+&?/, '$1').replace(/[?&]$/, '');
  const sep = base.includes('?') ? '&' : '?';
  return widths.map((w) => `${base}${sep}width=${w} ${w}w`).join(', ');
}
