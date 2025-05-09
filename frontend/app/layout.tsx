// /home/scott/Desktop/Office/decentrahub/frontend/src/app/layout.tsx
import { Providers } from './providers'; // Import the client component
import './styles/globals.css'; // Assuming your global styles are here

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning> {/* suppressHydrationWarning for next-themes */}
      <body>
        <Providers> {/* This wraps children with all necessary context providers */}
          {/* Your Navbar, Footer, etc. can go here if they are outside of `children`
              or be part of the page structure passed as `children` */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
