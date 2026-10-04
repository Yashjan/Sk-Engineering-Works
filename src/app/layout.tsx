import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "S.K. Engineering Works | Salt Refinery Engineering",
  description: "Complete salt refinery plants and salt-processing machinery engineered in Sambhar Lake, Rajasthan, India.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><head>
    {/* Parser-blocking session decision: runs before the body can paint. */}
    <script dangerouslySetInnerHTML={{ __html: `(function(){try{if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&sessionStorage.getItem('sk-intro-played')!=='true'){document.documentElement.dataset.skIntro='active';}}catch(e){}})();` }} />
  </head><body>{children}</body></html>;
}
