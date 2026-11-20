import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { brand, baseKeywords } from "@/lib/seo";
import { localBusinessSchema } from "@/lib/schema";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/layout/SmoothScroll";
import ScrollProgress from "@/components/layout/ScrollProgress";
import BackToTop from "@/components/layout/BackToTop";
import Intro from "@/components/layout/Intro";
import ContentGuard from "@/components/layout/ContentGuard";
import ContextMenu from "@/components/layout/ContextMenu";
import PointerFX from "@/components/layout/PointerFX";
import { TransitionProvider } from "@/components/layout/PageTransition";
import { EnquiryProvider } from "@/components/layout/EnquiryModal";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-label",
  display: "swap",
});

/**
 * Site-wide defaults. Each page refines these through pageMetadata() in
 * lib/seo.ts; anything a page does not set falls back to what is here.
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "BSM Security Agency, Goa — Security Guards & Security Services",
    template: `%s | ${brand.suffix}`,
  },
  description: site.description,
  applicationName: brand.name,
  keywords: baseKeywords,
  authors: [{ name: brand.name, url: site.url }],
  creator: brand.name,
  publisher: brand.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: brand.name,
    title: `${brand.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} — Security Agency in Goa`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  /* Phone numbers on the page are links already; stop iOS styling others. */
  formatDetection: { telephone: false, email: false, address: false },
  category: "Security Services",
  other: {
    "geo.region": "IN-GA",
    "geo.placename": "Margao, Goa",
  },
};

export const viewport: Viewport = {
  themeColor: "#04060a",
  colorScheme: "dark",
  /**
   * iOS only: let the page fill the display, including the area beside the
   * notch in landscape. It is what makes env(safe-area-inset-*) non-zero,
   * and every element pinned to an edge adds the matching inset back (the
   * header, the scroll bar, the back-to-top button, the page gutters). On
   * anything without a notch the insets are 0 and nothing moves.
   */
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-IN"
      className={`${archivo.variable} ${instrument.variable} ${mono.variable}`}
      /* the inline script below adds `anim-ready` before React hydrates */
      suppressHydrationWarning
    >
      <head>
        {/*
          Motion is opt-in at the document level: the hidden pre-animation
          states only apply once we know JS is running and the visitor has not
          requested reduced motion. Without this the page can never be stuck
          invisible.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('anim-ready')}}catch(e){}",
          }}
        />
        {/*
          Whether the entrance runs is settled here, before the body is
          painted, rather than in an effect after hydration. Deciding it
          later meant the page showed through for the few frames before the
          cover appeared. The screen itself is in the HTML already and rests
          at display:none; this only marks the document when it should run,
          which is the first view of a session for a visitor who has not
          asked for reduced motion.
        */}
        <script dangerouslySetInnerHTML={{ __html: "try{if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&sessionStorage.getItem('bsm-intro')!=='seen'){sessionStorage.setItem('bsm-intro','seen');document.documentElement.setAttribute('data-intro','on')}}catch(e){}" }} />
        {/*
          Stale build guard.

          Every build names its CSS and JS chunks after a fresh hash, and a
          deployment keeps only its own. A page already open when a new build
          goes live — an open tab, a back/forward restore, or a client-side
          navigation using the old build's manifest — therefore asks for files
          that now return 404, and arrives unstyled or with nothing updated.

          There is no server here to detect the mismatch (the site is a static
          export), so the page watches for it: a stylesheet or script under
          /_next/static that fails to load, or a chunk import that rejects,
          means the build it belongs to is gone. Reloading fetches the current
          HTML, which names the current files.

          The reload happens at most once per tab — the flag is cleared only
          when a page finishes loading without the failure — so a genuinely
          broken asset cannot put the tab in a loop.
        */}
        <script dangerouslySetInnerHTML={{ __html: "(function(){var K='bsm-stale-build';function ok(){try{sessionStorage.removeItem(K)}catch(e){}}function stale(){try{if(sessionStorage.getItem(K))return;sessionStorage.setItem(K,'1')}catch(e){}location.reload()}addEventListener('load',ok);addEventListener('error',function(e){var t=e.target;if(!t||!t.tagName)return;if(t.tagName!=='LINK'&&t.tagName!=='SCRIPT')return;if(((t.href||t.src||'')+'').indexOf('/_next/static/')<0)return;stale()},true);addEventListener('unhandledrejection',function(e){var r=e&&e.reason;var m=((r&&r.message)||r||'')+'';if(/Loading chunk|dynamically imported module|Importing a module script failed/i.test(m))stale()})})()" }} />
      </head>
      <body className="bg-void antialiased">
        <TransitionProvider>
          <EnquiryProvider>
            <SmoothScroll />
            <ContentGuard />
            <ContextMenu />
            <PointerFX />
            <ScrollProgress />
            <Intro />
            <Navbar />
            <main id="main">{children}</main>
            <Footer />
            <BackToTop />
          </EnquiryProvider>
        </TransitionProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </body>
    </html>
  );
}
