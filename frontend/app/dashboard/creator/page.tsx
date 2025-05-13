// /home/scott/Desktop/Office/decentrahub/frontend/app/dashboard/creator/page.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';// ShadCN Button
import { ArrowRight, PlusCircle, BarChart3, ListMusic, Settings, Palette, FileText, Video } from 'lucide-react'; // Added more specific icons
import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../context/AuthContext';

// Interface for dashboard section links
interface DashboardSectionLink {
  href: string;
  title: string;
  description: string;
  Icon: React.ElementType; // Lucide icon component
  bgColorClass: string;
  textColorClass: string;
  ctaText?: string;
}

const creatorDashboardSections: DashboardSectionLink[] = [
  {
    href: '/dashboard/creator/mint-content',
    title: 'Mint New Content',
    description: 'Create and mint your articles, music, videos, or art as Smart Media NFTs on Lens Chain.',
    Icon: PlusCircle,
    bgColorClass: 'from-pink-500 to-rose-500',
    textColorClass: 'text-pink-100',
    ctaText: 'Start Minting',
  },
  {
    href: '/dashboard/creator/my-creations', // New page to be created
    title: 'My Creations',
    description: 'View and manage all your minted NFTs. Track their status, update listings, and see engagement.',
    Icon: Palette, // Generic icon, can be more dynamic
    bgColorClass: 'from-teal-500 to-cyan-500',
    textColorClass: 'text-teal-100',
    ctaText: 'View My NFTs',
  },
  {
    href: '/dashboard/creator/earnings', // New page to be created
    title: 'Earnings & Analytics',
    description: 'Track your sales, royalties, and content performance. Get insights from Alchemy.',
    Icon: BarChart3,
    bgColorClass: 'from-amber-500 to-yellow-500',
    textColorClass: 'text-amber-100',
    ctaText: 'View Analytics',
  },
  {
    href: '/profile/me', // Assuming a general profile page, could be /dashboard/creator/settings
    title: 'Creator Settings',
    description: 'Manage your creator profile, payout information, and platform preferences.',
    Icon: Settings,
    bgColorClass: 'from-slate-600 to-gray-700',
    textColorClass: 'text-slate-100',
    ctaText: 'Manage Settings',
  }
];

// Placeholder for creator stats - fetch from backend or context
interface CreatorStats {
  totalNftsMinted: number;
  totalEarnings: number; // Could be in a specific currency e.g., GHO or ETH
  followersCount: number; // From Lens Protocol
}

const mockCreatorStats: CreatorStats = {
  totalNftsMinted: 28,
  totalEarnings: 1250.75, // Example value
  followersCount: 1800,
};

export default function CreatorDashboardPage() {
  const { lensProfile, address, userRole } = useAuth(); // Get user info
  const [creatorStats, setCreatorStats] = useState<CreatorStats>(mockCreatorStats);

  // TODO: Fetch actual creator stats when the component mounts or user data changes
  // useEffect(() => {
  //   if (address) {
  //     // fetchCreatorStats(address).then(setCreatorStats);
  //     // fetchLensFollowerCount(lensProfile?.id).then(count => setCreatorStats(prev => ({...prev, followersCount: count})));
  //   }
  // }, [address, lensProfile]);

  // A simple greeting
  const creatorName = lensProfile?.handle || (address ? `${address.slice(0,6)}...${address.slice(-4)}` : 'Creator');

  // Ensure this page is only accessible to creators (example check)
  // In a real app, this would be handled by route protection / middleware
  if (userRole && userRole !== 'creator') {
     // This is a client-side redirect, better to handle with Next.js middleware or server-side checks
     // For now, just showing a message.
    return (
        <div className="min-h-screen bg-[#16213e] p-4 md:p-8 font-inter text-white flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
            <p className="text-[#a1a1aa] mt-2">This dashboard is for creators only.</p>
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
          Creator Dashboard
        </h1>
        <p className="text-md text-[#a1a1aa] font-opensans mt-2">
          Welcome back, <span className="font-semibold text-[#e94560]">{creatorName}</span>! Manage your content and grow your presence.
        </p>
      </motion.div>

      {/* Quick Stats Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12"
      >
        <div className="bg-[#1a1a2e] p-6 rounded-xl shadow-lg">
          <h3 className="text-sm font-semibold text-[#a1a1aa] uppercase tracking-wider">NFTs Minted</h3>
          <p className="text-3xl font-bold text-white mt-1">{creatorStats.totalNftsMinted}</p>
        </div>
        <div className="bg-[#1a1a2e] p-6 rounded-xl shadow-lg">
          <h3 className="text-sm font-semibold text-[#a1a1aa] uppercase tracking-wider">Total Earnings (GHO/ETH)</h3>
          <p className="text-3xl font-bold text-white mt-1">{creatorStats.totalEarnings.toFixed(2)}</p>
        </div>
        <div className="bg-[#1a1a2e] p-6 rounded-xl shadow-lg">
          <h3 className="text-sm font-semibold text-[#a1a1aa] uppercase tracking-wider">Lens Followers</h3>
          <p className="text-3xl font-bold text-white mt-1">{creatorStats.followersCount}</p>
        </div>
      </motion.div>

      {/* Navigation Cards to Dashboard Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {creatorDashboardSections.map((section, index) => (
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
                    variant="ghost" // Using ghost to better blend with card, or use a specific style
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
    </div>
  );
}
