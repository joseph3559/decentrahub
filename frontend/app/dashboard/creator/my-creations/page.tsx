// /home/scott/Desktop/Office/decentrahub/frontend/app/dashboard/creator/my-creations/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
// Adjust path if needed
import { PlusCircle, Search, Palette } from 'lucide-react';
import { toast } from "sonner"; // For notifications
import { MyCreation, MyCreationCard, NftCategory } from '../../../components/cards/MyCreationCard';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { EmptyState } from '../../../components/EmptyState';

// Mock Data - Replace with actual data fetching
const mockCreatorNfts: MyCreation[] = [
  {
    id: 'nft1', title: 'Genesis Bloom', thumbnailUrl: 'https://picsum.photos/seed/genart1/400/300', category: 'Art', mintedDate: '2024-05-01', status: 'Listed', price: 1.5, currency: 'ETH', views: 1200, sales: 5,
    imageUrl: '',
    bidAmount: undefined,
    creatorName: undefined,
    lastBid: false
  },
  {
    id: 'nft2', title: 'Decentralized Rhapsody', thumbnailUrl: 'https://picsum.photos/seed/musicnft1/400/300', category: 'Music', mintedDate: '2024-04-15', status: 'Listed', price: 0.5, currency: 'ETH', views: 500, sales: 12,
    imageUrl: '',
    bidAmount: undefined,
    creatorName: undefined,
    lastBid: false
  },
  {
    id: 'nft3', title: 'The Ethereum Explained', thumbnailUrl: 'https://picsum.photos/seed/articlenft1/400/300', category: 'Article', mintedDate: '2024-03-20', status: 'Not Listed', views: 300,
    imageUrl: '',
    bidAmount: undefined,
    creatorName: undefined,
    lastBid: false
  },
  {
    id: 'nft4', title: 'VR Sculpting Showcase', thumbnailUrl: 'https://picsum.photos/seed/videonft1/400/300', category: 'Video', mintedDate: '2024-02-10', status: 'Sold', views: 2500, sales: 1,
    imageUrl: '',
    bidAmount: undefined,
    creatorName: undefined,
    lastBid: false
  },
  {
    id: 'nft5', title: 'Pixel Warriors #001', thumbnailUrl: 'https://picsum.photos/seed/artnft2/400/300', category: 'Art', mintedDate: '2024-05-05', status: 'Auction', price: 0.8, currency: 'ETH', views: 800,
    imageUrl: '',
    bidAmount: undefined,
    creatorName: undefined,
    lastBid: false
  },
];

const categories: (NftCategory | 'All')[] = ['All', 'Article', 'Music', 'Video', 'Art'];
const sortOptions = [
    { value: 'dateDesc', label: 'Date Minted (Newest)' },
    { value: 'dateAsc', label: 'Date Minted (Oldest)' },
    { value: 'titleAsc', label: 'Title (A-Z)' },
    { value: 'titleDesc', label: 'Title (Z-A)' },
    { value: 'status', label: 'Status' },
];

// Stats for the overview section
interface CreatorPageStats {
    totalNftsMinted: number;
    totalRevenue: number; // Consider currency
    activeListings: number;
    // followersCount: number; // This is on the main dashboard page
}
const mockPageStats: CreatorPageStats = {
    totalNftsMinted: mockCreatorNfts.length,
    totalRevenue: mockCreatorNfts.filter(n => n.status === 'Sold' || n.status === 'Listed').reduce((sum, n) => sum + (n.price || 0), 0), // Simplified
    activeListings: mockCreatorNfts.filter(n => n.status === 'Listed' || n.status === 'Auction').length,
};


