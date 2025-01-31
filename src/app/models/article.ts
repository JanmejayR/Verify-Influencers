import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    pubMedId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    abstract: {
      type: String,
      required: true,
    },
    claim: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Claim",
      required: true,
    },
    link: {
        type: String,
        required: true,
      },
  },
  {
    timestamps: true, 
  }
);

const Article = mongoose.models.Article || mongoose.model("Article", articleSchema);

export default Article;