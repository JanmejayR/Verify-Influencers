import { Table,  TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

interface Article {
    _id: string;
    link: string;
  }
  
  interface Claim {
    _id: string;
    text: string;
    category: string;
    verificationStatus: string;
    articles: Article[];
  }
  
  interface Influencer {
    name: string;
    claims: Claim[];
  }
  
  interface InfluencerClaimsTableProps {
    influencer: Influencer;
  }

  
const InfluencerClaimsTable: React.FC<InfluencerClaimsTableProps>  = ({influencer}) => {
  return ( 
    <Table>
    
    <TableHeader>
      <TableRow>
        <TableHead className="w-[100px]">Index</TableHead>
        <TableHead>Claim</TableHead>
        <TableHead>Category</TableHead>
        <TableHead>Verification Status</TableHead>
        <TableHead>Article Links</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {influencer.claims?.length > 0 ? (
        influencer.claims.map((claim, index) => (
          <TableRow key={claim._id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{claim.text}</TableCell>
            <TableCell>{claim.category}</TableCell>
            <TableCell className={claim.verificationStatus === 'Verified' ? 'text-teal-500' :  claim.verificationStatus === 'Questionable' ? 'text-yellow-500' : 'text-red-500 '} >{claim.verificationStatus}</TableCell>
            <TableCell>
              {claim.articles.map((article, idx) => (
                <div key={article._id}>
                  <a href={article.link} target="_blank" rel="noopener noreferrer">
                    Article {idx + 1}
                  </a>
                </div>
              ))}
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={5} className="h-24 text-center">
            No claims available.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
  );
};

export default InfluencerClaimsTable;
