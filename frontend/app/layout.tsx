"use client";

import { Providers } from "./providers";
import "./styles/globals.css";
import { useEffect, useState } from "react";

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
            {children}
          </Providers>
        ) : null}
      </body>
    </html>
  );
}
