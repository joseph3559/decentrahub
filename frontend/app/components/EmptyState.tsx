// /home/scott/Desktop/Office/decentrahub/frontend/app/components/ui/EmptyState.tsx (Suggested path)
'use client';

import { type LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  IconComponent: LucideIcon;
  title: string;
  message: string;
  actionButton?: React.ReactNode;
}

export const EmptyState = ({ IconComponent, title, message, actionButton }: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center text-center py-12 md:py-20 px-6 bg-[#1a1a2e] rounded-lg shadow-md" // Using your primary dark color
    >
      <IconComponent className="w-16 h-16 md:w-24 md:h-24 text-[#e94560] mb-6" strokeWidth={1.5} /> {/* Accent Red for icon */}
      <h3 className="text-xl md:text-2xl font-montserrat font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm md:text-base text-[#a1a1aa] max-w-md font-opensans">{message}</p>
      {actionButton && <div className="mt-6">{actionButton}</div>}
    </motion.div>
  );
};
