import erc20Abi from "../../../../common/ERC20/CustomERC20.json";
import { intentiumAddress } from "../../../../common/constants";
import intentiumAbi from "../../../../common/Intentium/Intentium.json";

import tokenTroveBroadcast from "../../../../foundry/broadcast/DeployIntentium.s.sol/80002/run-latest.json"
import { ExecuteRawTransaction } from "okto-sdk-react";
import { encodeFunctionData } from "viem";

const LoanIntentContractAddress = tokenTroveBroadcast.receipts[0].contractAddress;

const networkName = "POLYGON_TESTNET_AMOY";

export function approveToken(userAddress: string, nfid: number, nftAddress: string): ExecuteRawTransaction {
    const encodedCall = encodeFunctionData({
        abi: erc20Abi.abi,
        functionName: "approve",
        args: [LoanIntentContractAddress, BigInt(nfid)],
    });
    const transactionData = {
      from: userAddress,
      to: nftAddress,
      data: encodedCall,
    };
    return {
        network_name: networkName,
        transaction: transactionData,
    };
}

export function createBorrowerIntent(userAddress: string, tokenAddress: string, amount: number, interest:number, nftId:number, nftAddress: string): ExecuteRawTransaction {
    const encodedCall = encodeFunctionData({
        abi: intentiumAbi.abi,
        functionName: "createBorrowerIntent",
        args: [tokenAddress, BigInt(amount*(10**18)), interest, nftId, nftAddress],
    });
    const transactionData = {
      from: userAddress,
      to: intentiumAddress,
      data: encodedCall,
    };
    return {
        network_name: networkName,
        transaction: transactionData,
    };
}
