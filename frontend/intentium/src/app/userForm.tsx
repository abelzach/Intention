"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateIntentForm() {
  const [activeTab, setActiveTab] = useState("borrower");
  const [formData, setFormData] = useState({
    tokenAddress: "",
    value: "",
    interest: "",
    nftId: "",
    nftAddress: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
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
                setFormData({ ...formData, value: e.target.value })
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
                setFormData({ ...formData, interest: e.target.value })
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
                    setFormData({ ...formData, nftId: e.target.value })
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
