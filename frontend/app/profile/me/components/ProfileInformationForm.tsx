// /home/scott/Desktop/Office/decentrahub/frontend/app/profile/me/components/ProfileInformationForm.tsx
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Upload, User, Globe, Save, Loader2 } from 'lucide-react';
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import Image from 'next/image';

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters.").max(50).optional(),
  username: z.string().min(3, "Username must be at least 3 characters.").max(30)
    .regex(/^[a-zA-Z0-9_.]+$/, "Username can only contain letters, numbers, underscores, and periods.")
    .optional(), // Assuming username might come from Lens or be editable here
  bio: z.string().max(200, "Bio can be up to 200 characters.").optional(),
  email: z.string().email("Invalid email address.").optional(), // For notifications, not necessarily public
  website: z.string().url("Invalid URL.").optional().or(z.literal("")),
  twitter: z.string().url("Invalid Twitter URL.").optional().or(z.literal("")),
  // avatarFile: typeof window === 'undefined' ? z.any() : z.instanceof(File).optional(), // For file upload
  avatarUrl: z.string().url().optional().or(z.literal("")), // To store the uploaded avatar URL
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileInformationFormProps {
  initialData: Partial<ProfileFormValues>;
  isEditMode: boolean;
  onSave: (data: ProfileFormValues) => Promise<boolean>;
  isLoading?: boolean;
}

interface NFTItem {
  image: string;
  title: string;
  creator: string;
  category: string;
  imageWidth: number;
  imageHeight: number;
}

export const ProfileInformationForm = ({
  initialData,
  isEditMode,
  onSave,
  isLoading = false
}: ProfileInformationFormProps) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialData?.avatarUrl || null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: initialData?.fullName || "",
      username: initialData?.username || "",
      bio: initialData?.bio || "",
      email: initialData?.email || "",
      website: initialData?.website || "",
      twitter: initialData?.twitter || "",
      avatarUrl: initialData?.avatarUrl || "",
    },
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        // form.setValue("avatarFile", file); // If handling file upload directly
        // For now, we assume an upload mechanism sets avatarUrl
        // In a real app, you'd upload the file here and get back a URL
        form.setValue("avatarUrl", reader.result as string); // Placeholder: use actual uploaded URL
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    const success = await onSave(data);
    if (success) {
      toast.success("Profile updated successfully!");
    } else {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-6">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 ring-2 ring-offset-2 ring-offset-[#16213e] ring-[#e94560]">
            <AvatarImage src={avatarPreview || initialData?.avatarUrl || undefined} alt={initialData?.username || "User"} />
            <AvatarFallback className="bg-[#0f3460] text-white text-3xl">
              {initialData?.fullName ? initialData.fullName.charAt(0).toUpperCase() : <User />}
            </AvatarFallback>
          </Avatar>
          {isEditMode && (
            <div className="relative">
              <Button type="button" variant="outline" className="border-[#0f3460] text-[#a1a1aa] hover:bg-[#0f3460] hover:text-white">
                <Upload className="mr-2 h-4 w-4" /> Change Avatar
              </Button>
              <Input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleAvatarChange}
                disabled={!isEditMode || isLoading}
              />
            </div>
          )}
        </div>

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-300">Full Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={!isEditMode || isLoading}
                  className="bg-[#1a1a2e] border-[#0f3460] placeholder:text-slate-500 focus:border-[#e94560]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-300">Username</FormLabel>
              <FormControl>
                <Input placeholder="Your unique username" {...field} disabled={!isEditMode || isLoading} className="bg-[#1a1a2e] border-[#0f3460] placeholder:text-slate-500 focus:border-[#e94560]" />
              </FormControl>
              <FormDescription className="text-slate-500">This is your public display name. (e.g., Lens handle)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-300">Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us a little about yourself" {...field} disabled={!isEditMode || isLoading} className="bg-[#1a1a2e] border-[#0f3460] placeholder:text-slate-500 min-h-[100px] focus:border-[#e94560]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-300">Email (for notifications)</FormLabel>
              <FormControl>
                <Input type="email" placeholder="your.email@example.com" {...field} disabled={!isEditMode || isLoading} className="bg-[#1a1a2e] border-[#0f3460] placeholder:text-slate-500 focus:border-[#e94560]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-300">Website</FormLabel>
              <FormControl>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input type="url" placeholder="https://yourwebsite.com" {...field} disabled={!isEditMode || isLoading} className="pl-10 bg-[#1a1a2e] border-[#0f3460] placeholder:text-slate-500 focus:border-[#e94560]" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="twitter"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-300">Twitter Profile</FormLabel>
              <FormControl>
                 <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                  <Input type="url" placeholder="https://twitter.com/yourhandle" {...field} disabled={!isEditMode || isLoading} className="pl-10 bg-[#1a1a2e] border-[#0f3460] placeholder:text-slate-500 focus:border-[#e94560]" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isEditMode && (
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto bg-[#e94560] hover:bg-[#d6304a] text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <><Save className="mr-2 h-4 w-4" /> Save Profile</>
            )}
          </Button>
        )}
      </form>
    </Form>
  );
};
