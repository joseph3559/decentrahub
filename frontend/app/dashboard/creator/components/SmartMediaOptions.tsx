// /home/scott/Desktop/Office/decentrahub/frontend/app/dashboard/creator/components/SmartMediaOptions.tsx
'use client';

import { useState } from 'react';

import { Zap, Lock, HelpCircle, MessageSquare } from 'lucide-react';
import { Label } from '../../../components/ui/label';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Switch } from '../../../components/ui/switch';

interface SmartMediaOptionsProps {
  contentType: 'Article' | 'Music' | 'Video' | 'Art';
  // Add props to receive and update smart media settings in the main form state
  // e.g., smartMediaConfig: any;
  //      onSmartMediaConfigChange: (config: any) => void;
}

// This is a very simplified placeholder. Bonsai integration would be more complex.
export const SmartMediaOptions = ({ contentType }: SmartMediaOptionsProps) => {
  const [enableQuiz, setEnableQuiz] = useState(false);
  const [enablePaywall, setEnablePaywall] = useState(false);

  // TODO: Implement actual Bonsai Smart Media configuration options
  // This would involve more complex state and UI based on Bonsai's SDK/capabilities

  return (
    <div className="space-y-6 p-6 bg-[#1a1a2e]/50 rounded-lg border border-[#0f3460]">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Zap className="w-5 h-5 mr-2 text-[#e94560]" />
          <Label htmlFor="smart-media-title" className="text-lg font-semibold text-white">
            Bonsai Smart Media Options
          </Label>
        </div>
        <Button variant="link" size="sm" className="text-[#a1a1aa] hover:text-[#e94560]">
            <HelpCircle className="w-4 h-4 mr-1" /> Learn More
        </Button>
      </div>
      <p className="text-sm text-[#a1a1aa]">
        Enhance your content with interactive features powered by Bonsai.
        (Placeholder UI - actual Bonsai integration required)
      </p>

      {contentType === 'Article' && (
        <div className="flex items-center space-x-2 p-3 bg-[#16213e] rounded-md">
          <Switch id="enable-quiz" checked={enableQuiz} onCheckedChange={setEnableQuiz} />
          <Label htmlFor="enable-quiz" className="text-sm text-white flex items-center">
            <MessageSquare className="w-4 h-4 mr-2 text-sky-400"/> Enable Interactive Quiz
          </Label>
        </div>
      )}

      {enableQuiz && contentType === 'Article' && (
        <div className="pl-6 space-y-2 border-l-2 border-sky-400/50">
          <Input placeholder="Quiz Question 1" className="bg-[#101829] border-[#0c2a4c] placeholder:text-slate-500"/>
          <Textarea placeholder="Answer choices (one per line)" className="bg-[#101829] border-[#0c2a4c] placeholder:text-slate-500"/>
        </div>
      )}

      <div className="flex items-center space-x-2 p-3 bg-[#16213e] rounded-md">
        <Switch id="enable-paywall" checked={enablePaywall} onCheckedChange={setEnablePaywall} />
        <Label htmlFor="enable-paywall" className="text-sm text-white flex items-center">
            <Lock className="w-4 h-4 mr-2 text-amber-400"/> Add Token-Gated Section / Paywall
        </Label>
      </div>
       {enablePaywall && (
        <div className="pl-6 space-y-2 border-l-2 border-amber-400/50">
          <Input type="number" placeholder="Price (e.g., 0.1 ETH or 5 GHO)" className="bg-[#101829] border-[#0c2a4c] placeholder:text-slate-500"/>
          <Textarea placeholder="Content for token-gated section..." className="bg-[#101829] border-[#0c2a4c] placeholder:text-slate-500"/>
        </div>
      )}

      {/* Add more Bonsai specific options based on content type and Bonsai SDK */}
    </div>
  );
};
