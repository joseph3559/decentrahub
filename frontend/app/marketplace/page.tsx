// /home/scott/Desktop/Office/decentrahub/frontend/app/marketplace/page.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
// Icons (replace with Hero Icons or Lucide as preferred)
import {
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiGrid,
  FiHeart,
  FiShoppingCart, // Or a collect icon
  FiArrowLeft,
  FiArrowRight,
} from 'react-icons/fi';
import { FaEthereum } from 'react-icons/fa';
import Image from 'next/image';

// Mock Data (Replace with API data fetched via React Query/SWR)
interface NftItem {
  id: string;
  title: string;
  creatorName: string;
  creatorHandle: string;
  price: number;
  currency: string;
  imageUrl: string;
  category: 'Articles' | 'Music' | 'Videos' | 'Art';
  likes: number;
  isLiked?: boolean; // For local like state
  status: 'For Sale' | 'Auction' | 'Collected';
}

const mockNfts: NftItem[] = Array.from({ length: 16 }).map((_, i) => ({
  id: `nft-${i + 1}`,
  title: `Decentralized Art #${i + 1}`,
  creatorName: `Creator ${String.fromCharCode(65 + (i % 5))}`, // A, B, C, D, E
  creatorHandle: `@creator${String.fromCharCode(97 + (i % 5))}`,
  price: parseFloat((Math.random() * 2 + 0.1).toFixed(2)),
  currency: 'ETH',
  imageUrl: `https://picsum.photos/seed/${i + 100}/400/300`, // Placeholder images
  category: (['Articles', 'Music', 'Videos', 'Art'] as NftItem['category'][])[i % 4],
  likes: Math.floor(Math.random() * 1000),
  status: (['For Sale', 'Auction', 'Collected'] as NftItem['status'][])[i % 3],
}));


