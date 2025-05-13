// /home/scott/Desktop/Office/decentrahub/frontend/app/dashboard/creator/components/PreviewDisplay.tsx
'use client';

import { PackageOpen } from 'lucide-react';

interface PreviewDisplayProps {
  mediaUrl?: string; // IPFS URL or local blob URL for preview
  mediaType?: string; // e.g., 'image/png', 'video/mp4', 'audio/mp3', 'text/markdown'
  title?: string;
  description?: string;
  // Add other props from the form to display in the preview
}

export const PreviewDisplay = ({
  mediaUrl,
  mediaType,
  title,
  description,
}: PreviewDisplayProps) => {
  // TODO: Implement actual media rendering based on mediaType
  // For images, use <img> or Next/Image. For video/audio, use <video>/<audio> tags.
  // For articles (markdown), use a markdown renderer.

  const renderMediaPreview = () => {
    if (!mediaUrl) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-[#a1a1aa]">
          <PackageOpen className="w-16 h-16 mb-4" />
          <p>Upload media to see preview</p>
        </div>
      );
    }

    if (mediaType?.startsWith('image/')) {
      return <img src={mediaUrl} alt={title || 'Media preview'} className="max-w-full max-h-64 object-contain rounded-md" />;
    }
    if (mediaType?.startsWith('video/')) {
      return <video src={mediaUrl} controls className="max-w-full max-h-64 rounded-md" />;
    }
    if (mediaType?.startsWith('audio/')) {
      return <audio src={mediaUrl} controls className="w-full" />;
    }
    // Add more handlers for other types like PDF, Markdown, etc.
    return <p className="text-[#a1a1aa]">Preview not available for this file type yet.</p>;
  };

  return (
    <div className="p-6 bg-[#1a1a2e]/50 rounded-lg border border-[#0f3460] min-h-[200px] flex flex-col">
      <h3 className="text-xl font-semibold text-white mb-4">Live Preview</h3>
      <div className="flex-grow flex items-center justify-center bg-[#101829] rounded-md p-4">
        {renderMediaPreview()}
      </div>
      {title && <h4 className="text-lg text-white mt-4 font-medium">{title}</h4>}
      {description && <p className="text-sm text-[#a1a1aa] mt-1">{description}</p>}
      {/* Display other form fields in preview as needed */}
    </div>
  );
};
