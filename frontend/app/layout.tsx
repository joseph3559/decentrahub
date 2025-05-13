"use client";

import { Providers } from "./providers";
import "./styles/globals.css";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {mounted ? (
          <Providers>
            <Navbar />
            {children}
          </Providers>
        ) : null}
      </body>
    </html>
  );
}
