import React from "react";

export const PrimaryButton = ({
    children,
    onClick,
    className=""
}: {
    children: React.ReactNode;
    onClick: () => void;
    className?: string
}) => {
    return (
        <button
            onClick={onClick}
            type="button"
            className={`text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${className}`}
        >
            {children}
        </button>
    );
};



export const SecondaryButton = ({children, className = "", onClick, prefix}: {
    children: React.ReactNode,
    onClick: () => void,
    className?: string,
    prefix?: React.ReactNode
}) => {
    return (
        <button
            onClick={onClick}
            type="button"
            className={` text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 ${className}`}
        >
            <div className="flex items-center justify-center gap-2">
                {prefix}
                {children}
            </div>
        </button>
    ) 
}