import { NextRequest, NextResponse } from "next/server";
import { getAssociatedTokenAddress, getAccount, getMint } from "@solana/spl-token";
import { connection, getSupportedTokens } from "@/app/lib/constant";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
export async function GET(req: NextRequest) {
    const {searchParams} = new URL(req.url);
    const address = searchParams.get('address') as string;    
    const supportedTokens = await getSupportedTokens();
    const balance = await Promise.all(supportedTokens.map(token =>   getAccountBalance(token, address)))
    const tokens =  supportedTokens.map((token, index) => ({
            ...token,
            balance: balance[index],
            usdBalance: balance[index] * Number(token.price)
        }))
    return NextResponse.json({
        tokens,
        totalBalance: tokens.reduce((acc, val) => acc + val.usdBalance, 0)
    })
} 

async function getAccountBalance(token: {
    name: string,
    mint: string,
    native: boolean
}, address: string) {

    if(token.native) {
        let balance = await connection.getBalance(new PublicKey(address))
        return balance / LAMPORTS_PER_SOL;
    }

    try {
        const ata = await getAssociatedTokenAddress(new PublicKey(token.mint), new PublicKey(address))
        const balance = await connection.getTokenAccountBalance(ata);
        return Number(balance.value.uiAmount || 0);
    } catch (error: any) {
        // If account doesn't exist, return 0 balance
        if (error.message?.includes('could not find account')) {
            return 0;
        }
        throw error;
    }
}