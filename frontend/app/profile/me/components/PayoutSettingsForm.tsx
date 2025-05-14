// /home/scott/Desktop/Office/decentrahub/frontend/app/profile/me/components/PayoutSettingsForm.tsx
'use client';

import { Banknote, CreditCard, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

interface PayoutSettingsFormProps {
  isEditMode: boolean;
  // Add initialData and onSave props similar to ProfileInformationForm
}

export const PayoutSettingsForm = ({ isEditMode }: PayoutSettingsFormProps) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Implement save logic
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate save
    toast.success("Payout settings saved! (Mocked)");
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="walletAddress" className="text-slate-300">Receiving Wallet Address (e.g., for GHO)</Label>
        <Input id="walletAddress" defaultValue="0x123...abc (from connected wallet)" disabled className="mt-1 bg-[#1a1a2e] border-[#0f3460]" />
        <p className="text-xs text-slate-500 mt-1">This is your primary wallet for receiving earnings. It's usually your connected wallet.</p>
      </div>

      <div className="border-t border-[#0f3460] pt-6">
        <h4 className="text-lg font-semibold text-white mb-2 flex items-center"><Banknote className="mr-2 h-5 w-5 text-green-400"/> Bank Information (Optional)</h4>
        <p className="text-sm text-[#a1a1aa] mb-4">Connect your bank account for direct payouts in supported regions. (Feature placeholder)</p>
        <Input placeholder="Account Holder Name" disabled={!isEditMode || isSaving} className="mb-2 bg-[#1a1a2e] border-[#0f3460] placeholder:text-slate-500" />
        <Input placeholder="IBAN / Account Number" disabled={!isEditMode || isSaving} className="mb-2 bg-[#1a1a2e] border-[#0f3460] placeholder:text-slate-500" />
        <Input placeholder="SWIFT / BIC Code" disabled={!isEditMode || isSaving} className="bg-[#1a1a2e] border-[#0f3460] placeholder:text-slate-500" />
      </div>

       <div className="border-t border-[#0f3460] pt-6">
        <h4 className="text-lg font-semibold text-white mb-2 flex items-center"><CreditCard className="mr-2 h-5 w-5 text-blue-400"/> Payment Methods (e.g., Stripe - Optional)</h4>
        <p className="text-sm text-[#a1a1aa] mb-4">Connect services like Stripe for more flexible payout options. (Feature placeholder)</p>
        <Button variant="outline" disabled={!isEditMode || isSaving} className="border-blue-500 text-blue-400 hover:bg-blue-500/10">
            Connect Stripe Account
        </Button>
      </div>


      {isEditMode && (
        <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto bg-[#e94560] hover:bg-[#d6304a] text-white">
          {isSaving ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Payout Settings</>}
        </Button>
      )}
    </div>
  );
};
