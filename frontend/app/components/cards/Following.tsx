// /home/scott/Desktop/Office/decentrahub/frontend/app/dashboard/consumer/Following.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, User, Users, ListChecks, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Creator, CreatorCard } from './CreatorCard';
import { Collection, CollectionCard } from './CollectionCard';
import { EmptyState } from '../EmptyState';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';

const mockFollowedCreators: Creator[] = [
  { id: 'c1', name: 'PixelPioneer', handle: 'pixpioneer', avatarUrl: 'https://picsum.photos/seed/creator1/100/100', isFollowing: true, bio: 'Exploring the frontiers of digital art and decentralized creativity.', latestContentPreview: { imageUrl: 'https://picsum.photos/seed/art1/400/300', title: 'Neon Dreams #1' } },
  { id: 'c2', name: 'SynthScribe', handle: 'synthwave', avatarUrl: 'https://picsum.photos/seed/creator2/100/100', isFollowing: true, bio: 'Crafting immersive soundscapes for the metaverse. Music NFTs and more.', latestContentPreview: { imageUrl: 'https://picsum.photos/seed/music1/400/300', title: 'Retro Future Anthem' } },
  { id: 'c3', name: 'StoryWeaver', handle: 'wordwizard', avatarUrl: 'https://picsum.photos/seed/creator3/100/100', isFollowing: true, bio: 'Novelist and short story writer exploring new forms of narrative through NFTs.' },
];

const mockFollowedCollections: Collection[] = [
  { id: 'col1', name: 'Abstract Dimensions', itemCount: 150, coverImageUrl: 'https://picsum.photos/seed/collection1/400/225', creatorName: 'ArtHouse Collective' },
  { id: 'col2', name: 'Lo-Fi Beats for Study', itemCount: 75, coverImageUrl: 'https://picsum.photos/seed/collection2/400/225', creatorName: 'ChillHop Records' },
  { id: 'col3', name: 'Metaverse Wearables', itemCount: 300, coverImageUrl: 'https://picsum.photos/seed/collection3/400/225', creatorName: 'Digital Threads Inc.' },
];

type TabValue = 'creators' | 'collections';

export default function FollowingPage() {
  const [activeTab, setActiveTab] = useState<TabValue>('creators');
  const [searchTerm, setSearchTerm] = useState('');
  const [creators, setCreators] = useState<Creator[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // TODO: Replace with actual data fetching logic based on authenticated user
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCreators(mockFollowedCreators);
      setCollections(mockFollowedCollections);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleFollowToggle = (creatorId: string, newFollowState: boolean) => {
    console.log(`Toggled follow for creator ${creatorId} to ${newFollowState}`);
    // Update local state optimistically
    setCreators(prev => prev.map(c => c.id === creatorId ? {...c, isFollowing: newFollowState} : c));
    // TODO: API call to backend to persist follow state
  };

  const filteredCreators = useMemo(() => {
    if (!searchTerm) return creators;
    return creators.filter(
      (creator) =>
        creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creator.handle.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [creators, searchTerm]);

  const filteredCollections = useMemo(() => {
    if (!searchTerm) return collections;
    return collections.filter((collection) =>
      collection.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [collections, searchTerm]);

  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center py-10 text-[#a1a1aa]">Loading followed items...</div>;
    }

    if (activeTab === 'creators') {
      return filteredCreators.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredCreators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} onFollowToggle={handleFollowToggle} />
          ))}
        </div>
      ) : (
        <EmptyState
          IconComponent={User}
          title="No Creators Followed"
          message="You’re not following any creators yet. Discover amazing talents in the marketplace!"
        />
      );
    }

    if (activeTab === 'collections') {
      return filteredCollections.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      ) : (
        <EmptyState
          IconComponent={ListChecks}
          title="No Collections Followed"
          message="Follow collections to keep track of your favorite NFT series and drops."
        />
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#16213e] p-4 md:p-8 font-inter text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 md:mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-montserrat font-bold text-white mb-2">Following</h1>
        <p className="text-md text-[#a1a1aa] font-opensans">Keep track of your favorite creators and collections.</p>
      </motion.div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)} className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <TabsList className="grid grid-cols-2 gap-2 bg-[#1a1a2e] p-1 rounded-lg w-full sm:w-auto">
            <TabsTrigger value="creators" className="data-[state=active]:bg-[#0f3460] data-[state=active]:text-white data-[state=active]:shadow-md text-[#a1a1aa] hover:text-white flex items-center justify-center gap-2 px-4 py-2">
              <Users className="h-4 w-4" /> Creators
            </TabsTrigger>
            <TabsTrigger value="collections" className="data-[state=active]:bg-[#0f3460] data-[state=active]:text-white data-[state=active]:shadow-md text-[#a1a1aa] hover:text-white flex items-center justify-center gap-2 px-4 py-2">
              <Layers className="h-4 w-4" /> Collections
            </TabsTrigger>
          </TabsList>
          <div className="relative w-full sm:w-auto sm:max-w-xs">
            <Input
              type="search"
              placeholder={`Search in ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-lg bg-[#1a1a2e] text-white placeholder-[#a1a1aa] focus:ring-2 focus:ring-[#e94560] focus:outline-none border border-transparent focus:border-[#0f3460]"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a1a1aa]" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
