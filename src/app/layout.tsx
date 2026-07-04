import type { Metadata } from "next";
import { Poppins, Lora } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/cart-context";
import { WishlistProvider } from "@/contexts/wishlist-context";
import { AuthProvider } from "@/contexts/auth-context";
import { ToastProvider } from "@/contexts/toast-context";
import { CartSidebar } from "@/components/sections/cart-sidebar";
import { PageTransition } from "@/components/page-transition";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  weight: ["400", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pulsa | Moda Fitness Premium",
  description:
    "Moda fitness premium para quem busca performance sem abrir mão do estilo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${poppins.variable} ${lora.variable}`}
    >
      <head />
      <body>
        <CartProvider>
          <WishlistProvider>
          <AuthProvider>
          <ToastProvider>
            <PageTransition>{children}</PageTransition>
            <CartSidebar />
            <WhatsAppButton />
          </ToastProvider>
          </AuthProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
