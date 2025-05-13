// /home/scott/Desktop/Office/decentrahub/frontend/app/components/cards/ContentCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PlayCircle, FileText, Download, Share2, Eye } from 'lucide-react'; // More specific icons
import { Button } from '../ui/button';

export type ContentCategory = 'Articles' | 'Music' | 'Videos' | 'Art' | 'Other';

export interface PurchasedContentItem {
  id: string;
  title: string;
  creatorName: string;
  creatorHandle?: string; // Optional, for linking to creator profile
  category: ContentCategory;
  thumbnailUrl: string;
  datePurchased: string; // Or Date object
  // Add specific fields like 'duration' for music/video, 'wordCount' for articles if needed
  // For simplicity, we'll keep it generic for now
  viewLink?: string; // Direct link to view/play the content
  isDownloadable?: boolean;
  isSharable?: boolean;
}

interface ContentCardProps {
  item: PurchasedContentItem;
  onView: (item: PurchasedContentItem) => void; // Callback for view/play action
  onDownload?: (item: PurchasedContentItem) => void; // Optional callback
  onShare?: (item: PurchasedContentItem) => void; // Optional callback
}

export const ContentCard = ({ item, onView, onDownload, onShare }: ContentCardProps) => {
  const getCategoryIcon = () => {
    switch (item.category) {
      case 'Articles':
        return <FileText className="mr-2 h-4 w-4" />;
      case 'Music':
        return <PlayCircle className="mr-2 h-4 w-4" />;
      case 'Videos':
        return <PlayCircle className="mr-2 h-4 w-4" />;
      case 'Art':
        return <Eye className="mr-2 h-4 w-4" />; // Or a specific art icon
      default:
        return <Eye className="mr-2 h-4 w-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#1a1a2e] rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-[#e94560]/20 transition-all duration-300 flex flex-col group border border-transparent hover:border-[#0f3460]"
    >
      <div className="relative aspect-video overflow-hidden"> {/* 16:9 for video/general content */}
        <Image
          src={item.thumbnailUrl}
          alt={item.title}
          layout="fill"
          objectFit="cover"
          className="group-hover:scale-105 transition-transform duration-300"
        />
         <span className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md font-semibold">
            {item.category}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-md font-montserrat font-semibold text-white mb-1 truncate" title={item.title}>
          {item.title}
        </h3>
        <p className="text-xs text-[#a1a1aa] mb-1 font-opensans">
          By: {item.creatorHandle ? <Link href={`/profile/${item.creatorHandle}`} className="hover:text-[#e94560]">{item.creatorName}</Link> : item.creatorName}
        </p>
        <p className="text-xs text-slate-500 mb-3 font-opensans">
          Purchased: {new Date(item.datePurchased).toLocaleDateString()}
        </p>

        <div className="mt-auto pt-3 space-y-2">
          <Button
            onClick={() => onView(item)}
            size="sm"
            className="w-full bg-[#e94560] hover:bg-[#d6304a] text-white flex items-center justify-center"
          >
            {getCategoryIcon()}
            {item.category === 'Music' || item.category === 'Videos' ? 'Play' : 'View Content'}
          </Button>
          <div className="flex space-x-2">
            {item.isDownloadable && onDownload && (
              <Button
                onClick={() => onDownload(item)}
                variant="outline"
                size="sm"
                className="flex-1 border-[#0f3460] text-[#a1a1aa] hover:bg-[#0f3460] hover:text-white"
              >
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            )}
            {item.isSharable && onShare && (
              <Button
                onClick={() => onShare(item)}
                variant="outline"
                size="sm"
                className="flex-1 border-[#0f3460] text-[#a1a1aa] hover:bg-[#0f3460] hover:text-white"
              >
                <Share2 className="mr-2 h-4 w-4" /> Share
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
