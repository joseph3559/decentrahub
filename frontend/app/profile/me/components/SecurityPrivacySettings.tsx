// /home/scott/Desktop/Office/decentrahub/frontend/app/profile/me/components/SecurityPrivacySettings.tsx
'use client';

import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { KeyRound, Lock, Activity, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"; // For modals

interface SecurityPrivacySettingsProps {
  isEditMode: boolean;
  // Add initialData and onSave props
}

export const SecurityPrivacySettings = ({ isEditMode }: SecurityPrivacySettingsProps) => {
  const [isSaving, setIsSaving] = useState(false);
  // Example states for 2FA - in reality, this is more complex
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Implement save logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Security settings updated! (Mocked)");
    setIsSaving(false);
  };

  const handleChangePassword = () => {
    // TODO: Implement password change flow, likely with a modal
    toast.info("Password change flow not implemented yet.");
  };

  const handleToggle2FA = () => {
    // TODO: Implement 2FA setup/disable flow, likely with a modal and QR codes
    setIs2FAEnabled(!is2FAEnabled);
    toast.info(`2FA ${!is2FAEnabled ? 'enabled' : 'disabled'}. (Mocked - requires backend)`);
  };


  return (
    <div className="space-y-8">
      <div>
        <h4 className="text-lg font-semibold text-white mb-3 flex items-center"><KeyRound className="mr-2 h-5 w-5 text-orange-400"/> Password Management</h4>
        <Button onClick={handleChangePassword} variant="outline" disabled={!isEditMode || isSaving} className="border-orange-500 text-orange-400 hover:bg-orange-500/10">
          Change Password
        </Button>
        <p className="text-xs text-slate-500 mt-1">Its recommended to use a strong, unique password.</p>
      </div>

      <div className="border-t border-[#0f3460] pt-6">
        <h4 className="text-lg font-semibold text-white mb-3 flex items-center"><Lock className="mr-2 h-5 w-5 text-green-400"/> Two-Factor Authentication (2FA)</h4>
        <div className="flex items-center justify-between p-3 bg-[#1a1a2e]/70 rounded-md">
            <Label htmlFor="enable-2fa" className="text-slate-300">
                {is2FAEnabled ? "2FA is Enabled" : "Enable Two-Factor Authentication"}
            </Label>
            <Button onClick={handleToggle2FA} variant={is2FAEnabled ? "destructive" : "default"} size="sm" disabled={!isEditMode || isSaving} className={is2FAEnabled ? "" : "bg-green-600 hover:bg-green-700"}>
                {is2FAEnabled ? "Disable 2FA" : "Enable 2FA"}
            </Button>
        </div>
         <p className="text-xs text-slate-500 mt-1">Add an extra layer of security to your account.</p>
      </div>

      <div className="border-t border-[#0f3460] pt-6">
        <h4 className="text-lg font-semibold text-white mb-3 flex items-center"><Activity className="mr-2 h-5 w-5 text-sky-400"/> Activity Logs</h4>
        <p className="text-sm text-[#a1a1aa] mb-2">Review recent login activity and important security events.</p>
        <Button variant="outline" disabled className="border-sky-500 text-sky-400 hover:bg-sky-500/10">
          View Activity Logs (Coming Soon)
        </Button>
      </div>

      {isEditMode && (
        <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto bg-[#e94560] hover:bg-[#d6304a] text-white">
         {isSaving ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Security Settings</>}
        </Button>
      )}
    </div>
  );
};
