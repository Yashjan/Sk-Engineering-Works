import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "S.K. Engineering Works | Salt Refinery Engineering",
  description: "Complete salt refinery plants and salt-processing machinery engineered in Sambhar Lake, Rajasthan, India.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const introScript = `(function(){try{var base=${JSON.stringify(basePath)};var path=location.pathname.replace(/\\/+$/,'')||'/';var home=path===(base||'/');var mobilePlants=path===base+'/salt-refinery-plants'&&window.matchMedia('(max-width: 767px)').matches;if((home||mobilePlants)&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.dataset.skIntro='active';}}catch(e){}})();`;
  return <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning><head>
    {/* Parser-blocking session decision: runs before the body can paint. */}
    <script dangerouslySetInnerHTML={{ __html: introScript }} />
  </head><body>{children}</body></html>;
}
