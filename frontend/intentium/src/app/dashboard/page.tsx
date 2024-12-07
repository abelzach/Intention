"use client";

import { useState, useEffect } from "react";
import { createPublicClient, http, Hex } from "viem";
import { polygonAmoy } from "viem/chains";
import { intentiumAddress } from "../../../../../common/constants";
import intentiumAbi from "../../../../../common/Intentium/Intentium.json";
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

export default function CreateDashBoard() {
  const [borrowerDataState, setBorrowerDataState] = useState({});
  const invoices = [
    {
      ADDRESS: "0x5a3ad_",
      "TOKEN ADDRESS": "120 BetaToken",
      VALUE: "120 BetaToken",
      "INTEREST (%)": 10,
      "NFT ID": 0,
      "NFT ADDRESS": "0x8e83_",
      STATUS: "Completed",
    },
    {
      ADDRESS: "0x5a3ad_",
      "TOKEN ADDRESS": "150 BetaToken",
      VALUE: "150 BetaToken",
      "INTEREST (%)": 15,
      "NFT ID": 1,
      "NFT ADDRESS": "0x8e83_",
      STATUS: "Completed",
    },
    {
      ADDRESS: "0x5a3ad_",
      "TOKEN ADDRESS": "130 BetaToken",
      VALUE: "130 BetaToken",
      "INTEREST (%)": 12,
      "NFT ID": 2,
      "NFT ADDRESS": "0x8e83_",
      STATUS: "Completed",
    },
    {
      ADDRESS: "0x6090c1_",
      "TOKEN ADDRESS": "60 AlphaToken",
      VALUE: "60 AlphaToken",
      "INTEREST (%)": 10,
      "NFT ID": 2,
      "NFT ADDRESS": "0x8e83_",
      STATUS: "Completed",
    },
    {
      ADDRESS: "0x6090c1_",
      "TOKEN ADDRESS": "120 AlphaToken",
      VALUE: "120 AlphaToken",
      "INTEREST (%)": 20,
      "NFT ID": 0,
      "NFT ADDRESS": "0x2884_",
      STATUS: "Completed",
    },
    {
      ADDRESS: "0x6090c1_",
      "TOKEN ADDRESS": "90 AlphaToken",
      VALUE: "90 AlphaToken",
      "INTEREST (%)": 20,
      "NFT ID": 0,
      "NFT ADDRESS": "0x2884_",
      STATUS: "Pending",
    },
    {
      ADDRESS: "0x6090c1_",
      "TOKEN ADDRESS": "190 AlphaToken",
      VALUE: "190 AlphaToken",
      "INTEREST (%)": 20,
      "NFT ID": 0,
      "NFT ADDRESS": "0x2884_",
      STATUS: "Pending",
    },
  ];
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
      <p>Lorem ipsum qwerty qawsedrtyui asdfgtyhj asdfgtyhuj</p>
      <div className="border-2 p-3 w-full h-full">
        <Table className="py-4">
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ADDRESS</TableHead>
              <TableHead>TOKEN ADDRESS</TableHead>
              <TableHead>VALUE</TableHead>
              <TableHead className="text-right">INTEREST (%)</TableHead>
              <TableHead>NFT ID</TableHead>
              <TableHead>NFT ADDRESS</TableHead>
              <TableHead>STATUS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice["NFT ID"]}>
                <TableCell className="font-medium">{invoice.ADDRESS}</TableCell>
                <TableCell>{invoice["TOKEN ADDRESS"]}</TableCell>
                <TableCell>{invoice.VALUE}</TableCell>
                <TableCell>{invoice["INTEREST (%)"]}</TableCell>
                <TableCell>{invoice["NFT ID"]}</TableCell>
                <TableCell>{invoice["NFT ADDRESS"]}</TableCell>
                <TableCell>{invoice.STATUS}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
        </Table>
      </div>
    </main>
  );
}