// --- Marketplace Specific Hero Section ---
const MarketplaceHeroSection = () => (
  <section className="py-16 md:py-20 bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-[#ffffff]">
    <div className="container mx-auto px-6 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl md:text-5xl font-montserrat font-bold mb-4" // Font: Montserrat
      >
        Discover, Collect, and Monetize
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-lg md:text-xl text-[#a1a1aa] mb-8 font-opensans max-w-2xl mx-auto" // Font: Open Sans
      >
        Empowering creators with decentralized ownership. Explore unique digital assets minted on the Lens Protocol.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        <button
          className="px-8 py-3 bg-[#e94560] hover:bg-[#d6304a] text-white font-montserrat font-semibold rounded-lg shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-105"
        >
          Explore Now
        </button>
      </motion.div>
    </div>
  </section>
);

// --- Category Navigation ---
const categories = ['All', 'Articles', 'Music', 'Videos', 'Art'];
const CategoryNavigation = ({
  selectedCategory,
  setSelectedCategory,
}: {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}) => (
  <nav className="py-4 bg-[#1a1a2e] sticky top-0 z-40 shadow-md"> {/* Assuming global navbar height allows this */}
    <div className="container mx-auto px-6">
      <div className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#e94560] scrollbar-track-transparent">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 text-sm sm:text-base font-montserrat font-medium rounded-md transition-colors duration-200 whitespace-nowrap
              ${selectedCategory === category
                ? 'bg-[#e94560] text-white shadow-lg'
                : 'text-[#a1a1aa] hover:bg-[#0f3460] hover:text-white'
              }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  </nav>
);

// --- Filter Bar ---
const FilterBar = ({
  setSortBy,
  setSearchTerm,
}: {
  setSortBy: (sort: string) => void;
  setSearchTerm: (term: string) => void;
  // Add props for price range, status filters
}) => {
  const [internalSearch, setInternalSearch] = useState('');

  // TODO: Implement debouncing for search
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(internalSearch);
    }, 500); // 500ms debounce
    return () => clearTimeout(handler);
  }, [internalSearch, setSearchTerm]);

  return (
    <div className="py-6 px-6 bg-[#16213e] text-[#a1a1aa]">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-1/3">
          <input
            type="search"
            placeholder="Search NFTs, creators, tags..."
            value={internalSearch}
            onChange={(e) => setInternalSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#1a1a2e] text-white placeholder-[#a1a1aa] focus:ring-2 focus:ring-[#e94560] focus:outline-none border border-transparent focus:border-[#e94560]"
          />
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a1a1aa]" />
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          {/* Sort By Dropdown */}
          <div className="relative">
            <select
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-[#1a1a2e] text-white px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#e94560] focus:outline-none cursor-pointer pr-8"
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="priceHighToLow">Price: High to Low</option>
              <option value="priceLowToHigh">Price: Low to High</option>
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a1a1aa] pointer-events-none" />
          </div>
          {/* TODO: Price Range Slider (complex UI, placeholder for now) */}
          <button className="bg-[#1a1a2e] text-white px-4 py-2.5 rounded-lg hover:bg-[#0f3460] flex items-center gap-2">
            Price Range <FiChevronDown className="w-4 h-4" />
          </button>
          {/* TODO: Status Dropdown */}
          <button className="bg-[#1a1a2e] text-white px-4 py-2.5 rounded-lg hover:bg-[#0f3460] flex items-center gap-2">
            Status <FiFilter className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- NFT Card ---
const NftCard = ({ item }: { item: NftItem }) => {
  const [isLiked, setIsLiked] = useState(item.isLiked || false);
  const [likes, setLikes] = useState(item.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes -1 : likes + 1);
    // TODO: API call to update like status
  };
  return (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-[#1a1a2e] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#e94560]/30 transition-all duration-300 transform hover:-translate-y-1 group flex flex-col"
  >
    <div className="relative aspect-[4/3] overflow-hidden"> {/* Aspect ratio for image */}
      <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />      <div className="absolute top-2 right-2 bg-black/30 p-1.5 rounded-full">
         <button onClick={handleLike} className={`transition-colors duration-200 ${isLiked ? 'text-[#e94560]' : 'text-white/70 hover:text-white'}`}>
            <FiHeart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>

    <div className="p-4 flex flex-col flex-grow">
      <h3 className="text-lg font-montserrat font-semibold text-white mb-1 truncate" title={item.title}>{item.title}</h3>
      <p className="text-xs text-[#a1a1aa] mb-3 truncate font-opensans">
        By <Link href={`/profile/${item.creatorHandle}`} className="text-purple-400 hover:underline">{item.creatorName}</Link>
      </p>

      <div className="mt-auto"> {/* Pushes price and buttons to bottom */}
        <div className="flex justify-between items-center mb-3">
          <p className="text-xl font-montserrat font-bold text-white flex items-center">
            <FaEthereum className="mr-1.5 text-purple-400" /> {item.price} <span className="text-sm text-[#a1a1aa] ml-1">{item.currency}</span>
          </p>
          <span className="text-xs text-[#a1a1aa] flex items-center">
            <FiHeart className="w-3 h-3 mr-1" /> {likes}
          </span>
        </div>
        <div className="flex space-x-2">
          <Link href={`/marketplace/nft/${item.id}`} className="flex-1 text-center bg-[#0f3460] hover:bg-opacity-80 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors duration-200">
            View Details
          </Link>
          <button className="bg-[#e94560] hover:bg-[#d6304a] text-white p-2 rounded-md transition-colors duration-200">
            <FiShoppingCart className="w-4 h-4" /> {/* Or collect icon */}
          </button>
        </div>
      </div>
    </div>
  </motion.div>
)};

// --- Content Grid ---
const ContentGrid = ({ nfts }: { nfts: NftItem[] }) => (
  <div className="container mx-auto px-6 py-8 md:py-12">
    {nfts.length === 0 ? (
        <div className="text-center py-20">
            <FiGrid className="w-16 h-16 text-[#a1a1aa] mx-auto mb-4" />
            <p className="text-xl text-[#a1a1aa] font-montserrat">No NFTs found matching your criteria.</p>
            <p className="text-sm text-[#a1a1aa] font-opensans mt-2">Try adjusting your filters or search term.</p>
        </div>
    ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {nfts.map((nft) => (
            <NftCard key={nft.id} item={nft} />
            ))}
        </div>
    )}
  </div>
);

// --- Pagination Controls ---
const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  // TODO: Implement more robust pagination (e.g., showing limited page numbers)
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="py-8 flex justify-center items-center space-x-2 text-[#a1a1aa]">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 rounded-md hover:bg-[#0f3460] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiArrowLeft className="w-5 h-5" />
      </button>
      {pageNumbers.slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2)).map((number) => ( // Show limited numbers
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
            ${currentPage === number ? 'bg-[#e94560] text-white' : 'hover:bg-[#0f3460] text-[#a1a1aa]'}`}
        >
          {number}
        </button>
      ))}
      {totalPages > 5 && currentPage < totalPages - 2 && <span className="px-2">...</span>}
      {totalPages > 5 && currentPage < totalPages - 2 && (
         <button onClick={() => onPageChange(totalPages)} className="px-4 py-2 rounded-md text-sm font-medium hover:bg-[#0f3460] text-[#a1a1aa]">
            {totalPages}
        </button>
      )}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md hover:bg-[#0f3460] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FiArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};


// --- Main Marketplace Page Component ---
export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  const [searchTerm, setSearchTerm] = useState('');
  // TODO: Add states for priceRange, statusFilter
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Or 12 for 4-column

  // Memoized filtering and sorting logic (client-side for mock data)
  const filteredAndSortedNfts = useMemo(() => {
    let items = mockNfts;

    // Category filter
    if (selectedCategory !== 'All') {
      items = items.filter(nft => nft.category === selectedCategory);
    }

    // Search filter (title, creatorName - basic)
    if (searchTerm) {
      items = items.filter(nft =>
        nft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.creatorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting
    switch (sortBy) {
      case 'priceLowToHigh':
        items = items.sort((a, b) => a.price - b.price);
        break;
      case 'priceHighToLow':
        items = items.sort((a, b) => b.price - a.price);
        break;
      case 'latest':
      default:
        break;
    }
    return items;
  }, [selectedCategory, sortBy, searchTerm]);

  const totalPages = Math.ceil(filteredAndSortedNfts.length / itemsPerPage);
  const currentDisplayNfts = filteredAndSortedNfts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on page change
  };

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortBy, searchTerm]);

  return (
    <div className="bg-[#16213e] min-h-screen font-inter text-[#ffffff]">
      {/* Global Navbar would be here via layout.tsx */}
      <MarketplaceHeroSection />
      <CategoryNavigation
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <FilterBar
        setSortBy={setSortBy}
        setSearchTerm={setSearchTerm}
        // Pass other filter setters
      />
      <ContentGrid nfts={currentDisplayNfts} />
      {totalPages > 1 && (
        <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
        />
      )}
      {/* Global Footer would be here via layout.tsx */}
    </div>
  );
}
