export const maxDuration = 60;
export const dynamic = 'force-dynamic'
import { NextResponse } from "next/server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Influencer from "@/app/models/influencer";
import Claim from "@/app/models/claim"
import Article from "@/app/models/article"
import Groq from "groq-sdk";
import { connectToDatabase } from "@/lib/mongodb"; 
import xml2js from 'xml2js';


export async function POST(req: Request) {
  try {
    const {
      influencerName,
    } = await req.json();

    await connectToDatabase();

    const userRes = await fetch(`https://api.twitter.com/2/users/by/username/${influencerName}?user.fields=profile_image_url,public_metrics,description,name`, {
        headers: { Authorization: `Bearer ${process.env.BEARER_TOKEN}` },
      });

      

      const userData = await userRes.json();
      console.log("Twitter API response:", userData);
      console.log('Rate Limit Info:', userRes.headers.get('x-rate-limit-remaining'), userRes.headers.get('x-rate-limit-reset'));

      if (!userData.data) {
        console.log(" hihihhihihihihi")
        console.log("influlencer name " , influencerName)
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

    const userId = userData.data.id;
    const profileImageUrl = userData.data.profile_image_url
    const followersCount = userData.data.public_metrics.followers_count;
    const bio = userData.data.description
    const estimatedYearlyRevenue = calculateEstimatedYearlyRevenue(followersCount);
    const name = userData.data.name


    



      console.log(" the fetched user's data ", userData.data , " and the estimated yearly revenue " , estimatedYearlyRevenue)
      

      // Fetching recent 5 tweets from the user, limited because of tier restrictions
      const tweetsRes = await fetch(
        `https://api.twitter.com/2/users/${userId}/tweets?max_results=5&tweet.fields=created_at,text`,
        {
          headers: { Authorization: `Bearer ${process.env.BEARER_TOKEN}` },
        }
      );

      const tweetsData = await tweetsRes.json();
      if (!tweetsData.data) {
        return NextResponse.json({ error: "No tweets found" }, { status: 404 });
      }

      console.log("Tweets:", tweetsData.data);


      // const testTweets = [
      //   {
      //     edit_history_tweet_ids: [ '1884433743344968168' ],
      //     id: '1884433743344968168',
      //     created_at: '2025-01-29T02:49:50.000Z',
      //     text: '@MarinoFourK Yes, decaf coffee was included in this study and also shows health benefits, likely due to the polyphenol content.'
      //   },
      //   {
      //     edit_history_tweet_ids: [ '1884433337743278492' ],
      //     id: '1884433337743278492',
      //     created_at: '2025-01-29T02:48:13.000Z',
      //     text: '@JayWest_01 Yes, I do, and there are plenty of studies showing similar associations of decaffeinated coffee intake with positive health outcomesLikely due to the polyphenol content. \n' +
      //       '\n' +
      //       'For this study specifically the coffee intake included caffeinated and decaf.'
      //   },
      //   {
      //     edit_history_tweet_ids: [ '1884367202188464439' ],
      //     id: '1884367202188464439',
      //     created_at: '2025-01-28T22:25:25.000Z',
      //     text: 'If you’re curious about how the timing of your coffee can impact your health and disease risk, sign up for my email newsletter—it’s going out tomorrow and dives deep into the science behind it.\n' +
      //       '\n' +
      //       'https://t.co/Otr3rMAHi8'
      //   },
      //   {
      //     edit_history_tweet_ids: [ '1884367200380752013' ],
      //     id: '1884367200380752013',
      //     created_at: '2025-01-28T22:25:25.000Z',
      //     text: 'A recent study showed that morning coffee drinkers had a 12% lower risk of all-cause mortality and a 31% lower risk of dying from cardiovascular disease over a 10-year period.\n' +
      //       '\n' +
      //       'This benefit was specific to morning coffee drinkers, as no similar protective effects were observed… https://t.co/tawq963IWt https://t.co/5sCBMljdRc'  },
      //   {
      //     edit_history_tweet_ids: [ '1882517205197484515' ],
      //     id: '1882517205197484515',
      //     created_at: '2025-01-23T19:54:11.000Z',
      //     text: 'The creatine hair loss connection is unsubstantiated and its mechanism implausible.\n' +
      //       '\n' +
      //       "This claim was based on a single study that reported an increase in dihydrotestosterone (DHT)—a metabolite of testosterone—in men who were supplemented with creatine. However, this study didn't… https://t.co/mgvzjNjYcz https://t.co/ja9qEraYLq https://t.co/vizOfkJoeq"
      //   }
      // ]


    const tweetText = tweetsData.data.map((tweet: any) => tweet.text).join("\n");
    // const tweetText = testTweets.map((tweet: any) => tweet.text).join("\n");

    const response = await extractClaimsFromTweets(tweetText)

    const claims = extractJsonFromString(response).claims


    console.log(" the claims, why you not iterable :- ", claims);
     const finalClaimsData:any = await analyzeClaims(claims)

     console.log( " the final claims data", finalClaimsData)

     const trustScore = calculateTrustScore(finalClaimsData)
     console.log( ' the trust score', trustScore)
     
     
     let influencer = await Influencer.findOne({ twitterId: userId });

    if (!influencer) {
      influencer = new Influencer({
        twitterId: userId,
        username: influencerName,
        profileImageUrl,
        bio,
        followerCount: followersCount,
        estimatedYearlyRevenue,
        trustScore,
        claims: [],
        name
      });
    }
    const claimIdsToAdd:any = [];

     for (const claimData of finalClaimsData) {
      let claim = await Claim.findOne({ claimSearchQuery: claimData.claimSearchQuery });

      if (!claim) {
        claim = new Claim({
          text: claimData.text,
          category: claimData.category,
          claimSearchQuery: claimData.claimSearchQuery,
          verificationStatus: claimData.verificationStatus,
          influencer: influencer._id , 
          articles: [],
        });
      }
      if (!claimIdsToAdd.includes(claim._id.toString())) {
        claimIdsToAdd.push(claim._id.toString());
      }
      

     
      if (claimData.articles && claimData.articles.length > 0) {
        for (const articleData of claimData.articles) {
          let article = await Article.findOne({ pubMedId: articleData.pubMedId });

        
          if (!article) {
           
            article = new Article({
              pubMedId: articleData.pubMedId,
              title: articleData.title,
              abstract: articleData.abstract,
              claim: claim._id, 
              link: articleData.link
            });
    
            await article.save(); 
          }
          if (!claim.articles.includes(article._id)) {
            claim.articles.push(article._id);
          }
        }
      }

      await claim.save();
    }

    influencer.claims.push(...claimIdsToAdd);
    await influencer.save();




    return NextResponse.json({ message: "Data received" }, { status: 200 });
  } catch (error) {
    console.error("Error processing data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


const extractClaimsFromTweets = async(tweetText:any)=>{
  const prompt = `
      Extract distinct health-related claims from the following tweets. 
      Remove duplicates or reworded versions of the same claim. 
      Categorize each claim under "Nutrition", "Medicine", or "Mental Health".
      For each claim Generate a concise 'claimSearchQuery' that contains only the essential keywords for searching scientific literature. The claimSearchQuery should exclude unnecessary words and it should be optimized for PubMed searches.
      
      Tweets: """${tweetText}"""
      
      Respond in JSON format as mentioned and do not add any additional text, only the json object :
      { "claims": [{ "text": "Claim text", "category": "Category" , "claimSearchQuery": "Claim search query words separated by '+' sign", }] }
    `;

    const groq = new Groq();
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "deepseek-r1-distill-llama-70b", 
      temperature: 0.6,
      max_completion_tokens: 4096,
      top_p: 0.95,
      stream: false, 
      stop: null,
    });

    return  chatCompletion.choices[0]?.message?.content || "";
}

const fetchArticleIds = async (claimSearchQuery : string ) => {
  const apiKey = '9854aa6c9ca57ea18168f610952f128a8f08'; 
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&api_key=${apiKey}&term=${claimSearchQuery}&retmax=5`;
  
  const res = await fetch(url);
  const data = await res.text(); 
  const parsedData = await xml2js.parseStringPromise(data);

  console.log(" the raw data containing id and stuff" , parsedData)

  console.log(" in fetchArticleIds , the id list is", parsedData.eSearchResult.IdList[0].Id);
  return parsedData.eSearchResult.IdList[0].Id;
};

const fetchArticleContent = async (articleIds : any) => {
  const apiKey = '9854aa6c9ca57ea18168f610952f128a8f08';
  const ids = articleIds.join(',');
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&api_key=${apiKey}&id=${ids}&rettype=abstract&retmode=xml`;
  
  const res = await fetch(url);
  const data = await res.text(); 
  
  const parsedData = await xml2js.parseStringPromise(data);
  return parsedData.PubmedArticleSet.PubmedArticle.map((article:any , index:number) => {

    const title = article.MedlineCitation[0].Article[0].ArticleTitle[0] || "Unknown Title";
    const titleString = typeof title === "object" && title._ ? title._ : title;

    const abstractData = article.MedlineCitation[0].Article[0].Abstract?.[0]?.AbstractText || [];

    const abstract = abstractData
      .map((item: any) => (typeof item === "string" ? item : item._)) 
      .join(" "); 

      return{

    pubMedId: articleIds[index],
    link: `https://pubmed.ncbi.nlm.nih.gov/${articleIds[index]}/`,
    title:titleString,
    abstract: abstract || "",
      }
  });
};


const analyzeClaims = async (claims : any) => {
  const finalClaimsData = [];

  for (const claim of claims) {
    const articleIds = await fetchArticleIds(claim.claimSearchQuery);
    console.log(" the claim is ", claim , " and its article ids are ", articleIds)

    if (!articleIds || articleIds.length === 0) {
      // if we don't find any artilces , we declare the claim as questionable
      finalClaimsData.push({
        text: claim.text,
        category: claim.category,
        claimSearchQuery: claim.claimSearchQuery,
        verificationStatus: "Questionable", 
        articles: [], 
      });
      continue; 
    }


    const articles = await fetchArticleContent(articleIds);
    console.log(' the claim is ', claim , " and its articles are ", articles)
    const combinedAbstracts = articles.map( (article:any) => article.abstract).join("\n\n");
  
    const classification = await analyzeClaimWithGroq(claim.text, combinedAbstracts);

    console.log(" classification from AI ", classification)
    const status = extractJsonFromString(classification)

    finalClaimsData.push({
      text: claim.text,
      category: claim.category,
      claimSearchQuery: claim.claimSearchQuery,
      verificationStatus: status.verificationStatus,
      articles: articles, 
    });

  }
  return finalClaimsData;
};


const analyzeClaimWithGroq = async (claimText:any, combinedArticleAbstracts:any) => {
  const groq = new Groq();
  const prompt = `
    Claim: ${claimText}
    Article abstracts: ${combinedArticleAbstracts}
    
    The article abstracts are combined abstract from multiple scientfic articles. Given this context according to the abstracts, classify the given Claim as one of the following: Verified, Questionable, Debunked. Respond in JSON format as mentioned and do not add any additional text, only the json object :
      { "verificationStatus": "Verified or Questionable or Debunked" } 
  `;

  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "deepseek-r1-distill-llama-70b", 
    temperature: 0.6,
  });

  return chatCompletion.choices[0]?.message?.content || "No classification";
};


const extractJsonFromString = (input:any) => {
  const regex = /```json([\s\S]*?)```/;
  const match = input.match(regex);

  if (match && match[1]) {
    try {
      return JSON.parse(match[1].trim());
    } catch (error) {
      console.error("Error parsing the JSON:", error);
      return null;
    }
  } else {
    console.log("No valid JSON found between triple backticks.");
    return null;
  }
};


const calculateTrustScore = (claims:any) => {
  let score = 0;
  const totalClaims = claims.length;

  if (totalClaims === 0) return 0; 

  claims.forEach((claim:any) => {
    if (claim.verificationStatus === "Verified") {
      score += 1; 
    } else if (claim.verificationStatus === "Questionable") {
      score += 0.5; 
    } 

  });

  return Math.round((score / totalClaims) * 100);
};

const calculateEstimatedYearlyRevenue = (followersCount: number) => {
  const avgCPM = 20; // Estimated $20 per 1000 followers
  const sponsoredPostsPerYear = 24; // I assumed  2 per month based on some web lookups
  
  const estimatedRevenue = (followersCount / 1000) * avgCPM * sponsoredPostsPerYear;
  
  return Math.round(estimatedRevenue); 
};


