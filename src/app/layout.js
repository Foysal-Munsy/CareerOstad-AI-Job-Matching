import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import NextAuthProvider from "@/Providers/NextAuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CareerOstad || AI Job Matching",
  description: "AI-Powered Job Matching & Career Guidance Portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthProvider>
          <div className="min-h-screen flex flex-col">
            <header className="sticky top-0 transition-all duration-1000 z-[999] bg-base-200">
              <Navbar />
            </header>
            <main className="flex-grow">{children}</main>
            <footer>
              <Footer />
            </footer>
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
} 
