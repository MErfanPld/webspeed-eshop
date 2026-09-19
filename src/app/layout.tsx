import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body
        className="min-h-screen flex flex-col no-x-scroll font-sans"
        suppressHydrationWarning
      >
        <CartProvider>
          <AnnouncementBar />
          <Navbar />
          <main className="flex-1 w-full min-w-0">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
