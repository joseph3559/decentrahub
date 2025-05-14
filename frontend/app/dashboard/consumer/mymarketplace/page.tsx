// /home/scott/Desktop/Office/decentrahub/frontend/app/dashboard/consumer/mymarketplace/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ListFilter, LayoutGrid, List, Gavel, Heart, ShoppingBag, AlertTriangle } from 'lucide-react';
import { toast } from "sonner";
import { UserAsset, UserAssetCard } from '../../../components/cards/UserAssetCard';
import { useAuth } from '../../../context/AuthContext';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import { Label } from '../../../components/ui/label';
import { Card } from '../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Badge } from '../../../components/ui/badge';
import Image from 'next/image';
import { EmptyState } from '../../../components/EmptyState';
import { Button } from '../../../components/ui/button';

// Mock Data - Replace with actual API calls
const mockOwnedAssets: UserAsset[] = [
  { id: 'own1', title: 'Decentralized Dreams #1', imageUrl: 'https://picsum.photos/seed/owned1/300/300', category: 'NFT', creatorName: 'AI Artist', status: 'Owned', price: 1.2, currency: 'ETH', ownedSince: '2024-03-10' },
  { id: 'own2', title: 'Creator Pro Subscription', imageUrl: 'https://picsum.photos/seed/sub1/300/300', category: 'Subscription', creatorName: 'ContentFeed Inc.', status: 'Owned', price: 15, currency: 'GHO', lastActivityDate: '2024-05-01' },
];
const mockBidsOffers: UserAsset[] = [
  { id: 'bid1', title: 'Rare Orb Artifact', imageUrl: 'https://picsum.photos/seed/bid1/300/300', category: 'NFT', creatorName: 'Collector Guild', status: 'Bidding', bidAmount: 0.8, currency: 'ETH', lastActivityDate: '2024-05-12' },
  { id: 'offer1', title: 'Custom Artwork Commission', imageUrl: 'https://picsum.photos/seed/offer1/300/300', category: 'Other', creatorName: 'Artisan Studio', status: 'Offer Made', price: 50, currency: 'GHO', lastActivityDate: '2024-05-10' },
];
const mockFavorites: UserAsset[] = [
  { id: 'fav1', title: 'Future Soundscapes Vol. 3', imageUrl: 'https://picsum.photos/seed/fav1/300/300', category: 'NFT', creatorName: 'Synth Lord', status: 'Favorited', price: 0.5, currency: 'ETH', lastActivityDate: '2024-05-01' },
];

type TabValue = 'collections' | 'bids' | 'favorites';
type ViewMode = 'grid' | 'list';

const filterOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'NFT', label: 'NFTs' },
    { value: 'Subscription', label: 'Subscriptions' },
    // Add more types
];
const sortOptions = [
    { value: 'recent', label: 'Most Recent Activity' },
    { value: 'valueHigh', label: 'Highest Value' },
    { value: 'valueLow', label: 'Lowest Value' },
    { value: 'titleAsc', label: 'Title (A-Z)' },
];

