// /home/scott/Desktop/Office/decentrahub/frontend/app/dashboard/creator/components/ContentForm.tsx
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";


import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

// Import placeholder components
import { MediaUpload } from './MediaUpload';
import { SmartMediaOptions } from './SmartMediaOptions';
import { PreviewDisplay } from './PreviewDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";


type ContentType = 'Article' | 'Music' | 'Video' | 'Art';

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }).max(100),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }).max(1000),
  mediaIpfsUrl: z.string().url({ message: "Valid media upload is required." }).optional().or(z.literal("")), // Allow empty string initially
  mediaType: z.string().optional().or(z.literal("")), // Allow empty string initially
  category: z.enum(['Article', 'Music', 'Video', 'Art']),
  tags: z.array(z.string().min(1).max(20)).max(10, { message: "You can add up to 10 tags." }),
  price: z.coerce.number().min(0, { message: "Price cannot be negative." }),
  // smartMediaConfig: z.any().optional(),
});

export type ContentFormValues = z.infer<typeof formSchema>;

interface ContentFormProps {
  contentType: ContentType;
  onSubmit: (values: ContentFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export const ContentForm = ({ contentType, onSubmit, isSubmitting }: ContentFormProps) => {
  const [currentTag, setCurrentTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  // These states manage the values for the preview and to ensure they are passed correctly on submit
  const [previewMediaIpfsUrl, setPreviewMediaIpfsUrl] = useState<string | undefined>(undefined);
  const [previewUploadedMediaType, setPreviewUploadedMediaType] = useState<string | undefined>(undefined);


  const form = useForm<ContentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      mediaIpfsUrl: "", // Initialize as empty string
      mediaType: "",    // Initialize as empty string
      category: contentType,
      tags: [],
      price: 0,
    },
  });

  const watchedTitle = form.watch("title");
  const watchedDescription = form.watch("description");

  useEffect(() => {
    form.setValue("category", contentType);
    // Reset media fields when content type changes to avoid carrying over old uploads
    form.setValue("mediaIpfsUrl", "");
    form.setValue("mediaType", "");
    setPreviewMediaIpfsUrl(undefined);
    setPreviewUploadedMediaType(undefined);
  }, [contentType, form]);

  const handleAddTag = () => {
    if (currentTag.trim() !== "" && !tags.includes(currentTag.trim()) && tags.length < 10) {
      const newTags = [...tags, currentTag.trim()];
      setTags(newTags);
      form.setValue("tags", newTags, { shouldValidate: true });
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    form.setValue("tags", newTags, { shouldValidate: true });
  };

  const handleFileUploaded = (url: string, fileType: string) => {
    setPreviewMediaIpfsUrl(url); // Update state for preview
    setPreviewUploadedMediaType(fileType); // Update state for preview
    form.setValue("mediaIpfsUrl", url, { shouldValidate: true }); // Update form value
    form.setValue("mediaType", fileType, { shouldValidate: true }); // Update form value
    form.clearErrors("mediaIpfsUrl"); // Clear any previous "upload required" error
  };

  const onFormSubmit = (values: ContentFormValues) => {
    // Ensure the latest media URL from state (set by callback) is part of submission
    // as react-hook-form might not pick up the hidden field update immediately in all scenarios
    // if it was set programmatically right before submit.
    const finalValues = {
        ...values,
        mediaIpfsUrl: previewMediaIpfsUrl || "", // Use state value, fallback to empty if somehow still undefined
        mediaType: previewUploadedMediaType || "",
    };

    if (!finalValues.mediaIpfsUrl) {
        form.setError("mediaIpfsUrl", { type: "manual", message: "Please upload your content media." });
        return;
    }
    onSubmit(finalValues);
  }


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <Card className="lg:col-span-2 bg-[#101829] border-[#0f3460] text-white">
        <CardHeader>
          <CardTitle className="font-montserrat text-2xl text-[#e94560]">
            Create New {contentType}
          </CardTitle>
          <CardDescription className="text-[#a1a1aa] font-opensans">
            Fill in the details below to mint your content as an NFT on Lens Chain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Title</FormLabel>
                    <FormControl>
                      <Input placeholder={`Enter ${contentType} title...`} {...field} className="bg-[#1a1a2e] border-[#0f3460] placeholder:text-slate-500 focus:border-[#e94560]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={`Tell us about your ${contentType}...`}
                        {...field}
                        className="bg-[#1a1a2e] border-[#0f3460] placeholder:text-slate-500 min-h-[120px] focus:border-[#e94560]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel className="text-slate-300">Upload Media</FormLabel>
                <MediaUpload contentType={contentType} onFileUploaded={handleFileUploaded} />
                {/* This hidden input is controlled by react-hook-form.
                    Its value is set by form.setValue in handleFileUploaded.
                    Ensuring it starts with "" (empty string) in defaultValues prevents the error. */}
                <FormField
                    control={form.control}
                    name="mediaIpfsUrl"
                    render={({ field }) => (
                        // The value prop will be an empty string initially due to defaultValues
                        <Input type="hidden" {...field} />
                    )}
                />
                {/* Display error message specifically for mediaIpfsUrl if it exists */}
                <FormMessage>{form.formState.errors.mediaIpfsUrl?.message}</FormMessage>
              </FormItem>


              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled>
                      <FormControl>
                        <SelectTrigger className="bg-[#1a1a2e] border-[#0f3460] focus:border-[#e94560]">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#1a1a2e] border-[#0f3460] text-white">
                        {['Article', 'Music', 'Video', 'Art'].map(cat => (
                          <SelectItem key={cat} value={cat} className="hover:bg-[#0f3460] focus:bg-[#0f3460]">
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-slate-500">
                      Content type is determined by the selected tab.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel className="text-slate-300">Tags (up to 10)</FormLabel>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Add a tag and press Enter or Add"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag();}}}
                    className="bg-[#1a1a2e] border-[#0f3460] placeholder:text-slate-500 focus:border-[#e94560]"
                  />
                  <Button type="button" onClick={handleAddTag} variant="outline" className="border-[#e94560] text-[#e94560] hover:bg-[#e94560]/10">Add</Button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="bg-[#0f3460] text-white hover:bg-[#0f3460]/80">
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1.5 focus:outline-none">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                 <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => ( <Input type="hidden" {...field} /> /* For validation */ )}
                />
                <FormMessage>{form.formState.errors.tags?.message}</FormMessage>
              </FormItem>

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Price (in GHO or ETH equivalent)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g., 10.50" {...field} className="bg-[#1a1a2e] border-[#0f3460] placeholder:text-slate-500 focus:border-[#e94560]" />
                    </FormControl>
                    <FormDescription className="text-slate-500">
                      Set to 0 for free content. Auctions can be configured later.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SmartMediaOptions contentType={contentType} />

              <Button type="submit" disabled={isSubmitting} className="w-full bg-[#e94560] hover:bg-[#d6304a] text-white text-lg py-3">
                {isSubmitting ? 'Minting NFT...' : `Mint ${contentType} NFT`}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="lg:col-span-1 sticky top-24"> {/* Sticky preview column */}
        <PreviewDisplay
            mediaUrl={previewMediaIpfsUrl} // Use state variable for preview
            mediaType={previewUploadedMediaType} // Use state variable for preview
            title={watchedTitle}
            description={watchedDescription}
        />
      </div>
    </div>
  );
};
