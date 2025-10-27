"use client"
import { faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { PrimaryButton } from "./Button";
import { useEffect, useState } from "react";


export const ProfileCard = ({publicKey}: {
    publicKey: string
}) => {
    const session = useSession()
    const router = useRouter();
    if (session.status === "loading") {
        return (
            <div>
                Loading....
            </div>
        )
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
                <Assets publicKey={publicKey} />
            </div>
        </div>
    )
}


function Greeting({ image, name }: {
    image: string,
    name: string
}) {
    return (
        <div className="flex">
            <img src={image} className="rounded-full w-15 h-15 mr-4" />
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
    return <div className="text-slate-400 font-semibold pt-4">
        <FontAwesomeIcon icon={faWallet} className="text-slate-400 pr-2"
        ></FontAwesomeIcon>
        Account Assets
        <br />

        <div className="flex justify-between">
            <div>
                
            </div>
            <div>
                <PrimaryButton className="cursor-pointer" onClick={() => {
                    navigator.clipboard.writeText(publicKey)
                    setCopied(true)
                }}>{copied ? "Copied" : "Your wallet address"}</PrimaryButton>
            </div>
        </div>
    </div>
}