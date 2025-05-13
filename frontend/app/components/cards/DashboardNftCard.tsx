// /home/scott/Desktop/Office/decentrahub/frontend/app/components/cards/DashboardNftCard.tsx (Suggested path)
'use client';

import Link from 'next/link';
import Image from 'next/image'; // Using Next/Image for optimization
import { motion } from 'framer-motion';
import { Button } from '../ui/button'; // Assuming ShadCN Button
import { MoreHorizontal, Eye, Repeat, Tag, XCircle, Send } from 'lucide-react'; // Example icons
import { NftItem } from '../../dashboard/consumer/MyMarketplace';

// Define specific actions based on tab
type NftCardAction = 'view' | 'sell' | 'transfer' | 'update_listing' | 'cancel_listing' | 'update_bid' | 'cancel_bid' | 'unfavorite';

interface DashboardNftCardProps {
  item: NftItem; // You'll define this type in MyMarketplace.tsx or a shared types file
  activeTab: 'purchases' | 'bids' | 'listings' | 'favorites';
  onAction?: (action: NftCardAction, itemId: string) => void;
}

export const DashboardNftCard = ({ item, activeTab, onAction }: DashboardNftCardProps) => {
  const renderActions = () => {
    switch (activeTab) {
      case 'purchases':
        return (
          <>
            <Button variant="outline" size="sm" onClick={() => onAction?.('view', item.id)} className="flex-1 border-[#0f3460] text-[#a1a1aa] hover:bg-[#0f3460] hover:text-white">
              <Eye className="mr-2 h-4 w-4" /> View
            </Button>
            <Button size="sm" onClick={() => onAction?.('sell', item.id)} className="flex-1 bg-[#e94560] hover:bg-[#d6304a] text-white">
              <Tag className="mr-2 h-4 w-4" /> Sell
            </Button>
          </>
        );
      case 'listings':
        return (
          <>
            <Button variant="outline" size="sm" onClick={() => onAction?.('view', item.id)} className="flex-1 border-[#0f3460] text-[#a1a1aa] hover:bg-[#0f3460] hover:text-white">
              <Eye className="mr-2 h-4 w-4" /> View
            </Button>
            <Button size="sm" onClick={() => onAction?.('update_listing', item.id)} className="flex-1 bg-[#0f3460] hover:bg-opacity-80 text-white">
             <Repeat className="mr-2 h-4 w-4" /> Update
            </Button>
             <Button variant="destructive" size="sm" onClick={() => onAction?.('cancel_listing', item.id)} className="flex-1">
              <XCircle className="mr-2 h-4 w-4" /> Cancel
            </Button>
          </>
        );
      case 'bids':
         return (
          <>
            <Button variant="outline" size="sm" onClick={() => onAction?.('view', item.id)} className="flex-1 border-[#0f3460] text-[#a1a1aa] hover:bg-[#0f3460] hover:text-white">
              <Eye className="mr-2 h-4 w-4" /> View Item
            </Button>
            <Button size="sm" onClick={() => onAction?.('update_bid', item.id)} className="flex-1 bg-[#0f3460] hover:bg-opacity-80 text-white">
              <Repeat className="mr-2 h-4 w-4" /> Update Bid
            </Button>
          </>
        );
      case 'favorites':
        return (
          <>
            <Button variant="outline" size="sm" onClick={() => onAction?.('view', item.id)} className="flex-1 border-[#0f3460] text-[#a1a1aa] hover:bg-[#0f3460] hover:text-white">
             <Eye className="mr-2 h-4 w-4" /> View
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onAction?.('unfavorite', item.id)} className="flex-1">
              <XCircle className="mr-2 h-4 w-4" /> Unfavorite
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#1a1a2e] rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-[#e94560]/20 transition-shadow duration-300 flex flex-col border border-transparent hover:border-[#0f3460]"
    >
      <div className="relative aspect-square overflow-hidden"> {/* Square aspect ratio common for profile NFTs */}
        <Image src={item.imageUrl} alt={item.title} layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
        {item.status && (
            <span className="absolute top-2 left-2 bg-[#e94560] text-white text-xs font-semibold px-2 py-1 rounded">
                {item.status}
            </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-md font-montserrat font-semibold text-white mb-1 truncate" title={item.title}>
          {item.title}
        </h3>
        <p className="text-xs text-[#a1a1aa] mb-2 font-opensans">
          {activeTab === 'listings' || activeTab === 'purchases' ? `Price: ${item.price} ${item.currency}` :
           activeTab === 'bids' ? `Your Bid: ${item.bidAmount || item.price} ${item.currency}` :
           `Creator: ${item.creatorName}`}
        </p>
        {item.lastBid && activeTab !== 'bids' && (
            <p className="text-xs text-purple-400 mb-2">Last Bid: {item.lastBid} {item.currency}</p>
        )}

        <div className="mt-auto pt-3 space-y-2">
            <div className="flex space-x-2">
                {renderActions()}
            </div>
        </div>
      </div>
    </motion.div>
  );
};
