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
    default: "WebSpeed | فروشگاه اینترنتی",
    template: "%s | WebSpeed",
  },
  description:
    "خرید آنلاین با ارسال سریع، ضمانت اصالت کالا و بهترین قیمت. پوشاک، دیجیتال و کالای روزمره.",
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "WebSpeed",
    title: "WebSpeed | فروشگاه اینترنتی",
    description:
      "خرید آنلاین با ارسال سریع، ضمانت اصالت کالا و بهترین قیمت.",
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
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} ${vazirmatn.className}`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen flex flex-col no-x-scroll font-sans antialiased bg-background text-foreground"
        style={{
          fontFamily: "var(--font-vazirmatn), Tahoma, system-ui, sans-serif",
        }}
        suppressHydrationWarning
      >
        <CartProvider>
          <ShopChrome>{children}</ShopChrome>
        </CartProvider>
      </body>
    </html>
  );
}
