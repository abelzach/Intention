"use client";

import { useState, useEffect } from "react";
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
import Link from "next/link";

const networkName = "POLYGON_TESTNET_AMOY";

export default function CreateIntentForm() {
  const [activeTab, setActiveTab] = useState("borrower");
  const { isLoggedIn, getUserDetails, createWallet, logOut } =
    useOkto() as OktoContextType;
  const [email, setEmail] = useState("");
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
      if (!wallet) {
        console.log("PolygonAmoy address not found");
        return;
      }
      const userAddress = wallet.address;

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

        await executeRawTransaction(approveTxData);
        await executeRawTransaction(txData);
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

        await executeRawTransaction(approveTxData);
        await executeRawTransaction(txData);
      }
    } catch (error) {
      console.error("Error creating intent:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const details = await getUserDetails();
        setEmail(details?.email);
        const wallets = await createWallet();
        if (!wallets) await createWallet();
      } catch (error) {
        console.error("Error fetching wallets:", error);
      }
    };

    if (isLoggedIn) fetchData();
  }, [isLoggedIn]);

  return (
    <main className="flex flex-col pt-16 p-6 justify-center items-center w-screen">
      <Card className="w-full max-w-md bg-white shadow-lg border border-gray-300 rounded-md">
        <CardHeader>
          <Tabs
            defaultValue="borrower"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-md">
              <TabsTrigger
                value="borrower"
                className="hover:bg-gray-200 focus:bg-gray-200"
              >
                Borrower
              </TabsTrigger>
              <TabsTrigger
                value="lender"
                className="hover:bg-gray-200 focus:bg-gray-200"
              >
                Lender
              </TabsTrigger>
            </TabsList>
            <TabsContent value="borrower">
              <CardTitle className="text-xl text-center text-black">
                Create an Intent
                <span className="block text-sm text-gray-500">(Borrower)</span>
              </CardTitle>
            </TabsContent>
            <TabsContent value="lender">
              <CardTitle className="text-xl text-center text-black">
                Create an Intent
                <span className="block text-sm text-gray-500">(Lender)</span>
              </CardTitle>
            </TabsContent>
          </Tabs>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tokenAddress" className="text-black">
                Token Address
              </Label>
              <Input
                id="tokenAddress"
                value={formData.tokenAddress}
                onChange={(e) =>
                  setFormData({ ...formData, tokenAddress: e.target.value })
                }
                className="bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter token address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value" className="text-black">
                Value
              </Label>
              <Input
                id="value"
                type="number"
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: Number(e.target.value) })
                }
                className="bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter value"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interest" className="text-black">
                Interest
              </Label>
              <Input
                id="interest"
                type="number"
                value={formData.interest}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    interest: Number(e.target.value),
                  })
                }
                className="bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-500"
                placeholder={activeTab === "borrower" ? "20" : "15"}
              />
            </div>
            {activeTab === "borrower" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="nftId" className="text-black">
                    NFT Id
                  </Label>
                  <Input
                    id="nftId"
                    type="number"
                    value={formData.nftId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nftId: Number(e.target.value),
                      })
                    }
                    className="bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter NFT ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nftAddress" className="text-black">
                    NFT Address
                  </Label>
                  <Input
                    id="nftAddress"
                    value={formData.nftAddress}
                    onChange={(e) =>
                      setFormData({ ...formData, nftAddress: e.target.value })
                    }
                    className="bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter NFT address"
                  />
                </div>
              </>
            )}
            <Button type="submit" className="w-full">
              Confirm Intent
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
