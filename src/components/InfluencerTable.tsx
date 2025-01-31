"use client";

import * as React from "react";
import {
  useReactTable,
  Row,
  SortingState,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { RadioCards, Flex, Text } from "@radix-ui/themes";
import { TrendingUp, Check, DollarSign , Users} from "lucide-react";

import { getCoreRowModel, getSortedRowModel } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import Image from "next/image";
import InfluencerClaimsTable from "./InfluencerClaimsTable";

interface Claim {
  _id: string;
  articles: { _id: string; link: string }[];
  category: string;
  claimSearchQuery: string;
  influencer: string;
  text: string;
  verificationStatus: string;
  createdAt: string;
  updatedAt: string;
}

interface Influencer {
    bio: string;
  rank: number;
  name: string;
  estimatedYearlyRevenue: number;
  profileImageUrl: string;
  trustScore: number;
  followers: number;
  verifiedClaims: number;
  followerCount: number;
  claims: Claim[];
}

interface InfluencerTableRow {
  rank: number;
  name: string;
  profileImageUrl: string;
  trustScore: number;
  followers: number;
  verifiedClaims: number;
}

const columns: ColumnDef<InfluencerTableRow>[] = [
  {
    accessorKey: "rank",
    header: "Index",
    cell: ({ row }: { row: Row<InfluencerTableRow> }) => (
      <div className="text-center">{row.index + 1}</div>
    ),
  },
  {
    accessorKey: "name",
    header: () => <div> Influencer</div>,
    cell: ({ row }: { row: Row<InfluencerTableRow> }) => (
      <div className="w-full">
        <div className="flex items-center pl-[40%]  space-x-2">
          <Image
            src={row.original.profileImageUrl}
            alt={row.original.name}
            className="h-8 w-8 rounded-full"
            width={32}
            height={32} 
          />
          <div className="max-w-[150px] truncate">{row.original.name}</div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "trustScore",
    header: "Trust Score",
    cell: ({ row }: { row: Row<InfluencerTableRow> }) => (
      <div className={`text-center ${
        row.original.trustScore >= 90
          ? 'text-green-500' 
          : row.original.trustScore >= 50 && row.original.trustScore <= 89
          ? 'text-yellow-500' 
          : 'text-red-500' 
      }`} >
        
        {row.original.trustScore}
      </div>
    ),
  },
  {
    accessorKey: "followers",
    header: "Followers",
    cell: ({ row }: { row: Row<InfluencerTableRow> }) => (
      <div className="text-center">{formatRevenue(row.original.followers)}</div>
    ),
  },
  {
    accessorKey: "verifiedClaims",
    header: "Verified Claims",
    cell: ({ row }: { row: Row<InfluencerTableRow> }) => (
      <div className="text-center">{row.original.verifiedClaims}</div>
    ),
  },
];

interface DataTableProps {
  influencers: Influencer[];
}

export const InfluencerTable: React.FC<DataTableProps> = ({ influencers }) => {
  console.log(" influecers that we have in table componenet", influencers);

  const [influencersData, setInfluencersData] = React.useState<
    InfluencerTableRow[]
  >([]);
  const [selectedInfluencer, setSelectedInfluencer] =
    useState<Influencer | null>(null);

  useEffect(() => {
    const transformedData = influencers.map((influencer, index) => ({
      rank: index + 1,
      name: influencer.name,
      profileImageUrl: influencer.profileImageUrl,
      trustScore: influencer.trustScore,
      followers: influencer.followerCount,
      verifiedClaims: influencer.claims?.length || 0,
    }));
    setInfluencersData(transformedData);
  }, [influencers]);

  const [rowSelection, setRowSelection] = React.useState({});
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data: influencersData,
    columns,
    state: {
      sorting,
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleRowClick = (influencer: Influencer) => {
    setSelectedInfluencer(influencer);
  };

  return (
    <div className="space-y-4 mt-16 overflow-auto max-h-[500px]">
      {/* <DataTableToolbarSessionReports table={table} /> */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="text-center"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => handleRowClick(influencers[row.index])}
                  className="hover:cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center "
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Dialog
        open={selectedInfluencer !== null}
        onOpenChange={(open) => !open && setSelectedInfluencer(null)}
      >
        <DialogContent className="max-w-7xl w-full max-h-[80vh] p-8 rounded-lg shadow-lg overflow-y-auto">
          {selectedInfluencer && (
            <>
              <DialogHeader>
                
                <DialogDescription className="text-lg space-y-4">
                  <div className="flex  justify-center items-center gap-x-16">
                    <div>
                      <Image
                        src={selectedInfluencer.profileImageUrl}
                        alt={selectedInfluencer.name}
                        className="h-32 w-32 rounded-full mx-auto"
                        width={128}
                        height={128}
                      />
                    </div>
                    <div className="flex flex-col gap-y-5 ">
                       <h2 className="font-bold text-4xl  text-[var(--primary)] "> {selectedInfluencer.name}</h2>
                        <p className="text-md ">{selectedInfluencer.bio}</p>
                    </div>
                  </div>

         

        <RadioCards.Root className="w-full " variant="classic" color="teal">
                  <RadioCards.Item
                    value="1"
                    className="h-auto data-[state=checked]:bg-teal-500/20 backdrop-blur-md max-w-64 p-6"
                  >
                    
                    <Flex
                      direction="column"
                      justify="center"
                      align="start"
                      width="100%"
                       
                    >
                      <Flex
                        direction="row"
                        justify="between"
                        gap="8"
                        width="100%"
                        className="py-2"
                      >
                      <Text weight="bold" className="text-2xl ">
                        Trust Score
                      </Text>
                      <TrendingUp className="h-8 w-8 " color="teal" />
                      </Flex>
                      <Text weight="bold" className="text-4xl text-teal-500 py-2">
                      {selectedInfluencer.trustScore}%
                      </Text>
                      <Text className="py-2 text-md">Active Influencers</Text>
                    </Flex>
                  </RadioCards.Item>

                  <RadioCards.Item
                    value="2"
                    className="h-auto data-[state=checked]:bg-teal-500/20 backdrop-blur-md max-w-64 p-6"
                  >
                    
                    <Flex
                      direction="column"
                      justify="center"
                      align="start"
                      width="100%"
                       
                    >
                      <Flex
                        direction="row"
                        justify="between"
                        gap="8"
                        width="100%"
                        className="py-2"
                      >
                      <Text weight="bold" className="text-2xl ">
                        Yearly Revenue
                      </Text>
                      <DollarSign className="h-8 w-8 " color="teal" />
                      </Flex>
                      <Text weight="bold" className="text-4xl text-teal-500 py-2">
                      ${formatRevenue(selectedInfluencer.estimatedYearlyRevenue)}
                      </Text>
                      <Text className="py-2 text-md">Estimated Earnings</Text>
                    </Flex>
                  </RadioCards.Item>

                  <RadioCards.Item
                    value="3"
                    className="h-auto data-[state=checked]:bg-teal-500/20 backdrop-blur-md max-w-64 p-6"
                  >
                    
                    <Flex
                      direction="column"
                      justify="center"
                      align="start"
                      width="100%"
                       
                    >
                      <Flex
                        direction="row"
                        justify="between"
                        gap="8"
                        width="100%"
                        className="py-2"
                      >
                      <Text weight="bold" className="text-2xl ">
                        Followers
                      </Text>
                      <Users className="h-8 w-8 " color="teal" />
                      </Flex>
                      <Text weight="bold" className="text-4xl text-teal-500 py-2">
                      {formatRevenue(selectedInfluencer.followerCount)}
                      </Text>
                      <Text className="py-2 text-md">Total Following</Text>
                    </Flex>
                  </RadioCards.Item>

                  <RadioCards.Item
                    value="4"
                    className="h-auto data-[state=checked]:bg-teal-500/20 backdrop-blur-md max-w-64 p-6"
                  >
                    
                    <Flex
                      direction="column"
                      justify="center"
                      align="start"
                      width="100%"
                       
                    >
                      <Flex
                        direction="row"
                        justify="between"
                        gap="8"
                        width="100%"
                        className="py-2"
                      >
                      <Text weight="bold" className="text-2xl ">
                        Verified Claims
                      </Text>
                      <Check className="h-8 w-8 " color="teal" />
                      </Flex>
                      <Text weight="bold" className="text-4xl text-teal-500 py-2">
                      {selectedInfluencer.verifiedClaims || 0}
                      </Text>
                      <Text className="py-2 text-md">From scientific journals</Text>
                    </Flex>
                  </RadioCards.Item>

                  
                </RadioCards.Root>

                </DialogDescription>
              </DialogHeader>


              <h2 className="text-3xl mt-16  text-center">Claims from {selectedInfluencer.name}</h2>
              <InfluencerClaimsTable influencer={selectedInfluencer}/>
              
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};


const formatRevenue = (revenue:any) => {
    if (revenue >= 1_000_000) {
      return (revenue / 1_000_000).toFixed(1) + 'M'; 
    } else if (revenue >= 1_000) {
      return (revenue / 1_000).toFixed(1) + 'K'; 
    }
    return revenue; 
  };