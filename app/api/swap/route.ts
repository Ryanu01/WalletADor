import { authConfig } from "@/app/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import db from "@/app/db";
import { Keypair, VersionedTransaction } from "@solana/web3.js";
import { connection } from "@/app/lib/constant";


export async function POST(req: NextRequest) {
    const data: {
        quoteResponse: any
    } = await req.json();

    const session = await  getServerSession(authConfig);
    if(!session?.user) {
        return NextResponse.json({
            message: "You are not logged in"
        }, {
            status: 401
        })
    }

    const solWallet = await db.sOlWallet.findFirst({
        where: {
            userId: session.user.uid
        }
    })

    if(!solWallet) {
        return NextResponse.json({
            message: "Could not find associated quote solana wallet"
        }, {
            status: 404
        })
    }

    const { swapTransaction } = await (
        await fetch('https://lite-api.jup.ag/swap/v1/swap', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                quoteResponse: data.quoteResponse,

                userPublicKey: solWallet.publicKey,

                wrapAndUnWrapSol: true
            })
        })
    ).json();

    const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
    var transaction = VersionedTransaction.deserialize(swapTransactionBuf);

    const privateKey = getPrivateKeyFromDb(solWallet.privateKey)
    transaction.sign([privateKey])

    const latestblockhash = await connection.getLatestBlockhash();

    const rawTransaction = transaction.serialize();
    const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2
    });
    await connection.confirmTransaction({
        blockhash: latestblockhash.blockhash,
        lastValidBlockHeight: latestblockhash.lastValidBlockHeight,
        signature: txid
    });

    return NextResponse.json({
        txid
    })
}


function getPrivateKeyFromDb (privateKey: string) {
    const arr = privateKey.split(",").map(x => Number(x));
    const privateKeyUintArr = Uint8Array.from(arr);
    const keypair = Keypair.fromSecretKey(privateKeyUintArr)
    return keypair;
}