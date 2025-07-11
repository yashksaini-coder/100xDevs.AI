import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConvexClerkProvider from "@/providers/ConvexClerkProvider";
import { Footer } from "../components/Footer";
import { Navbar } from "@/components/Navbar";
import Aurora from "@/Backgrounds/Aurora/Aurora";
import SupportDropdown from "@/components/Support";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ai.yashksaini.systems/"),
  title: "100xDevs AI",
  description: "Modern AI TA for 100xDevs, to help get started in your coding journey.",
  openGraph: {
    title: "100xDevs AI",
    description:
      "Modern AI TA for 100xDevs, to help get started in your coding journey.",
    url: "https://ai.yashksaini.systems/",
    siteName: "100xDevs AI",
    images: [
      {
        url: "/landing-page.png",
        width: 1200,
        height: 630,
        alt: "100xDevs AI - Modern AI TA for coding journey",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "100xDevs AI",
    description:
      "Modern AI TA for 100xDevs, to help get started in your coding journey.",
    images: ["/landing-page.png"],
    creator: "@100xDevs",
  },
  icons: {
    icon: "/100xschool.svg",
    shortcut: "/100xschool.svg",
    apple: "/100xschool.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClerkProvider>
      <html lang="en" suppressContentEditableWarning={true}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className="fixed inset-0 z-10">
            <Aurora />
          </div>

          {/* Main Content */}
          <div className="relative min-h-screen flex flex-col z-20">
            <div className="fixed top-0 left-0 right-0 z-50">
              <Navbar />
            </div>
            <main className="flex flex-col flex-grow pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[var(--metallic-blue)] to-[var(--neon-cyan)] rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-[var(--metal-gray)]/80 backdrop-blur-sm rounded-lg border border-[var(--cyber-line-color)] p-6">
                  {children}
                </div>
              </div>
            </main>
            <SupportDropdown theme="dark" />
            <Footer />
          </div>
        </body>
      </html>
    </ConvexClerkProvider>
  );
}
