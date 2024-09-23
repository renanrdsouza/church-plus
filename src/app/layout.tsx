import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "./components/header";

const montserrat = Montserrat({ subsets: ["cyrillic"] });

export const metadata: Metadata = {
  title: "Church Plus",
  description: "Administração de igrejas",
  keywords: ["Administração", "Igreja", "Finanças"],
  openGraph: {
    images: ["../../public/logo_transparent.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
    },
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL as string),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} bg-slate-100`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
