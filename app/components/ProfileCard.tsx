"use client"
import { faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { PrimaryButton, TabButton } from "./Button";
import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import {  useTokens } from "../api/hooks/useToken";
import { TokenList, TokenRowSkeleton } from "./TokenList";

type Tab = "tokens" | "send" | "add_funds" | "swap" | "withdraw"
const tabs: {id: Tab, name: string}[] = [{ id: "tokens", name:  "Token"}, {id: "send", name: "Send"}, {id: "add_funds", name: "Add Funds"}, {id: "swap", name: "Swap"}, {id: "withdraw", name: "Withdraw"}];

export const ProfileCard = ({publicKey}: {
    publicKey: string
}) => {
    const session = useSession()
    const router = useRouter();
    const [selectedtab, setSelectedTab] = useState("tokens")
    if (session.status === "loading") {
        return <ProfileCardSkeleton />
    }

    if (!session.data?.user) {
        router.push("/")
    }
    return (
        <div className="pt-8 flex justify-center">
            <div className="max-w-4xl bg-white rounded shadow-2xl w-full p-16">
                <Greeting
                    image={session.data?.user?.image ?? ""}
                    name={session.data?.user?.name ?? ""}
                />
                <div className="w-full flex">
                    {tabs.map(tab => <TabButton active={tab.name === selectedtab} onClick={() => {
                        setSelectedTab(tab.name)
                    }}>{tab.name.toLocaleUpperCase()}</TabButton>)}
                </div>
                <div className={`${selectedtab === "tokens" ? "visible"  : "hidden"}`}><Assets publicKey={publicKey} />
                </div>
            </div>
        </div>
    )
}
function ProfileCardSkeleton() {
    return (
        <div className="pt-8 flex justify-center">
            <div className="max-w-4xl bg-white rounded shadow-2xl w-full p-16"> 
                <GreetingSkeleton />
                <AssetsSkeleton />
            </div>
        </div>
    );
}
function GreetingSkeleton() {
    return (
        <div className="flex items-center gap-4 mb-8 animate-pulse">
            <div className="w-16 h-16 rounded-full bg-gray-300"></div>
            <div>
                <div className="h-8 w-64 bg-gray-300 rounded"></div>
            </div>
        </div>
    );
}
function AssetsSkeleton() {
    return (
        <div className="pt-4 animate-pulse">
            <div className="h-6 w-40 bg-gray-300 rounded mb-4"></div>
            
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-end gap-2">
                    <div className="h-12 w-32 bg-gray-300 rounded"></div>
                    <div className="h-8 w-16 bg-gray-300 rounded mb-1"></div>
                </div>
                <div className="h-10 w-40 bg-gray-300 rounded"></div>
            </div>

            <div className="space-y-4">
                <TokenRowSkeleton />
                <TokenRowSkeleton />
                <TokenRowSkeleton />
            </div>
        </div>
    );
}


function Greeting({ image, name }: {
    image: string,
    name: string
}) {
    return (
        <div className="flex">
            <Image src={image} width={64} height={64}
            alt={name} className="rounded-full w-15 h-15 mr-4" />
            <div className="text-2xl font-bold  flex flex-col justify-center pb-2 text-slate-600">
                Welcome back, {name}!
            </div>
        </div>
    )
}

function Assets({publicKey}: {
    publicKey: string
}) {
    const [copied, setCopied] = useState(false)
    const {tokenBalances, loading} = useTokens(publicKey);
    useEffect(() => {
        if(copied) {
            let timeout = setTimeout(() => {
                setCopied(false)
            }, 3000)
            return () => {
                clearTimeout(timeout)
            }
        }
    }, [copied])

    if(loading) {
        return <AssetsSkeleton />
    }

    return <div className="text-slate-400 font-semibold pt-4">
        <FontAwesomeIcon icon={faWallet} className="text-slate-400 pr-2"
        ></FontAwesomeIcon>
        Account Assets
        

        <div className="flex justify-between">
            <div className="flex justify-center">
                <div className="pt-2 pb-2 text-5xl font-bold text-black">
                    ${tokenBalances?.totalBalance.toFixed(2)}
                </div>
                <div className="text-3xl text-slate-500 font-bold flex flex-col justify-end pl-1 pb-2">
                    USD
                </div>
            </div>
            <div>
                <PrimaryButton className="cursor-pointer" onClick={() => {
                    navigator.clipboard.writeText(publicKey)
                    setCopied(true)
                }}>{copied ? "Copied" : "Your wallet address"}</PrimaryButton>
            </div>
        </div>

        <div>
            <TokenList tokens={tokenBalances?.tokens || []} />
        </div>
    </div>
}