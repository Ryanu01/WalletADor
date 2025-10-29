"use client";
import { useState } from "react";
import { SUPPORTED_TOKENS, TokenDetails } from "../lib/tokens";
import { TokenWithBalance } from "../api/hooks/useToken";

export function Swap({ publicKey, tokenBalances }: {
   publicKey: string;
   tokenBalances:{
        totalBalance :number,
        tokens: TokenWithBalance[]
    } | null; 
  }) {
  const [baseAsset, setBaseAsset] = useState(SUPPORTED_TOKENS[0]);
  const [quoteAsset, setQuoteAsset] = useState(SUPPORTED_TOKENS[2]);
  return (
    <div className="p-5">
      <div className="text-2xl font-bold pb-2 text-slate-600">
          Swap Tokens
      </div>
      <SwapInputRow
        onSelect={(asset) => {
          setBaseAsset(asset);
        }}
        selectedToken={baseAsset}
        title={"You Pay:"} 
        topBorderEnable={true} bottomBorderEnable={false}
        subtitle={`Current balance: ${Number(tokenBalances?.tokens.find(x => x.name === baseAsset.name)?.balance).toFixed(2)} ${baseAsset.name}`}
      />
      <div className="flex justify-center">
        <div onClick={() => {
          let baseAssetTemp = baseAsset;
          setBaseAsset(quoteAsset)
          setQuoteAsset(baseAsset)
        }} className="cursor-pointer rounded-full w-10 h-10 border absolute -mt-5 bg-white flex justify-center pt-2  hover:bg-gray-200 ">
            <SwapIcon />
        </div>
      </div>
      <SwapInputRow
        onSelect={(asset) => {
          setQuoteAsset(asset);
        }}
        selectedToken={quoteAsset}
        title={"You Receive:"}
        topBorderEnable={false} bottomBorderEnable={true}
        subtitle={`Current balance: ${Number(tokenBalances?.tokens.find(x => x.name === quoteAsset.name)?.balance).toFixed(2)} ${quoteAsset.name}`}
      />
    </div>
  );
}

function SwapInputRow({
  onSelect,
  selectedToken,
  title,
  topBorderEnable,
  bottomBorderEnable,
  subtitle
}: {
  onSelect: (asset: TokenDetails) => void;
  selectedToken: TokenDetails;
  title: string;
  topBorderEnable: boolean;
  bottomBorderEnable: boolean;
  subtitle?: string;
}) {
  return (
    <div className={`border flex justify-between p-4 rounded-xl ${topBorderEnable ? "rounded-t-xl" : ""} ${bottomBorderEnable ? "rounded-b-xl" : ""}`}>
      <div>
        <div className="text-slate-500 font-bold text-sm pb-1">
          {title}
        </div>
        <AssetSelector selectedToken={selectedToken} onSelect={onSelect}/>
        {subtitle}
      </div>
    </div>
  );
}

function AssetSelector({ selectedToken, onSelect  }: {
    selectedToken: TokenDetails;
    onSelect: (asset: TokenDetails) => void;

 }) {
  return (
    <div>
      <select value={selectedToken.name} onChange={(e) => {
        const selectedToken = SUPPORTED_TOKENS.find(x => x.name === e.target.value) 
        if(selectedToken) {
          onSelect(selectedToken)
        }
      }}
        className="cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
      >
        {SUPPORTED_TOKENS.map(token => <option key={token.name}>
          {token.name}
        </option>)}
      </select>
    </div>
  );
}
function SwapIcon () {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
    </svg>
  )
}