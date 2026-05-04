import React from "react";

interface ICardProps {
    className?: string;
    children?: React.ReactNode;
}

export function Card({ className, children }: ICardProps) {
    return (
        <div
            className={
                "bg-white rounded-xl border border-neutral-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-5" +
                className
            }
        >
            {children}
        </div>
    );
}

export default Card;
