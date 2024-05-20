import { Poppins } from "next/font/google";
import Navbar from "@/components/layouts/Navbar";
import "./globals.css";
import SessionProviderWrapper from "@/components/layouts/SessionProviderWrapper";

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
        className={`${poppins.className} bg-color-primary`}
        suppressHydrationWarning={true}
      >
        <SessionProviderWrapper session={session}>
          <Navbar />
            {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
