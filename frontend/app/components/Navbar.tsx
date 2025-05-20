// frontend/app/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { useTheme } from 'next-themes';
import { ConnectKitButton } from 'connectkit';
import { useAuth } from '../context/AuthContext'; // Adjust path if necessary
// import { useWallet } from '../context/WalletContext'; // Not directly used here for display logic if ConnectKit handles it

// Icons (replace with Lucide or your preferred library if you integrate one fully)
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const ProfileIcon = () => ( // Placeholder, ConnectKit might provide its own or you can use an avatar
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 rounded-full">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>
);

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591M12 6.75V9m0 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /></svg>
);


const Navbar = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, userRole, currentUser } = useAuth();

  const navLinks = useMemo(() => {
    const links = [
      { href: '/', label: 'Home', public: true },
      { href: '/marketplace', label: 'Marketplace', public: true },
    ];

    if (isAuthenticated) {
      if (userRole === 'creator') {
        links.push({ href: '/dashboard/creator/my-creations', label: 'My Creations', public: false });
        links.push({ href: '/dashboard/creator', label: 'Creator Hub', public: false });
      } else if (userRole === 'consumer') {
        links.push({ href: '/dashboard/consumer/mymarketplace', label: 'My Activity', public: false });
      }
    }
    // "About Us" can be a public link
    // links.push({ href: '/about', label: 'About Us', public: true }); // Uncomment if you have an About Us page

    return links;
  }, [isAuthenticated, userRole]);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // To prevent layout shift, you could return a skeleton or a non-interactive version of the navbar
    return (
        <nav className="bg-background sticky top-0 z-50 shadow-md dark:shadow-gray-700">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <span className="text-2xl font-bold text-primary">DecentraHub</span>
                    </div>
                    <div className="h-8 w-24 bg-muted rounded-md animate-pulse"></div> {/* Placeholder for buttons */}
                </div>
            </div>
        </nav>
    );
  }

  return (
    <nav className="bg-background sticky top-0 z-50 shadow-md dark:shadow-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-primary">
              DecentraHub
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium
                  ${pathname === link.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted hover:text-muted-foreground'
                  } transition-colors duration-150`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side: Search, Theme, Wallet, Role Button, Profile */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
            {/* Search Bar (Optional - consider if needed for MVP) */}
            <div className="relative">
              <input
                type="search"
                placeholder="Search..."
                className="bg-muted text-muted-foreground placeholder-muted-foreground rounded-full py-2 px-4 pl-10 focus:ring-primary focus:border-primary text-sm w-40 lg:w-auto"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
            </div>

            {/* Theme Switcher */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-md hover:bg-muted text-foreground"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>

            {/* Role-Specific Button */}
            {isAuthenticated && userRole === 'creator' && (
              <Link
                href="/dashboard/creator/mint-content" // Correct path to mint content page
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
              >
                Mint NFT
              </Link>
            )}
            {/* No specific "Discover" button here as "Marketplace" link serves that purpose */}


            {/* Wallet Connection & Profile Link */}
            <ConnectKitButton.Custom>
              {({ isConnected, show, truncatedAddress, ensName }) => {
                if (isConnected && currentUser) { // currentUser from useAuth()
                  return (
                    <Link href="/profile/me" className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium border border-border hover:bg-muted">
                        <ProfileIcon /> {/* Replace with actual avatar if available: currentUser.avatarUrl */}
                        <span>{currentUser.lensHandle || currentUser.fullName || ensName || truncatedAddress}</span>
                    </Link>
                  );
                }
                return (
                  <button
                    onClick={show}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
                  >
                    Connect Wallet
                  </button>
                );
              }}
            </ConnectKitButton.Custom>

          </div>

          {/* Mobile Menu Button (Placeholder - functionality not implemented) */}
          <div className="md:hidden flex items-center">
             {/* Theme Switcher for mobile */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-md hover:bg-muted text-foreground mr-2"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
            <ConnectKitButton />
            <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-4 6h10" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
