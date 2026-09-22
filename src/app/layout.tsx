import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import ShopChrome from "@/components/layout/ShopChrome";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "WebSpeed",
    template: "%s — WebSpeed",
  },
  description: "پوشاک مینیمال با کیفیت بالا. طراحی ماندگار برای زندگی روزمره.",
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "WebSpeed",
    title: "WebSpeed",
    description: "پوشاک مینیمال با کیفیت بالا. طراحی ماندگار برای زندگی روزمره.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#fbf9f9",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} ${vazirmatn.className}`}>
      <body
        className="min-h-screen flex flex-col no-x-scroll font-sans antialiased"
        style={{ fontFamily: "var(--font-vazirmatn), Tahoma, system-ui, sans-serif" }}
        suppressHydrationWarning
      >
        <CartProvider>
          <ShopChrome>{children}</ShopChrome>
        </CartProvider>
      </body>
    </html>
  );
}
