"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {  Flex, RadioCards, Text } from "@radix-ui/themes";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Spinner } from "@radix-ui/themes";
import { useState } from "react";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  searchCategory: z.enum(["specificInfluencer", "discoverNew"], {
    message: "Select a category",
  }),
  timeRange: z.enum(["Last Week", "Last Month", "Last Year", "All Time"], {
    message: "Select a Time Range",
  }),
  influencerName: z.string().min(1, { message: "Influencer name is required" }),
  claimsToAnalyze: z
    .coerce.number()
    .min(1, { message: "Minimum 1 claim" })
    .max(10, { message: "Maximum 10 claims supported" }),
  productsPerInfluencer: z
    .coerce.number()
    .min(0, { message: "Minimum products is 0" })
    .max(10, { message: "Maximum product limit is 10" }),
  includeRevenueAnalysis: z.boolean().default(false),
  verifyWithScientificJournals: z.boolean().default(true),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;


const Page = () => {
  const { toast } = useToast()
  const router = useRouter()
  const [ isLoading , setIsLoading ] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchCategory: "specificInfluencer",
      timeRange: "Last Week",
      influencerName: "",
      claimsToAnalyze: 5,
      productsPerInfluencer: 0,
      includeRevenueAnalysis: false,
      verifyWithScientificJournals: true,
      notes: "",
    },
  });

  
  async function onSubmit(formData: FormValues) {
    try {
      setIsLoading(true)
      console.log(" form data in frontend " , formData)
      const response = await fetch(`https://verify-influencers-pink.vercel.app/api/research`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error(`error occurred during processing data: ${response.status}`);
        setIsLoading(false)
      }
  
     

      setTimeout(() => {
        router.push('/leaderboard');
      }, 2000);


      toast({
        title: "Research Completed",
        description: "Redirecting to the leaderboard...",
      });
      setIsLoading(false)
      
    } catch (error) {
      console.error('Error starting research:', error);
      setIsLoading(false)
    }
  }

  return (
    <main className="pt-8">
      <h1 className="my-8 text-center text-4xl font-bold text-[var(--primary)]">
        Research Tasks
      </h1>
      <Card className="mx-16">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 mx-8 ">
              <h2 className="text-2xl mb-4 text-[var(--primary)]">
                Research Configuration
              </h2>

              <FormField
                control={form.control}
                name="searchCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex ">
                        <RadioCards.Root
                          value={field.value}
                          onValueChange={field.onChange}
                          className="w-full"
                          variant="classic"
                          color="teal"
                        >
                          <RadioCards.Item
                            value="specificInfluencer"
                            className="h-24 data-[state=checked]:bg-teal-500/20 backdrop-blur-md"
                          >
                            <Flex
                              direction="column"
                              justify="center"
                              align="center"
                              width="100%"
                              gap="2"
                            >
                              <Text weight="bold">Specific Influencer</Text>
                              <Text>
                                Research a known health influencer by name
                              </Text>
                            </Flex>
                          </RadioCards.Item>
                          <RadioCards.Item
                            value="discoverNew"
                            className="h-24 data-[state=checked]:bg-teal-500/20 cursor-not-allowed"
                            disabled={true}
                            
                          >
                            <Flex
                              direction="column"
                              justify="center"
                              align="center"
                              width="100%"
                              gap="2"
                            >
                              <Text weight="bold">Discover New</Text>
                              <Text>
                                Find and analyze new health influencers
                              </Text>
                            </Flex>
                          </RadioCards.Item>
                        </RadioCards.Root>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex  w-full gap-4 my-8">
                <div className=" w-1/2 ">
                  <h2 className="text-lg my-2  text-[var(--primary)]">
                    Time Range
                  </h2>
                  <FormField
                    control={form.control}
                    name="timeRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioCards.Root
                            value={field.value}
                            onValueChange={field.onChange}
                            className="w-full"
                            variant="classic"
                            color="teal"
                          >
                            <>
                              <div className="flex flex-col items-start gap-4 w-full">
                                <div className="flex gap-4 w-full">
                                  <RadioCards.Item
                                    value="Last Week"
                                    className="h-12 data-[state=checked]:bg-teal-500/20 backdrop-blur-md w-full"
                                  >
                                    <Text>Last Week</Text>
                                  </RadioCards.Item>
                                  <RadioCards.Item
                                    value="Last Month"
                                    className="h-12 data-[state=checked]:bg-teal-500/20 w-full cursor-not-allowed"
                                    disabled={true}
                                  >
                                    <Text>Last Month</Text>
                                  </RadioCards.Item>
                                </div>

                                <div className="flex gap-4 w-full">
                                  <RadioCards.Item
                                    value="Last Year"
                                    className="h-12 data-[state=checked]:bg-teal-500/20 backdrop-blur-md w-full cursor-not-allowed"
                                    disabled={true}
                                  >
                                    <Text>Last Year</Text>
                                  </RadioCards.Item>
                                  <RadioCards.Item
                                    value="All Time"
                                    className="h-12 data-[state=checked]:bg-teal-500/20 w-full cursor-not-allowed"
                                    disabled={true}
                                  >
                                    <Text>All Time</Text>
                                  </RadioCards.Item>
                                </div>
                              </div>
                            </>
                          </RadioCards.Root>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <h2 className="text-lg mt-8 mb-2 text-[var(--primary)]">
                    Influencer&apos;s Twitter Username
                  </h2>
                  <FormField
                    control={form.control}
                    name="influencerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Enter Influencer username  without @"
                            className="h-12"
                          />
                        </FormControl>
                        <FormMessage className="text-xl text-red-400 " />
                      </FormItem>
                    )}
                  />

                  <h2 className="text-lg mt-8 mb-2 text-[var(--primary)]">
                    Claims to Analyze Per Influencer
                  </h2>
                  <FormField
                    control={form.control}
                    name="claimsToAnalyze"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            value={field.value}
                            onChange={field.onChange}
                            className="h-12 cursor-not-allowed"
                            disabled={true}

                          />
                        </FormControl>
                        <FormMessage className="text-xl text-red-400 " />
                      </FormItem>
                    )}
                  />
                  <Text className="text-sm">
                    Recommended 5-10 claims for comprehensive analysis
                  </Text>
                </div>

                <div className=" w-1/2 ">
                  <h2 className="text-lg mt-2 mb-2 text-[var(--primary)]">
                    Products to Find Per Influencer
                  </h2>
                  <FormField
                    control={form.control}
                    name="productsPerInfluencer"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            value={field.value}
                            onChange={field.onChange}
                            className="h-12 cursor-not-allowed"
                            disabled={true}
                          />
                        </FormControl>
                        <FormMessage className="text-xl text-red-400 " />
                      </FormItem>
                    )}
                  />
                  <Text className="text-sm">
                    Set to 0 to skip Product Research
                  </Text>

                  <FormField
                    control={form.control}
                    name="includeRevenueAnalysis"
                    render={({  }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm my-4">
                        <div className="space-y-0.5">
                          <FormLabel>Include Revenue Analysis</FormLabel>
                          <FormDescription>
                            Analyze monetization methods and estimate earnings.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            // checked={field.value}
                            // onCheckedChange={field.onChange}
                            checked={true}
                            disabled={true}
                            className="data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="verifyWithScientificJournals"
                    render={({  }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm my-4">
                        <div className="space-y-0.5">
                          <FormLabel>Verify With Scientific Journals</FormLabel>
                          <FormDescription>
                            Cross-reference claims with scientific literature.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            // checked={field.value}
                            // onCheckedChange={field.onChange}
                            checked={true}
                            disabled={true}
                            className="data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="mt-16">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xl">
                        Notes for Research Assistant
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          value={field.value}
                          onChange={field.onChange}
                          className="h-24"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
              <Button type="submit" className={`mt-8 ${isLoading ? ' bg-teal-400' : 'bg-teal-500'} hover:bg-teal-400`}  >
                
                {isLoading ? 
                  <> Researching <Spinner className="ml-2 h-4 w-4 " /></> : 'Start Research'
                }

              </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
};

export default Page;
