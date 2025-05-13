// /home/scott/Desktop/Office/decentrahub/frontend/app/components/cards/CollectionCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Layers, Eye } from 'lucide-react';
import { Button } from '../ui/button';

export interface Collection {
  id: string;
  name: string;
  creatorName?: string; // Optional: if you want to show who created the collection
  itemCount: number;
  coverImageUrl: string; // URL for the collection's cover image
  // You might add more details like floor price, total volume etc. later
}

interface CollectionCardProps {
  collection: Collection;
}

export const CollectionCard = ({ collection }: CollectionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#1a1a2e] rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-[#0f3460]/30 transition-all duration-300 flex flex-col group border border-transparent hover:border-[#0f3460]"
    >
      <Link href={`/marketplace/collection/${collection.id}`} className="block relative aspect-[16/9] overflow-hidden">
        <Image
          src={collection.coverImageUrl}
          alt={collection.name}
          layout="fill"
          objectFit="cover"
          className="group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
           {/* You could add some overlay text here if needed */}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <Link href={`/marketplace/collection/${collection.id}`}>
          <h3 className="text-lg font-montserrat font-semibold text-white hover:text-[#e94560] transition-colors mb-1 truncate" title={collection.name}>
            {collection.name}
          </h3>
        </Link>
        {collection.creatorName && (
            <p className="text-xs text-[#a1a1aa] mb-1 font-opensans">
                By {collection.creatorName}
            </p>
        )}
        <p className="text-sm text-purple-400 mb-3 font-opensans flex items-center">
          <Layers className="mr-1.5 h-4 w-4" /> {collection.itemCount} Items
        </p>

        <Button
          asChild // Use asChild to make the Button a Link
          size="sm"
          className="w-full mt-auto bg-[#0f3460] hover:bg-opacity-80 text-white"
        >
          <Link href={`/marketplace/collection/${collection.id}`}>
            <Eye className="mr-2 h-4 w-4" /> View Collection
          </Link>
        </Button>
      </div>
    </motion.div>
  );
};
