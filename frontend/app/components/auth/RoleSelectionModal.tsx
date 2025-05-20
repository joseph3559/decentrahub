// /home/scott/Desktop/Office/decentrahub/frontend/app/components/auth/RoleSelectionModal.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose, // Added for a cancel/close button
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input"; // Added for profile fields
import { Label } from "../../components/ui/label"; // Added for profile fields
import { User, Briefcase } from "lucide-react";
import { useState } from "react";

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void; // To handle closing the modal without selection
  onRoleSubmit: (role: 'creator' | 'consumer', additionalInfo: { fullName?: string; email?: string }) => void; // Changed prop name and signature
  walletAddress: string | undefined;
}

export const RoleSelectionModal = ({
  isOpen,
  onClose,
  onRoleSubmit, // Changed from onRoleSelect
  walletAddress,
}: RoleSelectionModalProps) => {
  const [selectedRole, setSelectedRole] = useState<'creator' | 'consumer' | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  if (!isOpen) return null;

  const handleRoleButtonClick = (role: 'creator' | 'consumer') => {
    setSelectedRole(role);
    // Optionally, you could submit immediately if no extra fields,
    // but now we have a dedicated submit button.
  };

  const handleSubmit = () => {
    if (!selectedRole) {
        // Optionally, show a message to select a role first
        alert("Please select a role first."); // Replace with a nicer toast/message
        return;
    }
    setIsSubmitting(true);
    // Pass collected info. Backend will handle empty strings if fields are optional.
    onRoleSubmit(selectedRole, { fullName: fullName.trim(), email: email.trim() });
    // Modal will be closed by AuthContext after successful submission or error handling
    // setIsSubmitting(false); // Reset by AuthContext or on modal close
  };


  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-md bg-[#1a1a2e] border-[#0f3460] text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-montserrat text-center text-[#e94560]">
            Welcome to DecentraHub!
          </DialogTitle>
          <DialogDescription className="text-center text-[#a1a1aa] pt-2 font-opensans">
            You are connecting with: <strong className="text-purple-400 block truncate text-sm my-1">{walletAddress}</strong>
            To complete your setup, please select your role and optionally provide some basic info.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
            <div>
                <Label className="text-sm font-medium text-slate-300 mb-2 block">1. Choose Your Role:</Label>
                <div className="grid grid-cols-2 gap-3">
                <Button
                    variant={selectedRole === 'creator' ? 'default' : 'outline'}
                    onClick={() => handleRoleButtonClick('creator')}
                    className={`h-auto p-4 flex flex-col items-center justify-center space-y-1.5 transition-all duration-200
                                ${selectedRole === 'creator'
                                ? 'bg-[#e94560] hover:bg-[#d6304a] text-white border-[#e94560]'
                                : 'border-[#0f3460] text-[#a1a1aa] hover:bg-[#0f3460] hover:text-white'
                                }`}
                >
                    <Briefcase className="w-8 h-8 mb-1" />
                    <span className="text-md font-semibold font-montserrat">Creator</span>
                    <span className="text-xs text-center opacity-80 font-opensans">Mint and Monetize</span>
                </Button>
                <Button
                    variant={selectedRole === 'consumer' ? 'default' : 'outline'}
                    onClick={() => handleRoleButtonClick('consumer')}
                    className={`h-auto p-4 flex flex-col items-center justify-center space-y-1.5 transition-all duration-200
                                ${selectedRole === 'consumer'
                                ? 'bg-[#e94560] hover:bg-[#d6304a] text-white border-[#e94560]'
                                : 'border-[#0f3460] text-[#a1a1aa] hover:bg-[#0f3460] hover:text-white'
                                }`}
                >
                    <User className="w-8 h-8 mb-1" />
                    <span className="text-md font-semibold font-montserrat">Consumer</span>
                    <span className="text-xs text-center opacity-80 font-opensans">Discover and Collect</span>
                </Button>
                </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-[#0f3460]/50">
                <Label className="text-sm font-medium text-slate-300 mb-1 block">2. Basic Information (Optional):</Label>
                <div>
                    <Label htmlFor="fullName" className="text-xs text-slate-400">Full Name</Label>
                    <Input
                        id="fullName"
                        placeholder="Your Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="bg-[#101829] border-[#0c2a4c] placeholder:text-slate-500 mt-1"
                    />
                </div>
                <div>
                    <Label htmlFor="email" className="text-xs text-slate-400">Email (for notifications)</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-[#101829] border-[#0c2a4c] placeholder:text-slate-500 mt-1"
                    />
                </div>
            </div>
        </div>

        <DialogFooter className="mt-4 sm:justify-between gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={onClose} className="border-[#0f3460] text-[#a1a1aa] hover:bg-[#0f3460]/50 hover:text-white w-full sm:w-auto">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedRole || isSubmitting}
            className="bg-[#e94560] hover:bg-[#d6304a] text-white w-full sm:w-auto"
          >
            {isSubmitting ? "Submitting..." : "Confirm & Proceed"}
          </Button>
        </DialogFooter>
         <p className="text-xs text-center text-slate-500 mt-4 w-full">
            Your role helps us tailor your experience. Profile details can be updated later.
          </p>
      </DialogContent>
    </Dialog>
  );
};
