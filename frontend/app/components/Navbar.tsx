// frontend/src/app/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { ConnectKitButton } from 'connectkit'; // For wallet connection

// Assuming context and hooks are in src/app/context/
import { useAuth } from '../context/AuthContext'; // Adjust path if necessary
import { useWallet } from '../context/WalletContext'; // Adjust path if necessary

// Placeholder for a search icon, replace with actual icon
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

// Placeholder for a profile icon
const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 rounded-full">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);


const Navbar = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { isAuthenticated, userRole } = useAuth(); // Get auth state
  const { address, isConnected } = useWallet();    // Get wallet state from your context if needed, ConnectKitButton handles its own display

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/my-nfts', label: 'My NFTs' }, // Conditional or role-based?
    { href: '/creators', label: 'Creators' },
    { href: '/about', label: 'About Us' },
  ];

  // Ensure component is mounted before using theme stuff to avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  const shortenAddress = (addr: string | undefined) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  if (!mounted) return null; // Or a loading skeleton for Navbar

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
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium
                  ${pathname === link.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted hover:text-muted-foreground'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side: Search, Theme, Wallet, Role Button, Profile */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            {/* Search Bar (Optional) */}
            <div className="relative">
              <input
                type="search"
                placeholder="Search..."
                className="bg-muted text-muted-foreground placeholder-muted-foreground rounded-full py-2 px-4 pl-10 focus:ring-primary focus:border-primary text-sm"
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
              {theme === 'light' ? (
                // Moon Icon (placeholder)
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>
              ) : (
                // Sun Icon (placeholder)
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591M12 6.75V9m0 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /></svg>
              )}
            </button>

            {/* Role-Specific Button */}
            {isAuthenticated && (
              <>
                {userRole === 'creator' && (
                  <Link
                    href="/dashboard/creator/mint-content" // Assuming this is your minting page
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Mint NFT
                  </Link>
                )}
                {userRole === 'consumer' && (
                   <Link
                    href="/marketplace" // Or a specific discovery page
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Discover
                  </Link>
                )}
              </>
            )}

            {/* Wallet Connection & Profile */}
            <ConnectKitButton.Custom>
              {({ isConnected: ckIsConnected, show, truncatedAddress, ensName }) => {
                return (
                  <button
                    onClick={show}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium border border-border hover:bg-muted"
                  >
                    {ckIsConnected ? (
                      <>
                        <ProfileIcon />
                        <span>{ensName ?? truncatedAddress}</span>
                      </>
                    ) : (
                      <span>Connect Wallet</span>
                    )}
                  </button>
                );
              }}
            </ConnectKitButton.Custom>

          </div>

          {/* Mobile Menu Button (Placeholder - functionality not implemented) */}
          <div className="md:hidden flex items-center">
            <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              {/* Hamburger Icon */}
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
