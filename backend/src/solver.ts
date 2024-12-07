import 'dotenv/config';
import { createWalletClient, getContract, Hex, http, publicActions } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { polygonAmoy } from 'viem/chains'
import intentiumAbi from '../../common/Intentium/Intentium.json'
import { Status } from './types';
//@ts-ignore
import { intentiumAddress } from '../../common/constants';

const privateKey = process.env.PRIVATE_KEY as Hex;

const account = privateKeyToAccount(privateKey)

const client = createWalletClient({
    account,
    chain: polygonAmoy,
    transport: http()
}).extend(publicActions)


const contract = getContract({
    abi: intentiumAbi.abi,
    address: intentiumAddress,
    client,
})

async function getLendersIntents() {
    const data = await client.readContract( {
        address: contract.address,
        abi: contract.abi,
        functionName: "getLenderIntents"
    }) as any[];
    return data.filter((lender) => lender.status == Status.Pending);
}

async function getBorrowerIntents() {
    const data = await client.readContract( {
        address: contract.address,
        abi: contract.abi,
        functionName: "getBorrowerIntents"
    }) as any[];
    return data.filter((lender) => lender.status == Status.Pending);
}

async function findSolutions() {
    const lenders = await getLendersIntents();
    const borrowers = await getBorrowerIntents();

    const matchedPairs: Array<{ lender: any, borrower: any }> = [];

    for (const lender of lenders) {
        for (const borrower of borrowers) {
            if (lender.tokenAddress === borrower.tokenAddress &&
                borrower.maxInterest >= lender.minInterest) {
                matchedPairs.push({ lender, borrower });
                borrowers.splice(borrowers.indexOf(borrower), 1);
                break;
            }
        }
    }
    await sendSolutions(matchedPairs);
}

async function sendSolutions(matchedPairs: Array<{ lender: any, borrower: any }>) {
    if (matchedPairs.length <= 0) {
        console.log("### No Matches Found ###");
        return;
    }
    let errorCount = 0;
    console.log("#### Sending Solutions " + matchedPairs.length + " ###");
    matchedPairs.forEach(async ({lender, borrower}) => {
        try {
            const { request } = await client.simulateContract({
                address: contract.address,
                abi: contract.abi,
                functionName: "solve",
                args: [
                    BigInt(borrower.id),
                    BigInt(lender.id)
                ]
            })
            const data = await client.writeContract(request)
            console.log("Success: " + data);
        } catch (error: any) {
            errorCount += 1;
            console.log("Error #" + errorCount, ":", error.details);
        }
    })
}

export async function solveIntents() {
    while (true) {
        await findSolutions();
        await new Promise(resolve => setTimeout(resolve, 10000));
    }
}
