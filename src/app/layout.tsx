import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPOTTED — Find things to do around you",
  description:
    "Discover places, events, and experiences around your location. Businesses and hosts can list venues, events, and local activities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
