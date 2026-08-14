import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Little Brush Masters | The Childhood Project",
  description:
    "A private parent-and-child creative experience where families create a one-of-a-kind memory on their child's wall.",
  metadataBase: new URL("https://littlebrushmasters.co.za")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}