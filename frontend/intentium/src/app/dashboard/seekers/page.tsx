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
import { useOkto, OktoContextType } from "okto-sdk-react";
import { approveToken, repayIntent } from "@/lib/transaction";

const networkName = "POLYGON_TESTNET_AMOY";

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

interface SolutionIntent {
  borrowerIntentId: bigint;
  dueTimestamp: Date;
  id: string;
  interest: number;
  lenderIntentId: string;
}

export default function CreateDashBoard() {
  const { getWallets, executeRawTransaction } = useOkto() as OktoContextType;
  const [solutionsData, setSolutionsData] = useState<SolutionIntent[]>([]);
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
      } catch (error) {
        console.error(`Error reading contract `, error);
      }
    };
    fetchData();
  }, []);

  const repay = async (tokenAddress: Hex, value: number, solution: any) => {
    console.log("Solution ID : ", solution);
    console.log("Value : ", value);

    const interestAmount: number =
      (Number(value) * Number(solution.interest)) / 100;
    const repaymentAmount = Number(value) + interestAmount;

    const wallets = await getWallets();
    const wallet = wallets.wallets.find(
      (wallet) => wallet.network_name === networkName
    );
    console.log(wallets);
    if (!wallet) {
      console.log("PolygonAmoy address not found");
      return;
    }
    const userAddress = wallet.address;
    console.log("userAddress : ", userAddress);

    const approveTxData = await approveToken(
      userAddress,
      repaymentAmount,
      tokenAddress
    );

    await executeRawTransaction(approveTxData).then((result) => {
      console.log("Transaction submitted", result);
    });

    const repay = await repayIntent(userAddress, solution.id);

    await executeRawTransaction(repay).then((result) => {
      console.log("Transaction submitted for repay", result);
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const publicClient = createPublicClient({
        chain: polygonAmoy,
        transport: http(),
      });

      try {
        const solutionData = await publicClient.readContract({
          address: intentiumAddress as Hex,
          abi: intentiumAbi.abi,
          functionName: "getSolutions",
        });
        console.log("solutionData : ", solutionData);
        setSolutionsData(solutionData as SolutionIntent[]);
      } catch (error) {
        console.error(`Error reading contract `, error);
      }
    };
    fetchData();
  }, []);

  function findSolutionByLender(id: BigInt) {
    const solution = solutionsData.find(
      (item) => BigInt(item.lenderIntentId) == id
    );
    return solution;
  }

  return (
    <main className="flex flex-col pt-16 p-6">
      <h1 className="font-bold text-4xl py-2">Seeker Intents</h1>
      <p>A detailed list of seeker intents fetched from the blockchain:</p>
      <Separator className="my-4" />
      <div className="border-2 p-3 w-full h-full">
        <Table className="py-4">
          <TableCaption>
            A list of seeker intents and their details.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold text-left">OWNER</TableHead>
              <TableHead className="font-bold text-left">
                TOKEN ADDRESS
              </TableHead>
              <TableHead className="font-bold text-left">VALUE</TableHead>
              <TableHead className="font-bold text-left">NFT ID</TableHead>
              <TableHead className="font-bold text-left">NFT ADDRESS</TableHead>
              <TableHead className="font-bold text-left">STATUS</TableHead>
              <TableHead className="font-bold text-left">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {borrowerDataState.map((intent, index) => (
              <TableRow key={intent.id.toString() || index}>
                <TableCell className="font-medium">{`${intent.owner.substring(0, 18)}...`}</TableCell>
                <TableCell>{`${intent.tokenAddress.substring(0, 18)}...`}</TableCell>
                <TableCell>
                  {(BigInt(intent.value) / BigInt(1e18)).toString()} Tokens
                </TableCell>
                <TableCell>{intent.maxInterest.toString()}%</TableCell>
                <TableCell>{intent.collateral.nftId.toString()}</TableCell>
                <TableCell>{`${intent.collateral.nftAddress.substring(0, 18)}...`}</TableCell>
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
                    <Button
                      onClick={() =>
                        repay(
                          intent.tokenAddress as Hex,
                          Number(intent.value),
                          findSolutionByLender(intent.id)
                        )
                      }
                      className="w-full text-center"
                    >
                      Repay
                    </Button>
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
