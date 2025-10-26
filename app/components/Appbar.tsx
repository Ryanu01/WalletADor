"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { PrimaryButton } from "./Button";
import { useRouter } from "next/navigation";

export const Appbar = () => {
    const Session = useSession();
    const router = useRouter();
    return (
        <div className="border-0 px-2 py-2 flex justify-between">
            <div className="text-3xl flex justify-center pt-1">
                WalletADor
            </div>
            <div>
                {Session.data?.user ? <PrimaryButton className="cursor-pointer" onClick={() => {
                    signOut({ callbackUrl: "/" })
                    
                }}>LogOut</PrimaryButton> : <PrimaryButton className="cursor-pointer" onClick={() => {
                    signIn()
                }}>
                    SignIn
                </PrimaryButton>}
            </div>
        </div>
    )
}