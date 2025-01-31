export const maxDuration = 60;
export const dynamic = 'force-dynamic'
import { NextResponse } from "next/server";
import { Influencer,  Claim } from "@/app/models";
import { connectToDatabase } from "@/lib/mongodb"; 
import mongoose from "mongoose";



export async function GET() {
   try{

    console.log(mongoose.models);  
    await connectToDatabase(); 
    const influencers = await Influencer.find({})
      .populate({
        path: "claims", 
        populate: {
            path: "articles", 
            select: "link", 
          },
      });

    const totalInfluencers = await Influencer.countDocuments();
    const totalClaims = await Claim.countDocuments();

    return NextResponse.json({
      totalInfluencers,
      totalClaims,
      influencers,
    }, { status: 200 });

   }
    catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}



