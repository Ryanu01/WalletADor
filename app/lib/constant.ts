import { Connection } from "@solana/web3.js"
import axios from "axios";
import { SUPPORTED_TOKENS } from "./tokens";


let LAST_UPDATED: number | null = null;6
let prices: {
    [key: string]: {
        usdPrice: number
    }
} = {}
const TOKEN_PRICE_REFERESH_INTERVAl = 60 * 1000




export const connection = new Connection(process.env.RPC_URL ?? "");


export async function getSupportedTokens() {
    // Always fetch prices on first call
    if (!LAST_UPDATED || new Date().getTime() - LAST_UPDATED > TOKEN_PRICE_REFERESH_INTERVAl) {
        try {

            const response = await axios.get("https://lite-api.jup.ag/price/v3?ids=Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB,EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v,So11111111111111111111111111111111111111112")

            const data = response.data;
            prices = {
                "USDC": data["EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"],
                "USDT": data["Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"],
                "SOL": data["So11111111111111111111111111111111111111112"]
            }

            LAST_UPDATED = new Date().getTime()
        } catch (error) {
            console.log(error);
        }
    }

    // Only return after prices are guaranteed to be loaded
    return SUPPORTED_TOKENS.map(s => ({
        ...s,
        price: prices[s.name]?.usdPrice?.toString() ?? "0"
    }))
}
// getSupportedTokens()