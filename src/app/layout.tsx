import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <AnnouncementBar />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