export default function MyMarketplacePage() {
  const { address, userRole } = useAuth();
  const [activeTab, setActiveTab] = useState<TabValue>('collections');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const [assets, setAssets] = useState<UserAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // TODO: Fetch data based on activeTab, user (address), filters, sort
  useEffect(() => {
    setIsLoading(true);
    if (address) {
      console.log(`Fetching for tab: ${activeTab}, user: ${address}, filter: ${filterType}, sort: ${sortBy}`);
      // Simulate API call
      setTimeout(() => {
        if (activeTab === 'collections') setAssets(mockOwnedAssets);
        else if (activeTab === 'bids') setAssets(mockBidsOffers);
        else if (activeTab === 'favorites') setAssets(mockFavorites);
        else setAssets([]);
        setIsLoading(false);
      }, 700);
    } else {
      setIsLoading(false);
      setAssets([]);
    }
  }, [address, activeTab, filterType, sortBy]);

  const filteredAndSortedAssets = useMemo(() => {
    let currentAssets = [...assets];
    if (filterType !== 'all') {
      currentAssets = currentAssets.filter(asset => asset.category === filterType);
    }
    if (searchTerm) {
      currentAssets = currentAssets.filter(asset =>
        asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (asset.creatorName && asset.creatorName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    // Add sorting logic based on sortBy
    return currentAssets;
  }, [assets, filterType, searchTerm, sortBy]);

  const handleAction = (action: string, assetId: string) => {
    toast.info(`Action: ${action} on asset: ${assetId}. (Implement actual logic)`);
  };

  const tabDetails = {
    collections: { Icon: ShoppingBag, title: "No Assets Owned", message: "Your purchased NFTs, subscriptions, and other digital assets will appear here.", emptyActionText: "Explore Marketplace", emptyActionLink: "/marketplace" },
    bids: { Icon: Gavel, title: "No Active Bids or Offers", message: "Your active bids and offers on items will be shown here.", emptyActionText: "Find Items to Bid On", emptyActionLink: "/marketplace" },
    favorites: { Icon: Heart, title: "No Favorites Yet", message: "Like items in the marketplace to add them to your favorites list.", emptyActionText: "Discover New Items", emptyActionLink: "/marketplace" },
  };
  const currentTabInfo = tabDetails[activeTab];


  // Basic role check - this page is for consumers
  if (!isLoading && userRole && userRole !== 'consumer') {
    return (
        <div className="min-h-screen bg-[#16213e] p-4 md:p-8 font-inter text-white flex flex-col items-center justify-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
            <p className="text-[#a1a1aa] mt-2">This dashboard is for consumers only.</p>
        </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#16213e] p-4 md:p-8 font-inter text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 md:mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-montserrat font-bold text-white">My Marketplace</h1>
        <p className="text-md text-[#a1a1aa] font-opensans mt-1">Manage your owned assets, bids, offers, and favorites.</p>
      </motion.div>

      {/* Search and Filters Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-6 p-4 bg-[#1a1a2e] rounded-xl shadow-md flex flex-col md:flex-row gap-4 items-center"
      >
        <div className="relative flex-grow w-full md:w-auto">
          <Input
            type="search"
            placeholder="Search your assets by title, creator..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 rounded-lg bg-[#101829] text-white placeholder-[#a1a1aa] focus:ring-2 focus:ring-[#e94560] focus:outline-none border border-transparent focus:border-[#0f3460] w-full"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a1a1aa]" />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full md:w-[180px] bg-[#101829] border-[#0f3460] text-[#a1a1aa] focus:ring-[#e94560]">
            <ListFilter className="h-4 w-4 mr-2 opacity-70" />
            <SelectValue placeholder="Filter by type..." />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a2e] border-[#0f3460] text-[#a1a1aa]">
            {filterOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value} className="hover:bg-[#0f3460] focus:bg-[#0f3460]">{opt.label}</SelectItem>
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

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)} className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <TabsList className="grid grid-cols-3 gap-2 bg-[#1a1a2e] p-1 rounded-lg w-full sm:w-auto">
            <TabsTrigger value="collections" className="data-[state=active]:bg-[#0f3460] data-[state=active]:text-white data-[state=active]:shadow-md text-[#a1a1aa] hover:text-white flex items-center justify-center gap-2 px-4 py-2">
                <ShoppingBag className="h-4 w-4" /> My Collections
            </TabsTrigger>
            <TabsTrigger value="bids" className="data-[state=active]:bg-[#0f3460] data-[state=active]:text-white data-[state=active]:shadow-md text-[#a1a1aa] hover:text-white flex items-center justify-center gap-2 px-4 py-2">
                <Gavel className="h-4 w-4" /> Bids & Offers
            </TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-[#0f3460] data-[state=active]:text-white data-[state=active]:shadow-md text-[#a1a1aa] hover:text-white flex items-center justify-center gap-2 px-4 py-2">
                <Heart className="h-4 w-4" /> Favorites
            </TabsTrigger>
            </TabsList>
            <RadioGroup value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)} className="flex items-center space-x-1 bg-[#1a1a2e] p-1 rounded-lg">
                <RadioGroupItem value="grid" id="view-grid" className="sr-only" />
                <Label htmlFor="view-grid" className={`p-2 rounded-md cursor-pointer transition-colors ${viewMode === 'grid' ? 'bg-[#0f3460] text-white' : 'text-[#a1a1aa] hover:bg-[#0f3460]/50'}`}>
                    <LayoutGrid className="h-5 w-5" />
                </Label>
                <RadioGroupItem value="list" id="view-list" className="sr-only" />
                <Label htmlFor="view-list" className={`p-2 rounded-md cursor-pointer transition-colors ${viewMode === 'list' ? 'bg-[#0f3460] text-white' : 'text-[#a1a1aa] hover:bg-[#0f3460]/50'}`}>
                    <List className="h-5 w-5" />
                </Label>
            </RadioGroup>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + viewMode} // Re-animate when tab or viewMode changes
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            {isLoading ? (
              <div className="text-center py-20 text-[#a1a1aa]">Loading your assets...</div>
            ) : filteredAndSortedAssets.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {filteredAndSortedAssets.map((asset) => (
                    <UserAssetCard
                      key={asset.id}
                      asset={asset}
                      activeTab={activeTab}
                      onViewDetails={(id) => handleAction('view_details', id)}
                      onTransfer={activeTab === 'collections' ? (id) => handleAction('transfer', id) : undefined}
                      onListForSale={activeTab === 'collections' ? (id) => handleAction('list_for_sale', id) : undefined}
                      onUpdateBid={activeTab === 'bids' ? (id) => handleAction('update_bid', id) : undefined}
                      onCancelBid={activeTab === 'bids' ? (id) => handleAction('cancel_bid', id) : undefined}
                      onUnfavorite={activeTab === 'favorites' ? (id) => handleAction('unfavorite', id) : undefined}
                    />
                  ))}
                </div>
              ) : ( // List View
                <Card className="bg-[#1a1a2e] border-[#0f3460]">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b-[#0f3460] hover:bg-[#101829]">
                        <TableHead className="text-[#a1a1aa]">Asset</TableHead>
                        <TableHead className="text-[#a1a1aa]">Category</TableHead>
                        <TableHead className="text-[#a1a1aa]">Status</TableHead>
                        <TableHead className="text-right text-[#a1a1aa]">Price/Bid</TableHead>
                        <TableHead className="text-center text-[#a1a1aa]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedAssets.map((asset) => (
                        <TableRow key={asset.id} className="border-b-[#0f3460]/50 hover:bg-[#101829]/70">
                          <TableCell className="font-medium text-white flex items-center gap-3">
                            <Image src={asset.imageUrl} alt={asset.title} width={40} height={40} className="rounded-md object-cover"/>
                            <div>
                                {asset.title}
                                {asset.creatorName && <p className="text-xs text-slate-400">by {asset.creatorName}</p>}
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-300">{asset.category}</TableCell>
                          <TableCell>
                            <Badge className={`${(asset.status === 'Owned' || asset.status === 'Listed') ? 'bg-green-500/20 text-green-400 border-green-500/30' : (asset.status === 'Bidding' || asset.status === 'Offer Made') ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-pink-500/20 text-pink-400 border-pink-500/30' } border`}>
                                {asset.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-purple-400 font-semibold">
                            {asset.bidAmount !== undefined ? asset.bidAmount : asset.price} {asset.currency}
                          </TableCell>
                          <TableCell className="text-center">
                             <Button variant="ghost" size="sm" onClick={() => handleAction('view_details_list', asset.id)} className="text-sky-400 hover:text-sky-300">
                                View
                            </Button>
                            {/* Add more actions for list view if needed */}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )
            ) : (
              <EmptyState
                IconComponent={currentTabInfo.Icon}
                title={currentTabInfo.title}
                message={currentTabInfo.message}
                actionButton={
                  <Link href={currentTabInfo.emptyActionLink}>
                    <Button className="bg-[#e94560] hover:bg-[#d6304a] text-white">
                      {currentTabInfo.emptyActionText}
                    </Button>
                  </Link>
                }
              />
            )}
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
