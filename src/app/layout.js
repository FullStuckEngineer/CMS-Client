"use client";

import React, { useState, useEffect, createContext } from "react";
import { useRouter } from "next/navigation";
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

export const AuthContext = createContext();

export default function RootLayout({ children, session }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
    } else {
      setIsLoggedIn(true);
    }
  }, [router]);

  return (
    <html lang="en">
      <head>
        <title>BabyBoo</title>
      </head>
      <body
        className={`${poppins.className} bg-primary h-screen flex`}
        suppressHydrationWarning={true}
      >
        <SessionProviderWrapper session={session}>
          <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            <div className="flex w-full h-full">
              {isLoggedIn && <Sidebar />}
              <div className={`flex-1 ${isLoggedIn ? 'ml-64' : ''}`}>
                <Navbar />
                <main className="p-4 mt-16">
                  {children}
                </main>
              </div>
            </div>
          </AuthContext.Provider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}