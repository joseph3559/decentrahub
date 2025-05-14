// /home/scott/Desktop/Office/decentrahub/frontend/app/components/cards/UserAssetCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, Send, Tag, HeartCrack, Edit, MoreVertical, XCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export type AssetStatus = 'Owned' | 'Listed' | 'Bidding' | 'Favorited' | 'Offer Made' | 'Offer Received';
export type AssetCategory = 'NFT' | 'Subscription' | 'Royalty Stream' | 'Other'; // More generic

export interface UserAsset {
  id: string;
  title: string;
  imageUrl: string;
  category: AssetCategory;
  creatorName?: string;
  creatorHandle?: string;
  price?: number; // Current listing price or last bid
  currency?: string;
  status: AssetStatus;
  lastActivityDate?: string; // For sorting
  // Specific fields for different tabs
  bidAmount?: number; // For bids tab
  ownedSince?: string; // For collections tab
}

interface UserAssetCardProps {
  asset: UserAsset;
  activeTab: 'collections' | 'bids' | 'favorites'; // To tailor actions
  onViewDetails: (assetId: string) => void;
  onTransfer?: (assetId: string) => void; // Only for owned assets
  onListForSale?: (assetId: string) => void; // Only for owned assets
  onUpdateBid?: (assetId: string) => void; // For bids
  onCancelBid?: (assetId: string) => void; // For bids
  onUnfavorite?: (assetId: string) => void; // For favorites
}

export const UserAssetCard = ({
  asset,
  activeTab,
  onViewDetails,
  onTransfer,
  onListForSale,
  onUpdateBid,
  onCancelBid,
  onUnfavorite,
}: UserAssetCardProps) => {

  const getStatusColor = (status: AssetStatus) => {
    if (status === 'Owned' || status === 'Listed') return 'bg-green-500/80';
    if (status === 'Bidding' || status === 'Offer Made') return 'bg-blue-500/80';
    if (status === 'Favorited') return 'bg-pink-500/80';
    return 'bg-slate-500/80';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#1a1a2e] rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-[#e94560]/20 transition-all duration-300 flex flex-col group border border-transparent hover:border-[#0f3460]"
    >
      <div className="relative aspect-square overflow-hidden"> {/* Square aspect ratio */}
        <Image
          src={asset.imageUrl}
          alt={asset.title}
          layout="fill"
          objectFit="cover"
          className="group-hover:scale-105 transition-transform duration-300"
        />
        <Badge
          className={`absolute top-2 left-2 text-xs text-white px-2 py-1 font-semibold ${getStatusColor(asset.status)}`}
        >
          {asset.status}
        </Badge>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
            <h3 className="text-md font-montserrat font-semibold text-white truncate group-hover:text-[#e94560] transition-colors" title={asset.title}>
                <Link href={`/marketplace/asset/${asset.id}`}>{asset.title}</Link> {/* Generic asset detail page */}
            </h3>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-white hover:bg-[#0f3460]">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#1a1a2e] border-[#0f3460] text-slate-300">
                    <DropdownMenuItem onClick={() => onViewDetails(asset.id)} className="hover:!bg-[#0f3460] hover:!text-white">
                        <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    {activeTab === 'collections' && onTransfer && (
                        <DropdownMenuItem onClick={() => onTransfer(asset.id)} className="hover:!bg-[#0f3460] hover:!text-white">
                            <Send className="mr-2 h-4 w-4" /> Transfer
                        </DropdownMenuItem>
                    )}
                    {activeTab === 'collections' && onListForSale && (
                        <DropdownMenuItem onClick={() => onListForSale(asset.id)} className="hover:!bg-[#0f3460] hover:!text-white">
                            <Tag className="mr-2 h-4 w-4" /> List for Sale
                        </DropdownMenuItem>
                    )}
                    {activeTab === 'bids' && onUpdateBid && (
                        <DropdownMenuItem onClick={() => onUpdateBid(asset.id)} className="hover:!bg-[#0f3460] hover:!text-white">
                            <Edit className="mr-2 h-4 w-4" /> Update Bid
                        </DropdownMenuItem>
                    )}
                     {activeTab === 'bids' && onCancelBid && (
                        <DropdownMenuItem onClick={() => onCancelBid(asset.id)} className="text-red-400 hover:!bg-red-500/20 hover:!text-red-300">
                            <XCircle className="mr-2 h-4 w-4" /> Cancel Bid
                        </DropdownMenuItem>
                    )}
                    {activeTab === 'favorites' && onUnfavorite && (
                        <DropdownMenuItem onClick={() => onUnfavorite(asset.id)} className="text-red-400 hover:!bg-red-500/20 hover:!text-red-300">
                            <HeartCrack className="mr-2 h-4 w-4" /> Unfavorite
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>

        {asset.creatorName && (
          <p className="text-xs text-[#a1a1aa] mb-1 font-opensans">
            By: {asset.creatorHandle ? <Link href={`/profile/${asset.creatorHandle}`} className="hover:text-[#e94560]">{asset.creatorName}</Link> : asset.creatorName}
          </p>
        )}
        <p className="text-xs text-slate-500 mb-2 font-opensans">Category: {asset.category}</p>


        <div className="mt-auto pt-2">
            {asset.price !== undefined && (
                <p className="text-lg font-semibold text-purple-400 mb-1">
                    {activeTab === 'bids' ? 'Your Bid: ' : 'Price: '}
                    {asset.bidAmount !== undefined ? asset.bidAmount : asset.price} {asset.currency}
                </p>
            )}
            {asset.ownedSince && activeTab === 'collections' && (
                 <p className="text-xs text-slate-400">Owned Since: {new Date(asset.ownedSince).toLocaleDateString()}</p>
            )}
            {asset.lastActivityDate && (activeTab === 'bids' || activeTab === 'favorites') && (
                 <p className="text-xs text-slate-400">Last Activity: {new Date(asset.lastActivityDate).toLocaleDateString()}</p>
            )}
        </div>
      </div>
    </motion.div>
  );
};
