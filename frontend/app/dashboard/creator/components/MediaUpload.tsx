// /home/scott/Desktop/Office/decentrahub/frontend/app/dashboard/creator/components/MediaUpload.tsx
'use client';

import { useState } from 'react';
import { UploadCloud } from 'lucide-react';// For file input styling if needed
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

interface MediaUploadProps {
  onFileUploaded: (fileUrl: string, fileType: string) => void; // Callback with IPFS URL and file type
  contentType: 'Article' | 'Music' | 'Video' | 'Art';
}

export const MediaUpload = ({ onFileUploaded, contentType }: MediaUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  // TODO: Implement actual IPFS upload logic
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFileName(file.name);
    console.log(`Uploading ${file.name} for content type: ${contentType}...`);

    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate success
    const mockIpfsUrl = `ipfs://QmExampleHash123/${file.name}`; // Replace with actual IPFS hash
    onFileUploaded(mockIpfsUrl, file.type);
    console.log(`Mock upload complete: ${mockIpfsUrl}`);
    setUploading(false);
  };

  const getAcceptedFileTypes = () => {
    switch (contentType) {
      case 'Article':
        return '.md,.txt,.pdf'; // Example
      case 'Music':
        return 'audio/*,.mp3,.wav,.ogg';
      case 'Video':
        return 'video/*,.mp4,.mov,.webm';
      case 'Art':
        return 'image/*,.jpg,.jpeg,.png,.gif,.svg,.glb,.gltf'; // Added 3D model types
      default:
        return '*/*';
    }
  };

  return (
    <div className="border-2 border-dashed border-[#0f3460] rounded-lg p-6 text-center bg-[#1a1a2e]/50 hover:border-[#e94560] transition-colors">
      <UploadCloud className="w-12 h-12 mx-auto text-[#a1a1aa] mb-4" />
      <label htmlFor="file-upload" className="cursor-pointer">
        <Button asChild variant="outline" className="border-[#e94560] text-[#e94560] hover:bg-[#e94560]/10">
          <span>{uploading ? 'Uploading...' : 'Choose File'}</span>
        </Button>
        <Input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleFileUpload}
          disabled={uploading}
          accept={getAcceptedFileTypes()}
        />
      </label>
      {fileName && !uploading && <p className="text-sm text-[#a1a1aa] mt-2">Selected: {fileName}</p>}
      {uploading && <p className="text-sm text-[#e94560] mt-2 animate-pulse">Uploading: {fileName}...</p>}
      <p className="text-xs text-slate-500 mt-2">
        Upload your {contentType.toLowerCase()} file. Max size: 50MB.
      </p>
    </div>
  );
};
