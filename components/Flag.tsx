import type { Lang } from '@/lib/i18n';

/** Small inline SVG flags (4:3) for the language switcher. English shows a split US/UK flag. */
const FLAGS: Record<Lang, React.ReactNode> = {
  en: (
    <>
      <defs><clipPath id="fl-us"><path d="M0 0h24v18z" /></clipPath><clipPath id="fl-uk"><path d="M24 0v18H0z" /></clipPath></defs>
      <g clipPath="url(#fl-us)">
        <rect width="24" height="18" fill="#fff" />
        {[0, 2, 4, 6, 8, 10, 12].map((i) => <rect key={i} y={i * 1.385} width="24" height="1.385" fill="#b22234" />)}
        <rect width="10.3" height="9.7" fill="#3c3b6e" />
      </g>
      <g clipPath="url(#fl-uk)">
        <rect width="24" height="18" fill="#012169" />
        <path d="M0 0l24 18M24 0L0 18" stroke="#fff" strokeWidth="3.6" />
        <path d="M0 0l24 18M24 0L0 18" stroke="#c8102e" strokeWidth="1.2" />
        <path d="M12 0v18M0 9h24" stroke="#fff" strokeWidth="6" />
        <path d="M12 0v18M0 9h24" stroke="#c8102e" strokeWidth="3.6" />
      </g>
    </>
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
