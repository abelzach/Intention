"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useOkto, OktoContextType } from "okto-sdk-react";
import { EmailOTPVerification } from "@/components/emailOTPVerification";
import ShimmerButton from "@/components/ui/shimmer-button";
import UserForm from "./userForm/page";
import { createPublicClient, http, Hex } from "viem";
import { polygonAmoy } from "viem/chains";
import { intentiumAddress } from "../../../../common/constants";
import intentiumAbi from "../../../../common/Intentium/Intentium.json";

export default function Page() {
  const [activeTab, setActiveTab] = useState<"INTENTIUM" | "LOGIN">(
    "INTENTIUM"
  );
  const { isLoggedIn, getUserDetails, createWallet, logOut } =
    useOkto() as OktoContextType;
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const details = await getUserDetails();
        setEmail(details?.email);
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-gray-200">
      <header className="p-6 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center gap-4">
          {email ? (
            <div className="px-4 py-2 bg-gray-800 rounded-lg shadow-sm">
              <span className="text-sm font-medium">{email}</span>
            </div>
          ) : (
            <div className="px-4 py-2 bg-gray-800 rounded-lg shadow-sm" />
          )}
          <div className="px-4 py-2 bg-gray-800 rounded-lg flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isLoggedIn ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-sm font-medium">
              {isLoggedIn ? "Logged In" : "Not Logged In"}
            </span>
          </div>
          <Link href="/userForm">
            <span>Login</span>
          </Link>
          <Link href="/dashboard">
            <span>Dashboard</span>
          </Link>
        </div>
        <button
          disabled={!isLoggedIn}
          onClick={() => logOut()}
          className="px-5 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Logout
        </button>
      </header>
      <main className="flex flex-col items-center justify-center pt-16 p-6 text-center">
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-gray-100">
            Welcome to Intentium
          </h1>
          <p className="text-lg md:text-xl font-semibold mb-8 max-w-xl mx-auto text-gray-400">
            Revolutionizing crypto transactions with AI-powered solutions.
            Secure your intents and make the most of your digital assets.
          </p>
          <ShimmerButton className="shadow-2xl">
            <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
              Get Started
            </span>
          </ShimmerButton>
        </div>
      </main>
    </div>
  );
}
