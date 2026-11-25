import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ProgressRail } from "@/components/ProgressRail";
import { CommandPalette } from "@/components/CommandPalette";

export const metadata: Metadata = {
  title: "Selen Yel Temellioğlu — Lead Designer & Frontend Engineer",
  description:
    "Lead Designer and frontend engineer building 0-to-1 design systems, multi-state US healthcare platforms, clinical AI apps, and AI-driven banking products across watch, phone, and web.",
  metadataBase: new URL("https://selenyel.com"),
  openGraph: {
    title: "Selen Yel Temellioğlu — Lead Designer & Frontend Engineer",
    description:
      "I design software for people whose hands are already full. Design systems, APCA accessibility, clinical AI, and React/TypeScript engineering.",
    url: "https://selenyel.com",
    siteName: "selenyel.com",
    type: "website",
  },
};

const THEME_BOOT_SCRIPT = `
(function(){
  try {
    var t = localStorage.getItem('sy-theme');
    if (t === 'light' || t === 'dark' || t === 'contrast') {
      document.documentElement.setAttribute('data-theme', t);
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400;12..96,75..100,500;12..96,75..100,700&family=JetBrains+Mono:wght@400;500&family=Public+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <div className="canvas-grid" aria-hidden="true" />
        <ThemeProvider>
          <ProgressRail />
          <CommandPalette />
          <div className="shell">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
