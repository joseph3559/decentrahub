'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { ArrowRight, PlusCircle, BarChart3, Settings, Palette } from 'lucide-react';
import { useState, useEffect } from 'react';
interface DashboardSectionLink {
  href: string;
  title: string;
  description: string;
  Icon: React.ElementType;
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
    href: '/dashboard/creator/my-creations',
    title: 'My Creations',
    description: 'View and manage all your minted NFTs. Track their status, update listings, and see engagement.',
    Icon: Palette,
    bgColorClass: 'from-teal-500 to-cyan-500',
    textColorClass: 'text-teal-100',
    ctaText: 'View My NFTs',
  },
  {
    href: '/dashboard/creator/earnings',
    title: 'Earnings & Analytics',
    description: 'Track your sales, royalties, and content performance. Get insights from Alchemy.',
    Icon: BarChart3,
    bgColorClass: 'from-amber-500 to-yellow-500',
    textColorClass: 'text-amber-100',
    ctaText: 'View Analytics',
  },
  {
    href: '/profile/me',
    title: 'Creator Settings',
    description: 'Manage your creator profile, payout information, and platform preferences.',
    Icon: Settings,
    bgColorClass: 'from-slate-600 to-gray-700',
    textColorClass: 'text-slate-100',
    ctaText: 'Manage Settings',
  }
];

interface CreatorStats {
  totalNftsMinted: number;
  totalEarnings: number;
  followersCount: number;
}

const mockCreatorStats: CreatorStats = {
  totalNftsMinted: 28,
  totalEarnings: 1250.75,
  followersCount: 1800,
};

export default function CreatorDashboardPage() {
  const { currentUser, lensProfileData, address, userRole } = useAuth();
  const [creatorStats, setCreatorStats] = useState<CreatorStats>(mockCreatorStats);

  useEffect(() => {
    if (address && currentUser) {
      const followers = lensProfileData?.stats?.totalFollowers || 0;
      setCreatorStats(prevStats => ({
        ...prevStats,
        followersCount: followers,
      }));
    }
  }, [address, currentUser, lensProfileData]);

  const creatorName = currentUser?.lensHandle || currentUser?.fullName || (address ? `${address.slice(0,6)}...${address.slice(-4)}` : 'Creator');

  if (userRole && userRole !== 'creator') {
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {creatorDashboardSections.map((section, index) => (
          <motion.div
            key={section.href}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
            className={`group rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] bg-gradient-to-br ${section.bgColorClass}`}
          >
            <Link href={section.href} className="p-6 md:p-8 h-full flex flex-col justify-between">
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
    </div>
  );
}
