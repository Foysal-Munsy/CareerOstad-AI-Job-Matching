import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import NextAuthProvider from "@/Providers/NextAuthProvider";
import Chrome from "@/components/Chrome";
import RouteProgressBar from "@/components/RouteProgressBar";

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
          <Chrome>
            <RouteProgressBar />
            {children}            
          </Chrome>
        </NextAuthProvider>
        <Script id="tawk-init" strategy="afterInteractive">
          {`
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
          `}
        </Script>
        <Script
          id="tawk-embed"
          strategy="afterInteractive"
          src="https://embed.tawk.to/68dc8833fa5af1194d4074ed/1j6en82ck"
          charSet="UTF-8"
          crossOrigin="*"
        />
      </body>
    </html>
  );
}
