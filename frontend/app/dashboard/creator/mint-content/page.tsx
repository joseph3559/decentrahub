// /home/scott/Desktop/Office/decentrahub/frontend/app/dashboard/creator/MintContent.tsx
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { toast } from "sonner"; // Using sonner for notifications
// To get creator address
import { motion } from 'framer-motion'; // Corrected import for framer-motion
import { FileText, Music, Video, Palette, Loader2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { MintData, useBonsaiMint } from '../hooks/useBonsaiMint';
import { ContentForm, ContentFormValues } from '../components/ContentForm';


type ContentType = 'Article' | 'Music' | 'Video' | 'Art';

export default function MintContentPage() {
  const [activeTab, setActiveTab] = useState<ContentType>('Article');
  // const { toast } = useToast(); // Previous toast hook, now using sonner directly
  const { mintWithBonsai, isMinting, mintError, mintSuccessData } = useBonsaiMint();
  const { address: creatorAddress } = useAuth(); // Get connected user's address

  const handleFormSubmit = async (values: ContentFormValues) => {
    if (!creatorAddress) {
      toast.error("Wallet Not Connected", {
        description: "Please connect your wallet to mint content.",
      });
      return;
    }
    if (!values.mediaIpfsUrl || !values.mediaType) {
        toast.error("Media Missing", {
            description: "Please ensure your media file is uploaded successfully.",
        });
        return;
    }

    const mintData: MintData = {
      ...values,
      mediaIpfsUrl: values.mediaIpfsUrl, // Already validated
      mediaType: values.mediaType, // Already validated
      creatorAddress: creatorAddress,
      // TODO: Map any smartMediaConfig from form values if implemented
    };

    toast.info("Minting Initiated", {
      description: `Minting your ${values.category}: "${values.title}"...`,
    });

    const result = await mintWithBonsai(mintData);

    if (result.success) {
      toast.success("Minting Successful!", {
        description: `Your ${values.category} "${values.title}" has been minted. Tx: ${result.transactionHash?.slice(0,10)}...`,
        // Sonner uses richColors prop on <Toaster /> for default success/error/info styling
      });
      // TODO: Optionally redirect user or clear form
      // form.reset(); // If form instance is passed down or managed here
    } else {
      toast.error("Minting Failed", {
        description: result.error || "An unknown error occurred.",
      });
    }
  };

  const tabDetails = [
    { value: 'Article', label: 'Article', Icon: FileText },
    { value: 'Music', label: 'Music', Icon: Music },
    { value: 'Video', label: 'Video', Icon: Video },
    { value: 'Art', label: 'Art', Icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-[#16213e] p-4 md:p-8 font-inter text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-montserrat font-bold text-white">
          Mint Your Digital Creation
        </h1>
        <p className="text-md text-[#a1a1aa] font-opensans mt-2">
          Bring your unique content to the decentralized world. Choose your content type and fill in the details.
        </p>
      </motion.div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as ContentType)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 bg-[#1a1a2e] p-2 rounded-lg mb-8">
          {tabDetails.map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-[#0f3460] data-[state=active]:text-white data-[state=active]:shadow-md text-[#a1a1aa] hover:text-white flex items-center justify-center gap-2 py-2.5 text-sm sm:text-base"
            >
              <tab.Icon className="h-5 w-5" /> {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabDetails.map(tab => (
          <TabsContent key={tab.value} value={tab.value}>
            {activeTab === tab.value && ( // Render form only for active tab for better performance & state handling
              <ContentForm
                contentType={tab.value as ContentType}
                onSubmit={handleFormSubmit}
                isSubmitting={isMinting}
              />
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Global loading indicator for minting process */}
      {isMinting && (
        <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-50">
          <Loader2 className="h-16 w-16 text-[#e94560] animate-spin mb-4" />
          <p className="text-white text-xl font-semibold">Processing Your Mint...</p>
          <p className="text-[#a1a1aa]">Please confirm the transaction in your wallet.</p>
        </div>
      )}
    </div>
  );
}
