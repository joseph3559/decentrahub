// /home/scott/Desktop/Office/decentrahub/frontend/app/profile/me/components/PlatformPreferencesForm.tsx
'use client';

import { Bell, Palette, Languages, Save } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Label } from "../../../components/ui/label";
import { Switch } from "../../../components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";

interface PlatformPreferencesFormProps {
  isEditMode: boolean;
  // Add initialData and onSave props
}

export const PlatformPreferencesForm = ({ isEditMode }: PlatformPreferencesFormProps) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // For email notifications
  const [emailSales, setEmailSales] = useState(true);
  const [emailComments, setEmailComments] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);

  useEffect(() => setMounted(true), []); // Ensure theme is available client-side

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Implement save logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Preferences saved! (Mocked)");
    setIsSaving(false);
  };

  if (!mounted) return null; // Avoid hydration mismatch for theme

  return (
    <div className="space-y-8">
      <div>
        <h4 className="text-lg font-semibold text-white mb-3 flex items-center"><Bell className="mr-2 h-5 w-5 text-yellow-400"/> Notification Settings</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-[#1a1a2e]/70 rounded-md">
            <Label htmlFor="email-sales" className="text-slate-300">Email for new sales/royalties</Label>
            <Switch id="email-sales" checked={emailSales} onCheckedChange={setEmailSales} disabled={!isEditMode || isSaving} />
          </div>
          <div className="flex items-center justify-between p-3 bg-[#1a1a2e]/70 rounded-md">
            <Label htmlFor="email-comments" className="text-slate-300">Email for new comments/mentions</Label>
            <Switch id="email-comments" checked={emailComments} onCheckedChange={setEmailComments} disabled={!isEditMode || isSaving} />
          </div>
          <div className="flex items-center justify-between p-3 bg-[#1a1a2e]/70 rounded-md">
            <Label htmlFor="email-updates" className="text-slate-300">Email for platform updates & news</Label>
            <Switch id="email-updates" checked={emailUpdates} onCheckedChange={setEmailUpdates} disabled={!isEditMode || isSaving} />
          </div>
          {/* Add SMS and In-app notification toggles if needed */}
        </div>
      </div>

      <div className="border-t border-[#0f3460] pt-6">
        <h4 className="text-lg font-semibold text-white mb-3 flex items-center"><Palette className="mr-2 h-5 w-5 text-purple-400"/> Theme Settings</h4>
        <Select value={theme} onValueChange={(value) => setTheme(value)} disabled={!isEditMode || isSaving}>
          <SelectTrigger className="w-full sm:w-[200px] bg-[#1a1a2e] border-[#0f3460] text-[#a1a1aa] focus:ring-[#e94560]">
            <SelectValue placeholder="Select theme" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a2e] border-[#0f3460] text-[#a1a1aa]">
            <SelectItem value="light" className="hover:bg-[#0f3460] focus:bg-[#0f3460]">Light</SelectItem>
            <SelectItem value="dark" className="hover:bg-[#0f3460] focus:bg-[#0f3460]">Dark</SelectItem>
            <SelectItem value="system" className="hover:bg-[#0f3460] focus:bg-[#0f3460]">System</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border-t border-[#0f3460] pt-6">
        <h4 className="text-lg font-semibold text-white mb-3 flex items-center"><Languages className="mr-2 h-5 w-5 text-sky-400"/> Language Preferences</h4>
        <Select defaultValue="en" disabled={!isEditMode || isSaving}>
          <SelectTrigger className="w-full sm:w-[200px] bg-[#1a1a2e] border-[#0f3460] text-[#a1a1aa] focus:ring-[#e94560]">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a2e] border-[#0f3460] text-[#a1a1aa]">
            <SelectItem value="en" className="hover:bg-[#0f3460] focus:bg-[#0f3460]">English</SelectItem>
            <SelectItem value="es" disabled className="hover:bg-[#0f3460] focus:bg-[#0f3460]">Español (Coming Soon)</SelectItem>
            {/* Add more languages */}
          </SelectContent>
        </Select>
      </div>

      {isEditMode && (
        <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto bg-[#e94560] hover:bg-[#d6304a] text-white">
          {isSaving ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Preferences</>}
        </Button>
      )}
    </div>
  );
};