export default function MyCreationsPage() {
  const { address, userRole } = useAuth(); // For fetching user-specific creations
  const [creations, setCreations] = useState<MyCreation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<NftCategory | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dateDesc');
  const [pageStats, setPageStats] = useState<CreatorPageStats>(mockPageStats);

  // TODO: Implement actual data fetching for creator's NFTs
  useEffect(() => {
    setIsLoading(true);
    if (address) { // Only fetch if user is authenticated
      console.log("Fetching creations for address:", address);
      // Simulate API call
      setTimeout(() => {
        setCreations(mockCreatorNfts); // Replace with actual API call: fetchMyCreations(address)
        // setPageStats(...); // Update stats based on fetched data
        setIsLoading(false);
      }, 1000);
    } else {
      setIsLoading(false); // Not authenticated, no data to fetch
      setCreations([]);
    }
  }, [address]);

  const handleEdit = (id: string) => {
    toast.info(`Editing creation ID: ${id}. (Feature not implemented)`);
    // TODO: Navigate to an edit page or open a modal
  };

  const handleDelete = (id: string) => {
    // Simulate optimistic update and API call
    toast.warning(`Are you sure you want to delete creation ID: ${id}?`, {
        action: {
            label: "Confirm Delete",
            onClick: () => {
                setCreations(prev => prev.filter(c => c.id !== id));
                toast.success(`Creation ID: ${id} has been deleted. (Mocked)`);
                // TODO: API call to delete/unlist the NFT
            }
        },
        cancel: {
            label: "Cancel",
            onClick: () => toast.dismiss(),
        }
    });
  };

  const handleViewAnalytics = (id: string) => {
    toast.info(`Viewing analytics for creation ID: ${id}. (Feature not implemented)`);
    // TODO: Navigate to a specific analytics page for this NFT
  }

  const filteredAndSortedCreations = useMemo(() => {
    let items = creations;
    if (filterCategory !== 'All') {
      items = items.filter(item => item.category === filterCategory);
    }
    if (searchTerm) {
      items = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Sorting logic
    items = [...items].sort((a, b) => {
        switch (sortBy) {
            case 'dateAsc': return new Date(a.mintedDate).getTime() - new Date(b.mintedDate).getTime();
            case 'titleAsc': return a.title.localeCompare(b.title);
            case 'titleDesc': return b.title.localeCompare(a.title);
            case 'status': return a.status.localeCompare(b.status);
            case 'dateDesc':
            default:
                 return new Date(b.mintedDate).getTime() - new Date(a.mintedDate).getTime();
        }
    });
    return items;
  }, [creations, filterCategory, searchTerm, sortBy]);

  // Basic role check - ideally use middleware for route protection
  if (!isLoading && userRole && userRole !== 'creator') {
    return (
        <div className="min-h-screen bg-[#16213e] p-4 md:p-8 font-inter text-white flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
            <p className="text-[#a1a1aa] mt-2">This section is for creators only.</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#16213e] p-4 md:p-8 font-inter text-white">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-8 gap-4"
      >
        <div>
            <h1 className="text-3xl md:text-4xl font-montserrat font-bold text-white">My Creations</h1>
            <p className="text-md text-[#a1a1aa] font-opensans mt-1">View, manage, and analyze your minted NFTs.</p>
        </div>
        <Link href="/dashboard/creator/mint-content">
          <Button size="lg" className="bg-[#e94560] hover:bg-[#d6304a] text-white font-semibold w-full sm:w-auto">
            <PlusCircle className="mr-2 h-5 w-5" /> Mint New NFT
          </Button>
        </Link>
      </motion.div>

      {/* Stats Overview (Optional) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 md:mb-8"
      >
        <div className="bg-[#1a1a2e] p-4 rounded-xl shadow-md">
          <h3 className="text-xs font-semibold text-[#a1a1aa] uppercase">Total Minted</h3>
          <p className="text-2xl font-bold text-white mt-1">{pageStats.totalNftsMinted}</p>
        </div>
        <div className="bg-[#1a1a2e] p-4 rounded-xl shadow-md">
          <h3 className="text-xs font-semibold text-[#a1a1aa] uppercase">Active Listings</h3>
          <p className="text-2xl font-bold text-white mt-1">{pageStats.activeListings}</p>
        </div>
        <div className="bg-[#1a1a2e] p-4 rounded-xl shadow-md">
          <h3 className="text-xs font-semibold text-[#a1a1aa] uppercase">Total Revenue (Est.)</h3>
          <p className="text-2xl font-bold text-white mt-1">{pageStats.totalRevenue.toFixed(2)} GHO/ETH</p>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mb-6 p-4 bg-[#1a1a2e] rounded-xl shadow-md flex flex-col md:flex-row gap-4 items-center"
      >
        <div className="relative flex-grow w-full md:w-auto">
          <Input
            type="search"
            placeholder="Search your creations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 rounded-lg bg-[#101829] text-white placeholder-[#a1a1aa] focus:ring-2 focus:ring-[#e94560] focus:outline-none border border-transparent focus:border-[#0f3460] w-full"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a1a1aa]" />
        </div>
        <Select value={filterCategory} onValueChange={(value) => setFilterCategory(value as NftCategory | 'All')}>
          <SelectTrigger className="w-full md:w-[180px] bg-[#101829] border-[#0f3460] text-[#a1a1aa] focus:ring-[#e94560]">
            <SelectValue placeholder="Filter by category..." />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a2e] border-[#0f3460] text-[#a1a1aa]">
            {categories.map(cat => (
              <SelectItem key={cat} value={cat} className="hover:bg-[#0f3460] focus:bg-[#0f3460]">{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-[180px] bg-[#101829] border-[#0f3460] text-[#a1a1aa] focus:ring-[#e94560]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a2e] border-[#0f3460] text-[#a1a1aa]">
            {sortOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value} className="hover:bg-[#0f3460] focus:bg-[#0f3460]">{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Grid Display of Creations */}
      {isLoading ? (
        <div className="text-center py-20 text-[#a1a1aa]">Loading your creations...</div>
      ) : filteredAndSortedCreations.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
        >
          {filteredAndSortedCreations.map((creation) => (
            <MyCreationCard
              key={creation.id}
              creation={creation}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewAnalytics={handleViewAnalytics}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <EmptyState
            IconComponent={Palette} // Or a more generic "creation" icon
            title="No Creations Yet"
            message="You haven't minted any NFTs. Start creating your first masterpiece now!"
            actionButton={
              <Link href="/dashboard/creator/mint-content">
                <Button className="bg-[#e94560] hover:bg-[#d6304a] text-white">
                  <PlusCircle className="mr-2 h-5 w-5" /> Mint Your First NFT
                </Button>
              </Link>
            }
          />
        </motion.div>
      )}
    </div>
  );
}
