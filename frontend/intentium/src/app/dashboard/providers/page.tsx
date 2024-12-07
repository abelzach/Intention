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
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Collateral {
  nftId: bigint;
  nftAddress: string;
}

interface ProviderIntent {
  id: bigint;
  minInterest: bigint;
  owner: string;
  status: number;
  tokenAddress: string;
  value: bigint;
  collateral: Collateral;
}

export default function CreateDashBoard() {
  const [providerDataState, setProviderDataState] = useState<ProviderIntent[]>(
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
        setProviderDataState(borrowerData as ProviderIntent[]);
      } catch (error) {
        console.error(`Error reading contract `, error);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="flex flex-col pt-16 p-6">
      <h1 className="font-bold text-4xl py-2">Provider Intents</h1>
      <p>A detailed list of provider intents fetched from the blockchain:</p>
      <Separator className="my-4" />
      <div className="border-2 p-3 w-full h-full">
        <Table className="py-4">
          <TableCaption>
            A list of provider intents and their details.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableCell className="font-bold text-left">OWNER</TableCell>
              <TableCell className="font-bold text-left">
                TOKEN ADDRESS
              </TableCell>
              <TableCell className="font-bold text-left">
                VALUE (Tokens)
              </TableCell>
              <TableCell className="font-bold text-left">
                MIN INTEREST (%)
              </TableCell>
              <TableCell className="font-bold text-left">NFT ID</TableCell>
              <TableCell className="font-bold text-left">NFT ADDRESS</TableCell>
              <TableCell className="font-bold text-left">STATUS</TableCell>
              <TableCell className="font-bold text-left">ACTIONS</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {providerDataState.map((intent) => (
              <TableRow key={intent.id.toString()}>
                <TableCell className="font-medium">{intent.owner}</TableCell>
                <TableCell>{intent.tokenAddress}</TableCell>
                <TableCell>
                  {(intent.value / BigInt(1e18)).toString()} Tokens
                </TableCell>
                <TableCell>{intent?.minInterest?.toString()}%</TableCell>
                <TableCell>{intent.collateral.nftId.toString()}</TableCell>
                <TableCell>{intent.collateral.nftAddress}</TableCell>
                <TableCell>
                  {intent.status === 1 ? "Active" : "Completed"}
                </TableCell>
                <TableCell>
                  {intent.status === 1 ? (
                    <Button disabled className="flex items-center">
                      <Loader2 className="animate-spin mr-2" />
                      Waiting
                    </Button>
                  ) : (
                    <Button className="w-full text-center">Claim</Button>
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
