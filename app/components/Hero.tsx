"use client"

import { signIn, useSession } from "next-auth/react";
import { SecondaryButton } from "./Button"
import { useRouter } from "next/navigation";

export const Hero = () => {
    const Session = useSession();
    const router = useRouter(); 
    return (
        <div>
            <div className="text-5xl font-medium flex justify-center">
                <span>
                The Indain crypto of tomorrow,
                </span>
                <span className="text-blue-500 pl-3">
                    today
                </span>

            </div>
                <div className="flex justify-center pt-4 text-2xl text-slate-500">
                    Create a frictionless wallet from India with just a Google Account.
                </div>
                <div className="flex justify-center pt-1 text-2xl text-slate-500">
                    Convert INR to Crypto in one click
                </div>
                <div className="pt-8 flex justify-center ">
                    {Session.data?.user ? <SecondaryButton className="cursor-pointer" onClick={() => {
                        router.push("/dashboard")
                    }}>
                        Go to Dashboard
                        
                    </SecondaryButton> : <SecondaryButton className="cursor-pointer" onClick={() => {
                        signIn("google")

                    }}>
                        Login With Google
                        
                    </SecondaryButton> }
                    
                </div>
        </div>
    )
} 