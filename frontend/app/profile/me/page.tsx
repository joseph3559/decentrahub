// /home/scott/Desktop/Office/decentrahub/frontend/app/profile/me/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { Separator } from "../../components/ui/separator";
import { Settings, User, CreditCard, Bell, Shield, Edit, XCircle, SaveAll } from 'lucide-react';
import { toast } from "sonner";

// Import section-specific form components (adjust paths if you place them elsewhere)
import { ProfileInformationForm, type ProfileFormValues } from './components/ProfileInformationForm';
import { PayoutSettingsForm } from './components/PayoutSettingsForm';
import { PlatformPreferencesForm } from './components/PlatformPreferencesForm';
import { SecurityPrivacySettings } from './components/SecurityPrivacySettings';
import { useAuth } from '../../context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';


// Define a more explicit expected structure for LensProfile for this component's use
// This helps bridge any potential gaps in the LensProfile type from AuthContext
interface ExpectedLensProfile {
  name?: string | null;
  handle?: string | null;
  bio?: string | null;
  picture?: {
    original?: {
      url: string | null;
    } | null;
  } | null;
  // Add other fields you expect from lensProfile if necessary
}


// Mock initial data - replace with actual data fetching for the logged-in user
const mockUserProfileData: Partial<ProfileFormValues> = {
  fullName: "Scott The Creator",
  username: "scott_creates",
  bio: "Digital artist exploring the frontiers of web3 and decentralized media. Passionate about building communities.",
  email: "scott.creator@example.com",
  website: "https://scottcreates.art",
  twitter: "https://twitter.com/scottcreates",
  avatarUrl: "https://picsum.photos/seed/scottprofile/200/200",
};
// Add mock data for other sections if needed

export default function CreatorSettingsPage() {
  const { address, userRole, lensProfile } = useAuth(); // lensProfile type comes from AuthContext
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // For initial data load
  const [profileData, setProfileData] = useState<Partial<ProfileFormValues>>(mockUserProfileData);
  // Add states for other sections' data if they are fetched separately

  useEffect(() => {
    setIsLoading(true);
    if (address) {
      setTimeout(() => {
        // Cast lensProfile to ExpectedLensProfile to handle potential type discrepancies
        const currentLensProfile = lensProfile as ExpectedLensProfile | null | undefined;

        setProfileData({
            fullName: currentLensProfile?.name || currentLensProfile?.handle || mockUserProfileData.fullName,
            username: currentLensProfile?.handle || mockUserProfileData.username,
            bio: currentLensProfile?.bio || mockUserProfileData.bio,
            avatarUrl: currentLensProfile?.picture?.original?.url || mockUserProfileData.avatarUrl,
            email: mockUserProfileData.email, // Email usually not public on Lens, fetched from backend
            website: mockUserProfileData.website, // Potentially from Lens metadata or backend
            twitter: mockUserProfileData.twitter, // Potentially from Lens metadata or backend
        });
        setIsLoading(false);
      }, 1000);
    } else {
      setIsLoading(false);
    }
  }, [address, lensProfile]);


  const handleProfileSave = async (data: ProfileFormValues): Promise<boolean> => {
    console.log("Saving Profile Data:", data);
    // TODO: API call to save profile data
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    // For optimistic updates or refetching:
    setProfileData(prev => ({...prev, ...data}));
    // toast.success("Profile updated successfully!"); // Moved to ProfileInformationForm
    return true; // Indicate success
  };

  // Add save handlers for other sections: handlePayoutSave, handlePreferencesSave, handleSecuritySave

  const toggleEditMode = () => {
    if (isEditMode) {
        toast.info("Exited edit mode. Changes not saved unless 'Save' was clicked for each section.");
    }
    setIsEditMode(!isEditMode);
  };

  // Basic role check - ideally use middleware for route protection
  if (userRole && userRole !== 'creator' && userRole !== 'consumer') {
    // This is a client-side check. For robust security, use Next.js middleware.
    // Consider redirecting or showing a more generic "access denied" page.
  }

  // Improved loading state: show loading if address is present but data isn't ready yet,
  // or if address itself is still loading (implicit from AuthContext).
  if (isLoading && address) {
      return <div className="min-h-screen bg-[#16213e] flex items-center justify-center text-white">Loading settings...</div>;
  }
  // If not loading and no address, it means user is not authenticated to see this page.
  // This case might be handled by a route guard or AuthContext's loading state.
  // For now, if it reaches here without an address and not loading, it might show an empty/default state.


  return (
    <div className="min-h-screen bg-[#16213e] p-4 md:p-8 font-inter text-white">
      {/* Header Section */}
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
          variant={isEditMode ? "destructive" : "default"}
          className={isEditMode ? "" : "bg-[#e94560] hover:bg-[#d6304a] text-white"}
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
                <ProfileInformationForm
                    initialData={profileData}
                    isEditMode={isEditMode}
                    onSave={handleProfileSave}
                />
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
