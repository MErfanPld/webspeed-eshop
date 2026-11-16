import type { Metadata, Viewport } from "next";
import "./fonts.css";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const SITE_URL = (process.env.SITE_URL || "http://localhost:3000").replace(/\/+$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "WebSpeed | فروشگاه اینترنتی",
    template: "%s | WebSpeed",
  },
  description:
    "خرید آنلاین با ارسال سریع، ضمانت اصالت کالا و بهترین قیمت. پوشاک، دیجیتال و کالای روزمره.",
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "WebSpeed",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#E31B23",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        {/* Most text uses these two weights: fetch them before CSS is parsed */}
        <link rel="preload" href="/fonts/Vazirmatn-Regular.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/Vazirmatn-SemiBold.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body
        className="min-h-screen flex flex-col no-x-scroll font-sans antialiased bg-background text-foreground"
        suppressHydrationWarning
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
