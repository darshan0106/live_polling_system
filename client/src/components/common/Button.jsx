import React from "react";
import { twMerge } from "tailwind-merge";

export const Button = ({
  children,
  onClick,
  variant = "primary",
  className,
  disabled,
  type = "button",
}) => {
  const baseStyles =
    "px-6 py-3 rounded-full font-bold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary:
      "bg-secondary text-white hover:bg-primary shadow-lg hover:shadow-xl",
    outline:
      "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    ghost: "text-neutral hover:text-primary bg-transparent",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={twMerge(baseStyles, variants[variant], className)}
    >
      {children}
    </button>
  );
};
