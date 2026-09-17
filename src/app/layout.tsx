import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "WebSpeed | فروشگاه پوشاک مینیمال",
    template: "%s | WebSpeed",
  },
  description:
    "فروشگاه اینترنتی پوشاک مردانه و زنانه با طراحی مینیمال، کیفیت بالا و استایل مدرن.",
  keywords: ["پوشاک", "لباس", "فروشگاه اینترنتی", "مد", "مینیمال", "WebSpeed"],
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "WebSpeed",
    title: "WebSpeed | فروشگاه پوشاک مینیمال",
    description:
      "فروشگاه اینترنتی پوشاک مردانه و زنانه با طراحی مینیمال، کیفیت بالا و استایل مدرن.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#fafaf9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="min-h-screen flex flex-col overflow-x-hidden">
        <CartProvider>
          <AnnouncementBar />
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
