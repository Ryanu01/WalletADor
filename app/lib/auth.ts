import GoogleProvider from "next-auth/providers/google";
import db from "@/app/db"
import { Keypair } from "@solana/web3.js";
import NextAuth from "next-auth";

import { Session } from "next-auth";


export interface session extends Session {
    user: {
        email: string,
        name: string,
        image: string,
        uid: string
    }
}

export const authConfig = {
    secret: process.env.NEXTAUTH_SECRET ?? "",
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        })
    ],
    callbacks: {
        session: ({ session, token}: any): session => {
            const newSession: session = session as session;
            if(newSession.user && token.uid) {
                newSession.user.uid = token.uid
            }
            return newSession
        }, 
        async jwt({ token, account, profile}: any) {
            const user = await db.user.findFirst({
                where: {
                    sub: account?.providerAccountId ?? ""
                }
            })
            if(user) {
                token.uid = user.id
            }
            return token
        },
        async signIn({ user, account, profile, email, credentials }: any) {
            if(account?.provider === "google") {
                const email = user.email;
                if(!email) {
                    return false
                }
                
                
                const userDB = await db.user.findFirst({
                    where: {
                        username: email
                    }
                })  

                if(userDB) {
                    return true
                }

                const keypair = Keypair.generate();
                const publicKey = keypair.publicKey.toBase58();
                const privateKey = keypair.secretKey; 
                
                await db.user.create({
                    data: {
                        username: email,
                        profiePicture: user.image,
                        name: profile?.name,
                        provider: "google",
                        sub: account?.providerAccountId,
                        SolWallet: {
                            create: {
                                publicKey: publicKey,
                                privateKey: privateKey.toString()
                            }
                        },
                        InrWallet: {
                            create: {
                                balance: 0
                            }
                        }
                    }
                })
                return true

            }
            return false
        }
    }
}