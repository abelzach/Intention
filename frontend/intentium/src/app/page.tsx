"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useOkto, OktoContextType } from "okto-sdk-react";
import { EmailOTPVerification } from "@/components/emailOTPVerification";
import { createPublicClient, http, Hex } from "viem";
import { polygonAmoy } from "viem/chains";
import { intentiumAddress } from "../../../../common/constants";
import intentiumAbi from "../../../../common/Intentium/Intentium.json";
import { useRouter } from "next/navigation";

export default function Page() {
  const [activeTab, setActiveTab] = useState<"INTENTIUM" | "LOGIN">(
    "INTENTIUM"
  );
  const { isLoggedIn, getUserDetails, createWallet, logOut } =
    useOkto() as OktoContextType;
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const wallets = await createWallet();

        if (!wallets) {
          await createWallet();
        }
      } catch (error) {
        console.error("Error fetching wallets:", error);
      }
    };

    if (isLoggedIn) fetchData();
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/dashboard/providers");
    }
  }, [isLoggedIn, router]);

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
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white text-black font-bold">
      <header className="p-6 flex justify-between items-center border-b border-gray-700">
        Intentify
      </header>
      <main className="flex flex-col items-center justify-center pt-16 p-6 text-center">
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-black">
            Welcome to Intentium
          </h1>
          <p className="text-lg md:text-xl font-semibold mb-8 max-w-xl mx-auto text-gray-400">
            Revolutionizing crypto transactions with AI-powered solutions.
            Secure your intents and make the most of your digital assets.
          </p>
        </div>
        {isLoggedIn ? (
          <div className="w-4/5 rounded-lg">
            <EmailOTPVerification
              onVerificationSuccess={() =>
                console.log("Verification successful")
              }
              onVerificationError={(error) =>
                console.error("Verification failed:", error)
              }
            />
          </div>
        ) : null}
      </main>
    </div>
  );
}
