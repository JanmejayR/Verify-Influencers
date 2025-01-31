"use client";
import React from "react";
import { useState, useEffect } from "react";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RadioCards, Flex, Text } from "@radix-ui/themes";
import { Users, CheckCircle, BarChart2 } from "lucide-react";
import { InfluencerTable } from "@/components/InfluencerTable";


const Page = () => {
  const [leaderboardData, setLeaderboardData] = useState<any>(null);
  const calculateAverageTrustScore = (influencers: any[]) => {
    const totalTrustScore = influencers.reduce(
      (total, influencer) => total + influencer.trustScore,
      0
    );
    return influencers.length ? totalTrustScore / influencers.length : 0;
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        console.log(" inside useeffect of leaderboard");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/leaderboard`);

        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }
        const { totalInfluencers, totalClaims, influencers } =
          await response.json();
        console.log("Leaderboard Data:", {
          totalInfluencers,
          totalClaims,
          influencers,
        });

        const averageTrustScore = calculateAverageTrustScore(influencers);
        setLeaderboardData({
          totalInfluencers,
          totalClaims,
          influencers,
          averageTrustScore,
        });
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <main className="px-16">
      <h1 className="mb-6 mt-16 text-4xl font-bold text-[var(--primary)]">
        Influencer Trust Leaderboard
      </h1>
      <h2 className="  text-md max-w-1/2  text-[var(--primary)]">
        Real-time rankings of health influencers based on scientificd accuracy,
        and transparency. Updated daily using AI-powered analysis.
      </h2>

      <div className=" mt-16">
        <RadioCards.Root className="w-full" variant="classic" color="teal">
          <RadioCards.Item
            value="1"
            className="h-24 data-[state=checked]:bg-teal-500/20 backdrop-blur-md"
          >
            <Users className="h-12 w-12 mr-8" color="teal" />
            <Flex
              direction="column"
              justify="center"
              align="start"
              width="100%"
              gap="2"
            >
              <Text weight="bold" className="text-2xl">
                {leaderboardData?.totalInfluencers}
              </Text>
              <Text>Active Influencers</Text>
            </Flex>
          </RadioCards.Item>
          <RadioCards.Item
            value="2"
            className="h-24 data-[state=checked]:bg-teal-500/20 backdrop-blur-md"
          >
            <CheckCircle className="h-12 w-12 mr-8" color="teal" />
            <Flex
              direction="column"
              justify="center"
              align="start"
              width="100%"
              gap="2"
            >
              <Text weight="bold" className="text-2xl">
                {leaderboardData?.totalClaims}
              </Text>
              <Text>Claims Verified</Text>
            </Flex>
          </RadioCards.Item>

          <RadioCards.Item
            value="3"
            className="h-24 data-[state=checked]:bg-teal-500/20 backdrop-blur-md"
          >
            <BarChart2 className="h-12 w-12 mr-8" color="teal" />
            <Flex
              direction="column"
              justify="center"
              align="start"
              width="100%"
              gap="2"
            >
              <Text weight="bold" className="text-2xl">
              {leaderboardData?.averageTrustScore?.toFixed(2)}%
              </Text>
              <Text>Average Trust Score</Text>
            </Flex>
          </RadioCards.Item>
        </RadioCards.Root>
      </div>

      {leaderboardData && (
        <InfluencerTable influencers={leaderboardData.influencers} />
      )}
    </main>
  );
};

export default Page;
