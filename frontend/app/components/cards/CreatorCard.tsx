// /home/scott/Desktop/Office/decentrahub/frontend/app/components/cards/CreatorCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { UserPlus, UserCheck, Eye } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';

export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  isFollowing: boolean;
  latestContentPreview?: {
    imageUrl: string;
    title: string;
  };
  bio?: string; // Optional short bio
}

interface CreatorCardProps {
  creator: Creator;
  onFollowToggle: (creatorId: string, isFollowing: boolean) => void;
}

export const CreatorCard = ({ creator, onFollowToggle }: CreatorCardProps) => {
  const [isFollowingOptimistic, setIsFollowingOptimistic] = useState(creator.isFollowing);

  const handleFollowClick = () => {
    const newFollowState = !isFollowingOptimistic;
    setIsFollowingOptimistic(newFollowState);
    onFollowToggle(creator.id, newFollowState);
    // TODO: API call to update follow status on the backend
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#1a1a2e] rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-[#e94560]/20 transition-all duration-300 flex flex-col items-center text-center p-6 border border-transparent hover:border-[#0f3460]"
    >
      <Link href={`/profile/${creator.handle}`} className="block mb-4">
        <Image
          src={creator.avatarUrl}
          alt={creator.name}
          width={96}
          height={96}
          className="rounded-full object-cover border-2 border-[#0f3460] group-hover:border-[#e94560] transition-colors"
        />
      </Link>
      <Link href={`/profile/${creator.handle}`}>
        <h3 className="text-lg font-montserrat font-semibold text-white hover:text-[#e94560] transition-colors">
          {creator.name}
        </h3>
      </Link>
      <p className="text-sm text-[#a1a1aa] mb-3 font-opensans">@{creator.handle}</p>
      {creator.bio && <p className="text-xs text-slate-400 mb-4 leading-relaxed line-clamp-2">{creator.bio}</p>}


      {creator.latestContentPreview && (
        <Link href={`/marketplace/nft/${creator.latestContentPreview.title.replace(/\s+/g, '-').toLowerCase()}`} className="w-full my-3 group">
            <div className="aspect-video bg-slate-700 rounded-md overflow-hidden relative">
                <Image
                    src={creator.latestContentPreview.imageUrl}
                    alt={creator.latestContentPreview.title}
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Eye className="w-8 h-8 text-white" />
                </div>
            </div>
            <p className="text-xs text-slate-300 mt-1 truncate group-hover:text-[#e94560]">{creator.latestContentPreview.title}</p>
        </Link>
      )}

      <Button
        onClick={handleFollowClick}
        variant={isFollowingOptimistic ? 'outline' : 'default'}
        size="sm"
        className={`w-full mt-auto ${
          isFollowingOptimistic
            ? 'border-[#e94560] text-[#e94560] hover:bg-[#e94560]/10 hover:text-[#e94560]'
            : 'bg-[#e94560] hover:bg-[#d6304a] text-white'
        }`}
      >
        {isFollowingOptimistic ? <UserCheck className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
        {isFollowingOptimistic ? 'Following' : 'Follow'}
      </Button>
    </motion.div>
  );
};
