"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  approveNFT,
  approveToken,
  createBorrowerIntent,
  createLenderIntent,
} from "@/lib/transaction";
import { useOkto, OktoContextType } from "okto-sdk-react";

const networkName = "POLYGON_TESTNET_AMOY";

export default function CreateIntentForm() {
  const [activeTab, setActiveTab] = useState("borrower");
  const [formData, setFormData] = useState({
    tokenAddress: "",
    value: 0,
    interest: 0,
    nftId: 0,
    nftAddress: "",
  });
  const { getWallets, executeRawTransaction } = useOkto() as OktoContextType;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
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

      if (activeTab === "borrower") {
        const approveTxData = await approveNFT(
          userAddress,
          formData.nftId,
          formData.nftAddress
        );

        const txData = await createBorrowerIntent(
          userAddress,
          formData.tokenAddress,
          formData.value,
          formData.interest,
          formData.nftId,
          formData.nftAddress
        );

        await executeRawTransaction(approveTxData).then((result) => {
          console.log("Transaction submitted", result);
        });
        await executeRawTransaction(txData).then((result) => {
          console.log("Transaction submitted for createBorrowerIntent", result);
        });
      } else {
        const approveTxData = await approveToken(
          userAddress,
          formData.value,
          formData.tokenAddress
        );

        const txData = await createLenderIntent(
          userAddress,
          formData.tokenAddress,
          formData.value,
          formData.interest
        );

        await executeRawTransaction(approveTxData).then((result) => {
          console.log("Transaction submitted", result);
        });
        await executeRawTransaction(txData).then((result) => {
          console.log("Transaction submitted for createLenderIntent", result);
        });
      }
    } catch (error) {
      console.error("Error creating intent:", error);
    }
  };

  return (
    <Card className="w-full max-w-md bg-[#1a1b1e] border-gray-800">
      <CardHeader>
        <Tabs
          defaultValue="borrower"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2 bg-[#2a2b2e]">
            <TabsTrigger value="borrower">Borrower</TabsTrigger>
            <TabsTrigger value="lender">Lender</TabsTrigger>
          </TabsList>
          <TabsContent value="borrower">
            <CardTitle className="text-xl text-center">
              Create an Intent
              <span className="block text-sm text-muted-foreground">
                (Borrower)
              </span>
            </CardTitle>
          </TabsContent>
          <TabsContent value="lender">
            <CardTitle className="text-xl text-center">
              Create an Intent
              <span className="block text-sm text-muted-foreground">
                (Lender)
              </span>
            </CardTitle>
          </TabsContent>
        </Tabs>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tokenAddress">Token Address</Label>
            <Input
              id="tokenAddress"
              value={formData.tokenAddress}
              onChange={(e) =>
                setFormData({ ...formData, tokenAddress: e.target.value })
              }
              className="bg-[#2a2b2e] border-0"
              placeholder="87541b6e34148ab86094edbf58ef5fdb6adf"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Value</Label>
            <Input
              id="value"
              type="number"
              value={formData.value}
              onChange={(e) =>
                setFormData({ ...formData, value: Number(e.target.value) })
              }
              className="bg-[#2a2b2e] border-0"
              placeholder="190"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="interest">Interest</Label>
            <Input
              id="interest"
              type="number"
              value={formData.interest}
              onChange={(e) =>
                setFormData({ ...formData, interest: Number(e.target.value) })
              }
              className="bg-[#2a2b2e] border-0"
              placeholder={activeTab === "borrower" ? "20" : "15"}
            />
          </div>
          {activeTab === "borrower" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="nftId">NFT Id</Label>
                <Input
                  id="nftId"
                  type="number"
                  value={formData.nftId}
                  onChange={(e) =>
                    setFormData({ ...formData, nftId: Number(e.target.value) })
                  }
                  className="bg-[#2a2b2e] border-0"
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nftAddress">NFT Address</Label>
                <Input
                  id="nftAddress"
                  value={formData.nftAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, nftAddress: e.target.value })
                  }
                  className="bg-[#2a2b2e] border-0"
                  placeholder="ec88cb7e0b5c48287d26cb3377e88a3cb5"
                />
              </div>
            </>
          )}
          <Button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600"
          >
            Confirm Intent
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
