"use client";

import { useState, useEffect } from "react";
import { createPublicClient, http, Hex } from "viem";
import { polygonAmoy } from "viem/chains";
import { intentiumAddress } from "../../../../../../common/constants";
import intentiumAbi from "../../../../../../common/Intentium/Intentium.json";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface BorrowerCollateral {
  nftId: bigint;
  nftAddress: string;
}

interface BorrowerIntent {
  collateral: BorrowerCollateral;
  id: bigint;
  maxInterest: bigint;
  owner: string;
  status: number; // Replace with an enum if there are specific status codes
  tokenAddress: string;
  value: bigint;
}

export default function CreateDashBoard() {
  const [borrowerDataState, setBorrowerDataState] = useState<BorrowerIntent[]>(
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      const publicClient = createPublicClient({
        chain: polygonAmoy,
        transport: http(),
      });

      try {
        const borrowerData = await publicClient.readContract({
          address: intentiumAddress as Hex,
          abi: intentiumAbi.abi,
          functionName: "getBorrowerIntents",
        });
        console.log("BorrowerIntents : ", borrowerData);
        setBorrowerDataState(borrowerData as BorrowerIntent[]);

        const LenderData = await publicClient.readContract({
          address: intentiumAddress as Hex,
          abi: intentiumAbi.abi,
          functionName: "getLenderIntents",
        });
        console.log("LenderIntents : ", LenderData);
      } catch (error) {
        console.error(`Error reading contract `, error);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="flex flex-col pt-16 p-6">
      <h1 className="font-bold text-4xl py-2">Borrower Intents</h1>
      <p>A detailed list of borrower intents fetched from the blockchain:</p>
      <Separator className="my-4" />
      <div className="border-2 p-3 w-full h-full">
        <Table className="py-4">
          <TableCaption>
            A list of borrower intents and their details.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">OWNER</TableHead>
              <TableHead>TOKEN ADDRESS</TableHead>
              <TableHead>VALUE</TableHead>
              <TableHead>MAX INTEREST (%)</TableHead>
              <TableHead>NFT ID</TableHead>
              <TableHead>NFT ADDRESS</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {borrowerDataState.map((intent, index) => (
              <TableRow key={intent.id.toString() || index}>
                <TableCell className="font-medium">{intent.owner}</TableCell>
                <TableCell>{intent.tokenAddress}</TableCell>
                <TableCell>
                  {(BigInt(intent.value) / BigInt(1e18)).toString()} Tokens
                </TableCell>
                <TableCell>{intent.maxInterest.toString()}%</TableCell>
                <TableCell>{intent.collateral.nftId.toString()}</TableCell>
                <TableCell>{intent.collateral.nftAddress}</TableCell>
                <TableCell>
                  {intent.status === 1 ? "Active" : "Completed"}
                </TableCell>
                <TableCell>
                  {intent.status === 1 ? (
                    <Button disabled>
                      <Loader2 className="animate-spin" />
                      Waiting
                    </Button>
                  ) : (
                    <Button className="w-full text-center">Repay</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}
