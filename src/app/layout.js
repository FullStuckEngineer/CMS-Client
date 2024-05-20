import React from "react";
import { Poppins } from "next/font/google";
import Navbar from "@/components/layouts/Navbar";
import Sidebar from "@/components/layouts/Sidebar";
import SessionProviderWrapper from "@/components/layouts/SessionProviderWrapper";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: [
    "100", "300", "400", "500", "600", "700", "800", "900"
  ],
});

export const metadata = {
  title: 'BabyBoo',
};

export default function RootLayout({ children, session }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} bg-primary h-screen flex`}
        suppressHydrationWarning={true}
      >
        <SessionProviderWrapper session={session}>
          <div className="flex-2 ml-64 w-full">
            <Sidebar />
            <Navbar />
            <main className="p-4 mt-16 w-full">
              {children}
            </main>
          </div>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
