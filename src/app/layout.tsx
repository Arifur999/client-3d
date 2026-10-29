import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "Keturah Hamilton | On Stage, On Screen, On Purpose",
  description:
    "The official site of Keturah Hamilton: Jamaican-born actress, model, author, producer and philanthropist.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
