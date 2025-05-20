// /home/scott/Desktop/Office/decentrahub/frontend/app/dashboard/consumer/page.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext'; // Adjusted path
import { Button } from '../../components/ui/button'; // Adjusted path
import { ArrowRight, ShoppingBag, Users, Layers, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react'; // Added useEffect

// Interface for dashboard section links
interface DashboardSectionLink {
  ctaText: string;
  href: string;
  title: string;
  description: string;
  Icon: React.ElementType; // Lucide icon component
  bgColorClass: string; // For card background gradient
  textColorClass: string;
}

const dashboardSections: DashboardSectionLink[] = [
  {
    href: '/dashboard/consumer/mymarketplace',
    title: 'My NFT Activity',
    description: 'Manage your purchased NFTs, active bids, sale listings, and favorite items.',
    Icon: Layers,
    bgColorClass: 'from-purple-600 to-indigo-600',
    textColorClass: 'text-purple-100',
    ctaText: ''
  },
  {
    href: '/dashboard/consumer/purchasedcontent',
    title: 'My Purchased Content',
    description: 'Access all your owned articles, music, videos, and art. View, play, or download.',
    Icon: ShoppingBag,
    bgColorClass: 'from-sky-500 to-cyan-500',
    textColorClass: 'text-sky-100',
    ctaText: ''
  },
  {
    href: '/dashboard/consumer/following',
    title: 'Following',
    description: 'Keep up with your favorite creators and collections. Never miss an update.',
    Icon: Users,
    bgColorClass: 'from-emerald-500 to-green-500',
    textColorClass: 'text-emerald-100',
    ctaText: ''
  },
  // Add more sections as needed, e.g., Profile Settings
  {
    href: '/profile/me', // Assuming a general profile page
    title: 'My Profile & Settings',
    description: 'Update your profile information, manage wallet connections, and view settings.',
    Icon: ShieldCheck, // Or UserCog
    bgColorClass: 'from-slate-600 to-gray-700',
    textColorClass: 'text-slate-100',
    ctaText: ''
  }
];

// Placeholder for user stats - fetch from backend or context
interface UserStats {
  nftsOwned: number;
  creatorsFollowed: number;
  activeBids: number;
}

const mockUserStats: UserStats = {
  nftsOwned: 12,
  creatorsFollowed: 5,
  activeBids: 3,
};

export default function ConsumerDashboardPage() {
  // Corrected destructuring: use currentUser and lensProfileData
  const { currentUser, lensProfileData, address, userRole } = useAuth();
  const [userStats] = useState<UserStats>(mockUserStats);

  // TODO: Fetch actual user stats when the component mounts or user data changes
  useEffect(() => {
    if (address && currentUser) {
      // Example: Update stats based on currentUser or lensProfileData
      // This is just a placeholder, actual logic will depend on your data structure
      // setUserStats(prevStats => ({
      //   ...prevStats,
      //   nftsOwned: currentUser.ownedNftCount || 0, // Assuming such a field exists
      //   creatorsFollowed: lensProfileData?.stats?.totalFollowing || 0,
      // }));
    }
  }, [address, currentUser, lensProfileData]);

  // A simple greeting, prioritizing currentUser's lensHandle or fullName
  const userName = currentUser?.lensHandle || currentUser?.fullName || (address ? `${address.slice(0,6)}...${address.slice(-4)}` : 'User');

  // Basic role check - this page is for consumers
  if (userRole && userRole !== 'consumer') {
    return (
        <div className="min-h-screen bg-[#16213e] p-4 md:p-8 font-inter text-white flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
            <p className="text-[#a1a1aa] mt-2">This dashboard is for consumers only.</p>
            <Link href="/marketplace" className="mt-4">
                <Button variant="outline">Go to Marketplace</Button>
            </Link>
        </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#16213e] p-4 md:p-8 font-inter text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 md:mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-montserrat font-bold text-white">
          Welcome back, <span className="text-[#e94560]">{userName}</span>!
        </h1>
        <p className="text-md text-[#a1a1aa] font-opensans mt-2">
          Here&apos;s an overview of your activity on DecentraHub.
        </p>
      </motion.div>

      {/* Optional: Quick Stats Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12"
      >
        <div className="bg-[#1a1a2e] p-6 rounded-xl shadow-lg">
          <h3 className="text-sm font-semibold text-[#a1a1aa] uppercase tracking-wider">NFTs Owned</h3>
          <p className="text-3xl font-bold text-white mt-1">{userStats.nftsOwned}</p>
        </div>
        <div className="bg-[#1a1a2e] p-6 rounded-xl shadow-lg">
          <h3 className="text-sm font-semibold text-[#a1a1aa] uppercase tracking-wider">Following Creators</h3>
          <p className="text-3xl font-bold text-white mt-1">{userStats.creatorsFollowed}</p>
        </div>
        <div className="bg-[#1a1a2e] p-6 rounded-xl shadow-lg">
          <h3 className="text-sm font-semibold text-[#a1a1aa] uppercase tracking-wider">Active Bids</h3>
          <p className="text-3xl font-bold text-white mt-1">{userStats.activeBids}</p>
        </div>
      </motion.div>

      {/* Navigation Cards to Dashboard Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {dashboardSections.map((section, index) => (
          <motion.div
            key={section.href}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
            className={`group rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] bg-gradient-to-br ${section.bgColorClass}`}
          >
            <Link href={section.href} className="block p-6 md:p-8 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <section.Icon className={`w-10 h-10 md:w-12 md:h-12 ${section.textColorClass} opacity-80`} />
                </div>
                <h2 className={`text-xl md:text-2xl font-montserrat font-semibold text-white mb-2`}>
                  {section.title}
                </h2>
                <p className={`text-sm font-opensans ${section.textColorClass} leading-relaxed mb-4`}>
                  {section.description}
                </p>
              </div>
              <div className="mt-auto">
                <Button
                    variant="ghost"
                    size="sm"
                    className={`bg-white/20 hover:bg-white/30 text-white group-hover:bg-white/30 backdrop-blur-sm rounded-md px-4 py-2 flex items-center transition-all duration-300`}
                >
                  {section.ctaText || 'Go to Section'} <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 + dashboardSections.length * 0.1, duration: 0.5 }}
        className="mt-12 text-center"
      >
        <Link href="/marketplace">
          <Button size="lg" variant="outline" className="border-[#e94560] text-[#e94560] hover:bg-[#e94560] hover:text-white transition-colors duration-300">
            Explore Full Marketplace
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
