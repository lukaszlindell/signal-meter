import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Signal Meter",
  description:
    "Check whether a LinkedIn post has substance, specificity, and a human voice."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
