import mongoose from "mongoose";

const influencerSchema = new mongoose.Schema(
  {
    twitterId:{
        type: String,
        required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    profileImageUrl: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    followerCount: {
      type: Number,
    },
    estimatedYearlyRevenue:{
        type: Number,
    },
    trustScore:{
        type:Number,
        default:0
    },
    claims: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Claim", 
        },
      ],
      name: {
        type: String,
        required: true,
      },
  },
  {
    timestamps: true,
  }
);
const Influencer = mongoose.models.Influencer || mongoose.model("Influencer", influencerSchema);

export default Influencer;