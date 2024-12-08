"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { EmailOTPVerification } from "@/components/emailOTPVerification";
import { createPublicClient, http, Hex } from "viem";
import { polygonAmoy } from "viem/chains";
import { intentiumAddress } from "../../../../common/constants";
import intentiumAbi from "../../../../common/Intentium/Intentium.json";
import { useRouter } from "next/navigation";
import AnimatedGradientText from "@/components/ui/animated-gradient-text";
import { cn } from "@/lib/utils";
import GridPattern from "@/components/ui/grid-pattern";
import Globe from "@/components/ui/globe";
import { useOkto, OktoContextType } from "okto-sdk-react";

export default function Page() {
  const [activeTab, setActiveTab] = useState<"INTENTIUM" | "LOGIN">(
    "INTENTIUM"
  );
  const { isLoggedIn, createWallet } =
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
    <div className="min-h-screen text-black font-bold">
      <GridPattern
        width={50}
        height={50}
        x={-1}
        y={-1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] "
        )}
      />
      <header className="p-6 flex justify-between items-center border-b border-gray-300">
        Intentify
      </header>
      <main className="flex flex-col items-center justify-center pt-4 p-6 text-center">
        <div>
          <div className="z-10 flex py-10 items-center justify-center">
            <AnimatedGradientText>
              🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />{" "}
              <span
                className={cn(
                  `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`
                )}
              >
                Powered by okto
              </span>
              <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
            </AnimatedGradientText>
          </div>
          <h1 className="text-xl md:text-xl font-extrabold mb-4 text-black">
            <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-400 bg-clip-text text-center text-7xl font-medium leading-none text-transparent dark:from-white dark:to-slate-900/10">
              Bridging gaps one intent at a time
            </span>
          </h1>
          <p className="text-2xl md:text-2xl font-medium mb-8 max-w-4xl mx-auto text-gray-400">
            A decentralized platform that facilitates seamless matching of
            financial intents between users, ensuring secure and
            efficient transactions
          </p>
        </div>
        {!isLoggedIn ? (
          <div className="w-2/5 rounded-lg">
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
        <Globe className="top-[450px]" />
      </main>
    </div>
  );
}
