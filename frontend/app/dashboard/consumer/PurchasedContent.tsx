// /home/scott/Desktop/Office/decentrahub/frontend/app/dashboard/consumer/PurchasedContent.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, ListFilter, ShoppingCart, FileText, Music, Video, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ContentCard, ContentCategory, PurchasedContentItem } from '../../components/cards/ContentCard';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { EmptyState } from '../../components/EmptyState';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';



// Mock Data - Replace with actual user-specific data fetching
const mockPurchasedItems: PurchasedContentItem[] = [
  { id: 'pc1', title: 'The Art of Decentralization - Full Guide', creatorName: 'Dr. Blockchain', creatorHandle: 'drblockchain', category: 'Articles', thumbnailUrl: 'https://picsum.photos/seed/article1/400/225', datePurchased: '2024-03-15', viewLink: '/articles/art-of-decentralization', isDownloadable: true },
  { id: 'pc2', title: 'Ambient Waves Vol. 1', creatorName: 'DJ Ether', creatorHandle: 'djether', category: 'Music', thumbnailUrl: 'https://picsum.photos/seed/musictrack1/400/225', datePurchased: '2024-04-01', viewLink: '/music/ambient-waves-1', isSharable: true },
  { id: 'pc3', title: 'NFT Animation Masterclass', creatorName: 'Animator Pro', creatorHandle: 'animpro', category: 'Videos', thumbnailUrl: 'https://picsum.photos/seed/video1/400/225', datePurchased: '2024-04-20' },
  { id: 'pc4', title: 'Cyber Cityscape Print', creatorName: 'Visionary GFX', creatorHandle: 'visiongfx', category: 'Art', thumbnailUrl: 'https://picsum.photos/seed/artprint1/400/225', datePurchased: '2024-02-10', isDownloadable: true, isSharable: true },
  { id: 'pc5', title: 'Understanding Smart Contracts', creatorName: 'CodeWizard', creatorHandle: 'codewiz', category: 'Articles', thumbnailUrl: 'https://picsum.photos/seed/article2/400/225', datePurchased: '2024-05-01' },
];

const categories: (ContentCategory | 'All')[] = ['All', 'Articles', 'Music', 'Videos', 'Art'];
const sortOptions = [
    { value: 'dateDesc', label: 'Date Purchased (Newest)' },
    { value: 'dateAsc', label: 'Date Purchased (Oldest)' },
    { value: 'titleAsc', label: 'Title (A-Z)' },
    { value: 'titleDesc', label: 'Title (Z-A)' },
];

export default function PurchasedContentPage() {
  const [activeCategory, setActiveCategory] = useState<ContentCategory | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dateDesc');
  const [purchasedItems, setPurchasedItems] = useState<PurchasedContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // TODO: Replace with actual data fetching logic
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setPurchasedItems(mockPurchasedItems);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleViewContent = (item: PurchasedContentItem) => {
    console.log('Viewing item:', item.title);
    if (item.viewLink) {
      // router.push(item.viewLink); // If using Next.js router
      alert(`Navigating to view: ${item.title}`);
    } else {
      alert(`No direct view link for ${item.title}. Implement modal or specific player.`);
    }
  };

  const filteredAndSortedItems = useMemo(() => {
    let items = purchasedItems;
    if (activeCategory !== 'All') {
      items = items.filter(item => item.category === activeCategory);
    }
    if (searchTerm) {
      items = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.creatorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Sorting
    items = [...items].sort((a, b) => {
        switch (sortBy) {
            case 'dateAsc': return new Date(a.datePurchased).getTime() - new Date(b.datePurchased).getTime();
            case 'titleAsc': return a.title.localeCompare(b.title);
            case 'titleDesc': return b.title.localeCompare(a.title);
            case 'dateDesc':
            default:
                 return new Date(b.datePurchased).getTime() - new Date(a.datePurchased).getTime();
        }
    });
    return items;
  }, [purchasedItems, activeCategory, searchTerm, sortBy]);

  const categoryIcons = {
    'All': ListFilter,
    'Articles': FileText,
    'Music': Music,
    'Videos': Video,
    'Art': ImageIcon,
  };

  return (
    <div className="min-h-screen bg-[#16213e] p-4 md:p-8 font-inter text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 md:mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-montserrat font-bold text-white mb-2">My Purchased Content</h1>
        <p className="text-md text-[#a1a1aa] font-opensans">Access and manage all the digital assets you own.</p>
      </motion.div>

      <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as ContentCategory | 'All')} className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <TabsList className="grid grid-cols-3 sm:grid-cols-5 gap-1 bg-[#1a1a2e] p-1 rounded-lg w-full md:w-auto">
                {categories.map(cat => {
                    const Icon = categoryIcons[cat as keyof typeof categoryIcons] || ListFilter;
                    return (
                        <TabsTrigger key={cat} value={cat} className="data-[state=active]:bg-[#0f3460] data-[state=active]:text-white data-[state=active]:shadow-md text-[#a1a1aa] hover:text-white flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 text-xs sm:text-sm">
                            <Icon className="h-4 w-4" /> {cat}
                        </TabsTrigger>
                    );
                })}
            </TabsList>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-auto sm:flex-grow md:max-w-xs">
                    <Input
                    type="search"
                    placeholder="Search owned content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2.5 rounded-lg bg-[#1a1a2e] text-white placeholder-[#a1a1aa] focus:ring-2 focus:ring-[#e94560] focus:outline-none border border-transparent focus:border-[#0f3460] w-full"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a1a1aa]" />
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-[180px] bg-[#1a1a2e] border-[#0f3460] text-[#a1a1aa] focus:ring-[#e94560]">
                        <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a2e] border-[#0f3460] text-[#a1a1aa]">
                        {sortOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value} className="hover:bg-[#0f3460] focus:bg-[#0f3460]">
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>


        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory + sortBy + searchTerm} // Ensure re-render on filter change
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            {isLoading ? (
              <div className="text-center py-10 text-[#a1a1aa]">Loading your content...</div>
            ) : filteredAndSortedItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredAndSortedItems.map((item) => (
                  <ContentCard key={item.id} item={item} onView={handleViewContent} />
                ))}
              </div>
            ) : (
              <EmptyState
                IconComponent={ShoppingCart}
                title="No Content Purchased Yet"
                message="Your purchased digital assets will appear here. Explore the marketplace to find something new!"
                actionButton={
                    <Link href="/marketplace">
                      <Button className="bg-[#e94560] hover:bg-[#d6304a] text-white">Discover Content</Button>
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
