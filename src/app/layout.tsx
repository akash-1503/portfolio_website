import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";


const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "NGO Foundation | Empower Lives",
  description: "Serve Selflessly, Empower Lives. Join us in making a difference.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} scroll-smooth`}>
      <body className="antialiased min-h-screen flex flex-col font-sans">
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
