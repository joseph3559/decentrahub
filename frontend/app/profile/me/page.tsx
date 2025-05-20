// /home/scott/Desktop/Office/decentrahub/frontend/app/profile/me/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext'; // Import AuthenticatedUser type
import { Button } from '../../components/ui/button'; // Assuming path is correct relative to app dir
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Card, CardContent } from '../../components/ui/card';
import { Settings, User, CreditCard, Bell, Shield, Edit, XCircle, Loader2 } from 'lucide-react';
import { toast } from "sonner";

// Import section-specific form components
import { ProfileInformationForm, type ProfileFormValues } from './components/ProfileInformationForm';
import { PayoutSettingsForm } from './components/PayoutSettingsForm';
import { PlatformPreferencesForm } from './components/PlatformPreferencesForm';
import { SecurityPrivacySettings } from './components/SecurityPrivacySettings';

// Corrected import path for updateUserProfile: It should come from user.service.ts
import { updateUserProfile } from '../../services/user.service';


export default function CreatorSettingsPage() {
  // currentUser from AuthContext is the source of truth for displayed data
  const { currentUser, address, isLoadingAuth: isLoadingAuthContext, lensProfileData } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);

  // profileData will be initialized from currentUser and used by the form
  const [profileData, setProfileData] = useState<Partial<ProfileFormValues>>({});
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);


  useEffect(() => {
    if (!isLoadingAuthContext && currentUser) {
      console.log("Current user from AuthContext:", currentUser);
      setProfileData({
        fullName: currentUser.fullName || "",
        username: currentUser.lensHandle || currentUser.address, // Prefer Lens handle if available
        bio: currentUser.bio || "",
        email: currentUser.email || "", // Email from our DB
        website: currentUser.website || "",
        twitter: currentUser.twitterHandle ? `https://twitter.com/${currentUser.twitterHandle}` : "", // Construct full URL if only handle is stored
        avatarUrl: currentUser.avatarUrl || "",
      });
      setIsPageLoading(false);
    } else if (!isLoadingAuthContext && !currentUser && address) {
      // User is connected but no currentUser data yet (e.g., still in role selection or error)
      // Or, if this page is accessed before full auth flow completes
      toast.error("User profile data not available. Please complete authentication.", { id: "profile-data-error"});
      setIsPageLoading(false);
      // Potentially redirect or show a specific message
    } else if (!isLoadingAuthContext && !address) {
      // Not authenticated, no address
      setIsPageLoading(false);
      // This page should ideally be protected by a route guard
    }
  }, [currentUser, isLoadingAuthContext, address]);


  const handleProfileSave = async (data: ProfileFormValues): Promise<boolean> => {
    // Explicitly check if currentUser exists before trying to access its properties
    if (!currentUser) {
        toast.error("User not authenticated. Cannot save profile.");
        return false;
    }
    // If currentUser exists, it should be of type AuthenticatedUser.
    // The error "Property 'userId' does not exist on type 'AuthenticatedUser'"
    // indicates that the AuthenticatedUser type this file sees is missing userId.
    // This needs to be resolved in AuthContext.tsx or its imported types.
    if (!currentUser.userId) {
        toast.error("User session data is incomplete (missing userId). Cannot save profile.");
        return false;
    }

    setIsSavingProfile(true);
    try {
      // Prepare payload for backend (it expects twitterHandle, not full URL)
      const twitterHandle = data.twitter?.startsWith("https://twitter.com/")
        ? data.twitter.substring("https://twitter.com/".length)
        : data.twitter;

      const payloadToSave = {
        ...data,
        twitterHandle: twitterHandle || null, // Send null if empty to clear
        // Ensure other fields are correctly mapped if names differ from ProfileFormValues and backend
      };

      const updatedUser = await updateUserProfile(payloadToSave);

      setProfileData({
        fullName: updatedUser.fullName || "",
        username: updatedUser.lensHandle || updatedUser.address,
        bio: updatedUser.bio || "",
        email: updatedUser.email || "",
        website: updatedUser.website || "",
        twitter: updatedUser.twitterHandle ? `https://twitter.com/${updatedUser.twitterHandle}` : "",
        avatarUrl: updatedUser.avatarUrl || "",
      });
      setIsEditMode(false);
      return true;
    } catch (error: Error | unknown) {
      console.error("Failed to save profile:", error);
      const errorMessage = error instanceof Error ? error.message : "Please try again.";
      toast.error("Failed to update profile.", { description: errorMessage });
      return false;
    } finally {
      setIsSavingProfile(false);
    }
  };

  const toggleEditMode = () => {
    if (isEditMode) {
        if (currentUser) {
             setProfileData({
                fullName: currentUser.fullName || "",
                username: currentUser.lensHandle || currentUser.address,
                bio: currentUser.bio || "",
                email: currentUser.email || "",
                website: currentUser.website || "",
                twitter: currentUser.twitterHandle ? `https://twitter.com/${currentUser.twitterHandle}` : "",
                avatarUrl: currentUser.avatarUrl || "",
            });
        }
        toast.info("Exited edit mode.");
    }
    setIsEditMode(!isEditMode);
  };

  if (isLoadingAuthContext || (isPageLoading && address)) {
      return (
        <div className="min-h-screen bg-[#16213e] flex flex-col items-center justify-center text-white">
            <Loader2 className="h-12 w-12 animate-spin text-[#e94560]" />
            <p className="mt-4 text-lg">Loading Your Settings...</p>
        </div>
      );
  }

  if (!currentUser && !address) {
    return (
        <div className="min-h-screen bg-[#16213e] flex flex-col items-center justify-center text-white">
            <h1 className="text-2xl font-bold">Please Connect Your Wallet</h1>
            <p className="text-[#a1a1aa] mt-2">You need to be authenticated to view your settings.</p>
        </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#16213e] p-4 md:p-8 font-inter text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-8 gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-montserrat font-bold text-white flex items-center">
            <Settings className="mr-3 h-8 w-8 opacity-80" /> My Settings
          </h1>
          <p className="text-md text-[#a1a1aa] font-opensans mt-1">
            Manage your profile, payout preferences, and platform settings.
          </p>
        </div>
        <Button
          onClick={toggleEditMode}
          variant={isEditMode ? "outline" : "default"}
          className={isEditMode ? "border-yellow-500 text-yellow-400 hover:bg-yellow-500/10" : "bg-[#e94560] hover:bg-[#d6304a] text-white"}
        >
          {isEditMode ? <XCircle className="mr-2 h-5 w-5" /> : <Edit className="mr-2 h-5 w-5" />}
          {isEditMode ? 'Cancel Edit Mode' : 'Manage Settings'}
        </Button>
      </motion.div>

      {isEditMode && (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-[#0f3460]/50 border border-[#e94560]/30 rounded-lg text-center"
        >
            <p className="text-yellow-300 font-semibold">
                <Edit className="inline mr-2 h-5 w-5" /> You are in Edit Mode.
            </p>
            <p className="text-sm text-slate-400">Remember to save changes in each section individually.</p>
        </motion.div>
      )}


      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 bg-[#1a1a2e] p-2 rounded-lg mb-8">
          <TabsTrigger value="profile" className="data-[state=active]:bg-[#0f3460] data-[state=active]:text-white data-[state=active]:shadow-md text-[#a1a1aa] hover:text-white flex items-center justify-center gap-2 py-2.5">
            <User className="h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="payouts" className="data-[state=active]:bg-[#0f3460] data-[state=active]:text-white data-[state=active]:shadow-md text-[#a1a1aa] hover:text-white flex items-center justify-center gap-2 py-2.5">
            <CreditCard className="h-4 w-4" /> Payouts
          </TabsTrigger>
          <TabsTrigger value="preferences" className="data-[state=active]:bg-[#0f3460] data-[state=active]:text-white data-[state=active]:shadow-md text-[#a1a1aa] hover:text-white flex items-center justify-center gap-2 py-2.5">
            <Bell className="h-4 w-4" /> Preferences
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-[#0f3460] data-[state=active]:text-white data-[state=active]:shadow-md text-[#a1a1aa] hover:text-white flex items-center justify-center gap-2 py-2.5">
            <Shield className="h-4 w-4" /> Security
          </TabsTrigger>
        </TabsList>

        <Card className="bg-[#101829] border-[#0f3460] text-white">
          <CardContent className="pt-6">
            <TabsContent value="profile">
                {Object.keys(profileData).length > 0 || !address ? (
                    <ProfileInformationForm
                        initialData={profileData}
                        isEditMode={isEditMode}
                        onSave={handleProfileSave}
                    />
                ) : (
                    <p className="text-center text-[#a1a1aa]">Loading profile information...</p>
                )}
            </TabsContent>
            <TabsContent value="payouts">
                <PayoutSettingsForm isEditMode={isEditMode} />
            </TabsContent>
            <TabsContent value="preferences">
                <PlatformPreferencesForm isEditMode={isEditMode} />
            </TabsContent>
            <TabsContent value="security">
                <SecurityPrivacySettings isEditMode={isEditMode} />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
