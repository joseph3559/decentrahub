// /home/scott/Desktop/Office/decentrahub/frontend/app/components/cards/MyCreationCard.tsx
'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Edit3, Trash2, Eye, BarChart2, Tag } from 'lucide-react'; // Icons for actions
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

export type NftStatus = 'Listed' | 'Not Listed' | 'Auction' | 'Sold';
export type NftCategory = 'Article' | 'Music' | 'Video' | 'Art';

export interface MyCreation {
  imageUrl: string | StaticImport;
  bidAmount: number | undefined;
  creatorName: any;
  lastBid: boolean;
  id: string;
  title: string;
  thumbnailUrl: string;
  category: NftCategory;
  mintedDate: string; // Or Date object
  status: NftStatus;
  price?: number; // Optional, if listed
  currency?: string; // e.g., 'ETH', 'GHO'
  views?: number;
  sales?: number;
}

interface MyCreationCardProps {
  creation: MyCreation;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void; // This would likely be a soft delete or unlisting
  onViewAnalytics?: (id: string) => void;
}

export const MyCreationCard = ({ creation, onEdit, onDelete, onViewAnalytics }: MyCreationCardProps) => {
  const getStatusColor = (status: NftStatus) => {
    switch (status) {
      case 'Listed':
        return 'bg-green-500 hover:bg-green-600';
      case 'Not Listed':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'Auction':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'Sold':
        return 'bg-slate-500 hover:bg-slate-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#1a1a2e] rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-[#e94560]/20 transition-all duration-300 flex flex-col group border border-transparent hover:border-[#0f3460]"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={creation.thumbnailUrl}
          alt={creation.title}
          layout="fill"
          objectFit="cover"
          className="group-hover:scale-105 transition-transform duration-300"
        />
        <Badge
          className={`absolute top-2 right-2 text-xs text-white px-2 py-1 font-semibold ${getStatusColor(creation.status)}`}
        >
          {creation.status}
        </Badge>
         <Badge
          variant="secondary"
          className="absolute top-2 left-2 text-xs bg-black/50 text-white px-2 py-1"
        >
          {creation.category}
        </Badge>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-montserrat font-semibold text-white mb-1 truncate" title={creation.title}>
          {creation.title}
        </h3>
        <p className="text-xs text-[#a1a1aa] mb-1 font-opensans">
          Minted: {new Date(creation.mintedDate).toLocaleDateString()}
        </p>
        {creation.price !== undefined && creation.status !== 'Sold' && (
          <p className="text-sm font-semibold text-purple-400 mb-3 flex items-center">
            <Tag className="w-4 h-4 mr-1.5" /> Price: {creation.price} {creation.currency}
          </p>
        )}
        {(creation.views !== undefined || creation.sales !== undefined) && (
            <div className="flex items-center text-xs text-slate-400 space-x-3 mb-3">
                {creation.views !== undefined && <span className="flex items-center"><Eye className="w-3 h-3 mr-1"/> {creation.views} Views</span>}
                {creation.sales !== undefined && <span className="flex items-center"><BarChart2 className="w-3 h-3 mr-1"/> {creation.sales} Sales</span>}
            </div>
        )}


        <div className="mt-auto pt-3 flex flex-col sm:flex-row gap-2">
          <Button
            onClick={() => onEdit(creation.id)}
            variant="outline"
            size="sm"
            className="flex-1 border-[#0f3460] text-[#a1a1aa] hover:bg-[#0f3460] hover:text-white"
          >
            <Edit3 className="mr-2 h-4 w-4" /> Edit
          </Button>
          {onViewAnalytics && creation.status !== 'Not Listed' && (
             <Button
                onClick={() => onViewAnalytics(creation.id)}
                variant="outline"
                size="sm"
                className="flex-1 border-sky-500 text-sky-400 hover:bg-sky-500/10 hover:text-sky-300"
            >
                <BarChart2 className="mr-2 h-4 w-4" /> Analytics
            </Button>
          )}
          <Button
            onClick={() => onDelete(creation.id)}
            variant="destructive"
            size="sm"
            className="flex-1" // Or use a less prominent style for "delete"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
