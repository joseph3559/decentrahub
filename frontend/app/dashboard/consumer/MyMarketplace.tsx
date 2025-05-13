// /home/scott/Desktop/Office/decentrahub/frontend/app/dashboard/consumer/MyMarketplace.tsx
'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"; // ShadCN Tabs
import { Button } from "../../components/ui/button"; // ShadCN Button
import { PlusCircle, ShoppingBag, Tag, Layers, Heart, ListFilter, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { EmptyState } from '../../components/EmptyState';
import { DashboardNftCard } from '../../components/cards/DashboardNftCard';


export interface NftItem {
  id: string;
  title: string;
  imageUrl: string;
  creatorName?: string; // May not be relevant for all tabs
  price?: number;
  currency?: string;
  status?: 'Purchased' | 'Listed' | 'Bidding' | 'Favorited' | string; // Example statuses
  bidAmount?: number; // For 'My Bids' tab
  lastBid?: number; // For display on listed items
  // Add other properties as needed for different tabs
  collectionName?: string;
  tokenId?: string;
}

// Mock Data - Replace with actual user-specific data fetching
const mockPurchases: NftItem[] = [
  { id: 'p1', title: 'Cosmic Dream', imageUrl: 'https://picsum.photos/seed/A1/300/300', price: 0.5, currency: 'ETH', status: 'Purchased', collectionName: 'Art Collective' },
  { id: 'p2', title: 'Oceanic Beats', imageUrl: 'https://picsum.photos/seed/A2/300/300', price: 0.1, currency: 'ETH', status: 'Purchased', collectionName: 'Music Drops' },
];
const mockListings: NftItem[] = [
  { id: 'l1', title: 'My Masterpiece', imageUrl: 'https://picsum.photos/seed/B1/300/300', price: 1.2, currency: 'ETH', status: 'Listed', lastBid: 0.8 },
];
const mockBids: NftItem[] = [
    {id: 'b1', title: 'Rare Artifact', imageUrl: 'https://picsum.photos/seed/C1/300/300', bidAmount: 0.7, currency: 'ETH', status: 'Bidding (Outbid)', collectionName: 'Ancient Relics'},
    {id: 'b2', title: 'Future Sound', imageUrl: 'https://picsum.photos/seed/C2/300/300', bidAmount: 0.3, currency: 'ETH', status: 'Bidding (Highest)', collectionName: 'Synthscapes'},
];
const mockFavorites: NftItem[] = [
    {id: 'f1', title: 'Serene Landscape', imageUrl: 'https://picsum.photos/seed/D1/300/300', creatorName: 'Nature Artist', status: 'Favorited'},
];


type TabValue = 'purchases' | 'listings' | 'bids' | 'favorites';

export default function MyMarketplacePage() {
  const [activeTab, setActiveTab] = useState<TabValue>('purchases');
  const [items, setItems] = useState<NftItem[]>([]);
  const [isLoading, setIsLoading] = useState(true); // For data fetching simulation

  // TODO: Replace with actual data fetching logic based on activeTab and authenticated user
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      switch (activeTab) {
        case 'purchases':
          setItems(mockPurchases);
          break;
        case 'listings':
          setItems(mockListings);
          break;
        case 'bids':
          setItems(mockBids);
          break;
        case 'favorites':
          setItems(mockFavorites);
          break;
        default:
          setItems([]);
      }
      setIsLoading(false);
    }, 500);
  }, [activeTab]);

  const handleCardAction = (action: string, itemId: string) => {
    console.log(`Action: ${action} on item: ${itemId} in tab: ${activeTab}`);
    // TODO: Implement actual logic for actions (e.g., open modal, API call)
    alert(`Action: ${action} on item: ${itemId}`);
  };

  const tabContent = {
    purchases: { data: items, Icon: ShoppingBag, title: "No Purchases Yet", message: "Explore the marketplace to find NFTs you love and make them yours." },
    listings: { data: items, Icon: Tag, title: "No Listings Yet", message: "Ready to sell your creations? List your NFTs here to reach potential buyers." },
    bids: { data: items, Icon: Layers, title: "No Bids Placed", message: "Participate in auctions by placing bids on NFTs you're interested in." },
    favorites: { data: items, Icon: Heart, title: "No Favorites Yet", message: "Like NFTs in the marketplace to save them here for later." },
  };

  const currentTabData = tabContent[activeTab];

  return (
    <div className="min-h-screen bg-[#16213e] p-4 md:p-8 font-inter text-white"> {/* Background Color */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-montserrat font-bold text-white">My NFT Activity</h1>
        <Link href="/dashboard/creator/mint-content"> {/* Adjust if minting path is different */}
          <Button className="mt-4 sm:mt-0 bg-[#e94560] hover:bg-[#d6304a] text-white">
            <PlusCircle className="mr-2 h-5 w-5" /> Mint New NFT
          </Button>
        </Link>
      </motion.div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 bg-[#1a1a2e] p-2 rounded-lg">
          <TabsTrigger value="purchases" className="data-[state=active]:bg-[#0f3460] data-[state=active]:text-white data-[state=active]:shadow-md text-[#a1a1aa] hover:text-white flex items-center justify-center gap-2">
            <ShoppingBag className="h-4 w-4" /> My Purchases
          </TabsTrigger>
          <TabsTrigger value="listings" className="data-[state=active]:bg-[#0f3460] data-[state=active]:text-white data-[state=active]:shadow-md text-[#a1a1aa] hover:text-white flex items-center justify-center gap-2">
            <Tag className="h-4 w-4" /> My Listings
          </TabsTrigger>
          <TabsTrigger value="bids" className="data-[state=active]:bg-[#0f3460] data-[state=active]:text-white data-[state=active]:shadow-md text-[#a1a1aa] hover:text-white flex items-center justify-center gap-2">
            <Layers className="h-4 w-4" /> My Bids
          </TabsTrigger>
          <TabsTrigger value="favorites" className="data-[state=active]:bg-[#0f3460] data-[state=active]:text-white data-[state=active]:shadow-md text-[#a1a1aa] hover:text-white flex items-center justify-center gap-2">
            <Heart className="h-4 w-4" /> My Favorites
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            {/* Optional: Search and Filter bar specific to this dashboard view */}
            {/* <div className="mb-6 flex items-center gap-4">
              <div className="relative flex-grow">
                <Input placeholder={`Search in ${activeTab}...`} className="pl-10 bg-[#1a1a2e] border-[#0f3460] placeholder:text-[#a1a1aa]" />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a1a1aa]" />
              </div>
              <Button variant="outline" className="border-[#0f3460] text-[#a1a1aa] hover:bg-[#0f3460] hover:text-white">
                <ListFilter className="mr-2 h-4 w-4" /> Filters
              </Button>
            </div> */}

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                {/* Add a nice loading spinner here */}
                <p className="text-[#a1a1aa]">Loading NFTs...</p>
              </div>
            ) : currentTabData.data.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {currentTabData.data.map((item) => (
                  <DashboardNftCard
                    key={item.id}
                    item={item}
                    activeTab={activeTab}
                    onAction={handleCardAction}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                IconComponent={currentTabData.Icon}
                title={currentTabData.title}
                message={currentTabData.message}
                actionButton={
                  activeTab === 'purchases' || activeTab === 'favorites' ? (
                    <Link href="/marketplace">
                      <Button className="bg-[#e94560] hover:bg-[#d6304a] text-white">Explore Marketplace</Button>
                    </Link>
                  ) : activeTab === 'listings' ? (
                     <Link href="/dashboard/creator/mint-content"> {/* Adjust path */}
                       <Button className="bg-[#e94560] hover:bg-[#d6304a] text-white">Mint an NFT</Button>
                     </Link>
                  ) : null
                }
              />
            )}
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
