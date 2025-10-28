
import { TokenWithBalance } from "../api/hooks/useToken";

export function TokenList ({tokens}: {
    tokens: TokenWithBalance[]
}) {
    return (
        <div>
            {tokens.map(t => <TokenRow key={t.name} token={t}/>)}
        </div>
    )

}


function TokenRow ({token}: {
    token: TokenWithBalance
}) {
    return <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
            <div>
                <img src={token.image} width={20} height={20} alt={token.name} className="w-10 h-10 rounded-full" />
            </div>
            <div>
                <div className="font-bold">
                    {token.name}
                </div>
                <div className="font-semibold text-gray-600">
                    1{token.name} = ~${Number(token.price).toFixed(2)}
                </div>
            </div>
        </div>
        <div className="text-right">
            <div className="text-2xl font-bold">
                ${Number(token.usdBalance).toFixed(2)}
            </div>
            <div className="text-xl font-medium text-gray-600">
                {Number(token.balance).toFixed(2)}
            </div>
        </div>
    </div>
}

export function TokenRowSkeleton() {
    return (
        <div className="flex justify-between items-center animate-pulse">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-300">
                </div>
                <div>
                    <div className="h-5 w-24 bg-gray-300 rounded mb-2">
                    </div>
                    <div className="h-4 w-32 bg-gray-300 rounded mb-2">
                    </div>
                </div>
            </div>
            <div className="text-right">
                <div className="h-7 w-24 bg-gray-300 rounded mb-2"></div>
                <div className="h-6 w-20 bg-gray-300 rounded"></div>
            </div>
        </div>
    )
}