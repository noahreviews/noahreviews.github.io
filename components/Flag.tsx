import type { Lang } from '@/lib/i18n';

/** 50 five-pointed stars for the US canton (9 rows of 6 and 5), drawn as one path in the 640×480 flag space. */
const US_STARS = (() => {
  const star = (cx: number, cy: number, r: number) =>
    Array.from({ length: 10 }, (_, i) => {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const d = i % 2 ? r * 0.382 : r;
      return `${i ? 'L' : 'M'}${(cx + d * Math.cos(a)).toFixed(1)} ${(cy + d * Math.sin(a)).toFixed(1)}`;
    }).join('') + 'Z';
  const w = 364.8 / 12, h = 258.5 / 10;
  let d = '';
  for (let row = 1; row <= 9; row++) for (let col = row % 2 ? 1 : 2; col <= 11; col += 2) d += star(col * w, row * h, 11.5);
  return d;
})();

/** Small inline SVG flags (4:3) for the language switcher. English (US) shows the US flag, English (UK) the Union Jack. */
const FLAGS: Record<Lang, React.ReactNode> = {
  en: (
    <g transform="scale(0.0375)">
      <rect width="640" height="480" fill="#b22234" />
      <path d="M0 55.4h640M0 129.2h640M0 203.1h640M0 276.9h640M0 350.8h640M0 424.6h640" stroke="#fff" strokeWidth="36.9" />
      <rect width="364.8" height="258.5" fill="#3c3b6e" />
      <path d={US_STARS} fill="#fff" />
    </g>
  ),
  'en-gb': (
    <g transform="scale(0.0375)">
      <rect width="640" height="480" fill="#012169" />
      <path fill="#fff" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0z" />
      <path fill="#c8102e" d="m424 281 216 159v40L369 281zm-184 20 6 35L54 480H0zM640 0v3L391 191l2-44L590 0zM0 0l239 176h-60L0 42z" />
      <path fill="#fff" d="M241 0v480h160V0zM0 160v160h640V160z" />
      <path fill="#c8102e" d="M0 193v96h640v-96zM273 0v480h96V0z" />
    </g>
  ),
  de: (<><rect width="24" height="6" fill="#000" /><rect y="6" width="24" height="6" fill="#dd0000" /><rect y="12" width="24" height="6" fill="#ffce00" /></>),
  fr: (<><rect width="8" height="18" fill="#0055a4" /><rect x="8" width="8" height="18" fill="#fff" /><rect x="16" width="8" height="18" fill="#ef4135" /></>),
  es: (<><rect width="24" height="18" fill="#aa151b" /><rect y="4.5" width="24" height="9" fill="#f1bf00" /></>),
  it: (<><rect width="8" height="18" fill="#009246" /><rect x="8" width="8" height="18" fill="#fff" /><rect x="16" width="8" height="18" fill="#ce2b37" /></>),
  nl: (<><rect width="24" height="6" fill="#ae1c28" /><rect y="6" width="24" height="6" fill="#fff" /><rect y="12" width="24" height="6" fill="#21468b" /></>),
  pl: (<><rect width="24" height="9" fill="#fff" /><rect y="9" width="24" height="9" fill="#dc143c" /></>),
  pt: (<><rect width="24" height="18" fill="#ff0000" /><rect width="9.6" height="18" fill="#006600" /><circle cx="9.6" cy="9" r="3.4" fill="#ffcc00" /><circle cx="9.6" cy="9" r="2.1" fill="#ff0000" stroke="#fff" strokeWidth=".5" /></>),
  sv: (<><rect width="24" height="18" fill="#006aa7" /><rect x="7" width="3" height="18" fill="#fecc00" /><rect y="7.5" width="24" height="3" fill="#fecc00" /></>),
};

export default function Flag({ lang, size = 20 }: { lang: Lang; size?: number }) {
  return (
    <svg className="flag" viewBox="0 0 24 18" width={size} height={(size * 3) / 4} aria-hidden="true" focusable="false">
      {FLAGS[lang]}
    </svg>
  );
}
