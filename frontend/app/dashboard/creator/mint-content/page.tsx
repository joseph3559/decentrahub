// /home/scott/Desktop/Office/decentrahub/frontend/app/dashboard/creator/mint-content/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'; // Adjusted path
import { toast } from "sonner"; // Using sonner for notifications
import { ContentForm, type ContentFormValues } from '../components/ContentForm'; // Adjusted path
import { useBonsaiMint, type MintData } from '../hooks/useBonsaiMint'; // Adjusted path
import { useAuth } from '../../../context/AuthContext'; // Adjusted path
import { motion } from 'framer-motion';
import { FileText, Music, Video, Palette, Loader2, CheckCircle, ExternalLink, Copy, PlusSquare } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../../../components/ui/dialog"; // For success dialog
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input"; // For displaying Tx hash to copy
import Link from 'next/link';
import { Label } from '../../../components/ui/label';

type ContentType = 'Article' | 'Music' | 'Video' | 'Art';

export default function MintContentPage() {
  const [activeTab, setActiveTab] = useState<ContentType>('Article');
  const { mintWithBonsai, isMinting, mintError, mintSuccessData } = useBonsaiMint();
  const { address: creatorAddress } = useAuth();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [currentMintedItemTitle, setCurrentMintedItemTitle] = useState("");

  // Effect to show success dialog when mintSuccessData changes
  useEffect(() => {
    if (mintSuccessData) {
      setShowSuccessDialog(true);
      // Assuming mintSuccessData contains the title or you can get it from the form values
      // For simplicity, let's assume the title is part of mintSuccessData or we store it temporarily
    }
  }, [mintSuccessData]);

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

    setCurrentMintedItemTitle(values.title); // Store title for success dialog

    const mintData: MintData = {
      ...values,
      mediaIpfsUrl: values.mediaIpfsUrl,
      mediaType: values.mediaType,
      creatorAddress: creatorAddress,
    };

    toast.info("Minting Initiated", {
      description: `Minting your ${values.category}: "${values.title}"...`,
      id: "mint-toast", // Give it an ID to potentially dismiss it later
    });

    const result = await mintWithBonsai(mintData);
    toast.dismiss("mint-toast"); // Dismiss the "Initiated" toast

    if (result.success) {
      // Success dialog will be shown by the useEffect hook watching mintSuccessData
      // We can still show a brief toast if desired, but the dialog is primary
      toast.success("Minting Operation Complete!", {
        description: `Details for "${values.title}" available.`,
      });
      // TODO: Optionally reset the form here if ContentForm instance is available
      // Or pass a callback to ContentForm to trigger reset
    } else {
      toast.error("Minting Failed", {
        description: result.error || "An unknown error occurred.",
      });
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success("Copied to clipboard!"))
      .catch(err => toast.error("Failed to copy."));
  };

  const resetMintStatusAndForm = () => {
    setShowSuccessDialog(false);
    setCurrentMintedItemTitle("");
    // TODO: Implement form reset logic.
    // This might involve calling a reset function on the ContentForm component instance
    // or managing form state here and passing it down.
    // For now, we'll just close the dialog.
    // A simple way if not using react-hook-form's reset:
    // window.location.reload(); // Crude, but effective for a quick reset in a hackathon
    setActiveTab(activeTab); // Re-trigger potential re-render of form with default values if key changes
    toast.info("Ready to mint another creation!");
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
            {/* Add a key to ContentForm to force re-render with defaults when tab changes, if form state is not reset otherwise */}
            {activeTab === tab.value && (
              <ContentForm
                key={activeTab} // Force re-mount of form when tab changes to reset its internal state
                contentType={tab.value as ContentType}
                onSubmit={handleFormSubmit}
                isSubmitting={isMinting}
              />
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Global loading indicator for minting process */}
      {isMinting && !showSuccessDialog && ( // Don't show if success dialog is about to appear
        <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
          <Loader2 className="h-16 w-16 text-[#e94560] animate-spin mb-4" />
          <p className="text-white text-xl font-semibold">Processing Your Mint...</p>
          <p className="text-[#a1a1aa]">Please confirm the transaction in your wallet.</p>
        </div>
      )}

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={(open) => { if (!open) setShowSuccessDialog(false); }}>
        <DialogContent className="sm:max-w-lg bg-[#1a1a2e] border-[#0f3460] text-white shadow-2xl rounded-xl">
          <DialogHeader className="pt-4">
            <DialogTitle className="text-3xl font-montserrat text-center text-green-400 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 mr-3 text-green-400" />
              Minting Successful!
            </DialogTitle>
            <DialogDescription className="text-center text-[#a1a1aa] pt-2 font-opensans text-base">
              Your content <strong className="text-purple-400">"{currentMintedItemTitle}"</strong> has been successfully minted as an NFT.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-4 text-sm">
            {mintSuccessData?.nftMetadataUrl && (
                <div className="flex flex-col space-y-1">
                    <Label className="text-slate-400">Metadata URL (IPFS):</Label>
                    <div className="flex items-center gap-2">
                        <Input readOnly value={mintSuccessData.nftMetadataUrl} className="bg-[#101829] border-[#0c2a4c] text-slate-300 text-xs truncate"/>
                        <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(mintSuccessData.nftMetadataUrl)} className="text-slate-400 hover:text-white">
                            <Copy className="w-4 h-4" />
                        </Button>
                        <a href={mintSuccessData.nftMetadataUrl.replace("ipfs://", "https://ipfs.io/ipfs/")} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="icon" className="border-[#0f3460] text-slate-400 hover:text-white hover:border-purple-400">
                                <ExternalLink className="w-4 h-4" />
                            </Button>
                        </a>
                    </div>
                </div>
            )}
            {mintSuccessData?.bonsaiTransaction?.transactionHash && (
                <div className="flex flex-col space-y-1">
                    <Label className="text-slate-400">Transaction Hash:</Label>
                     <div className="flex items-center gap-2">
                        <Input readOnly value={mintSuccessData.bonsaiTransaction.transactionHash} className="bg-[#101829] border-[#0c2a4c] text-slate-300 text-xs truncate"/>
                        <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(mintSuccessData.bonsaiTransaction.transactionHash)} className="text-slate-400 hover:text-white">
                            <Copy className="w-4 h-4" />
                        </Button>
                        {/* TODO: Add link to Lens Chain explorer */}
                        {/* <a href={`https://lenster.xyz/tx/${mintSuccessData.bonsaiTransaction.transactionHash}`} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="icon"><ExternalLink className="w-4 h-4" /></Button>
                        </a> */}
                    </div>
                </div>
            )}
             {mintSuccessData?.bonsaiTransaction?.nftId && (
                <div className="flex flex-col space-y-1">
                    <Label className="text-slate-400">NFT ID (Bonsai):</Label>
                    <Input readOnly value={mintSuccessData.bonsaiTransaction.nftId} className="bg-[#101829] border-[#0c2a4c] text-slate-300 text-xs"/>
                </div>
            )}
             {mintSuccessData?.lensPublicationId && (
                <div className="flex flex-col space-y-1">
                    <Label className="text-slate-400">Lens Publication ID:</Label>
                    <Input readOnly value={mintSuccessData.lensPublicationId} className="bg-[#101829] border-[#0c2a4c] text-slate-300 text-xs"/>
                </div>
            )}
          </div>

          <DialogFooter className="sm:justify-center gap-2 pt-4">
            <Button
              type="button"
              onClick={resetMintStatusAndForm}
              variant="outline"
              className="border-[#0f3460] text-[#a1a1aa] hover:bg-[#0f3460]/80 hover:text-white"
            >
              <PlusSquare className="mr-2 h-4 w-4" /> Mint Another
            </Button>
            <Link href="/dashboard/creator/my-creations" passHref>
              <Button type="button" className="bg-[#e94560] hover:bg-[#d6304a] text-white">
                View My Creations
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
