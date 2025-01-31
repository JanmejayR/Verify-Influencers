import mongoose from "mongoose";

const claimSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Nutrition", "Medicine", "Mental Health"],
      required: true,
    },
    claimSearchQuery: {
      type: String,
      required: true,
    },
    verificationStatus: {
      type: String,
      enum: ["Verified", "Questionable", "Debunked"],
      required: true,
    },
    influencer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Influencer",
      required: true,
    },
    articles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Claim = mongoose.models.Claim || mongoose.model("Claim", claimSchema);

export default Claim;
