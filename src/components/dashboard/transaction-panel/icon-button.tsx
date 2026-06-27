"use client";

import { forwardRef } from "react";

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={`
          flex items-center justify-center
          h-10 w-10 shrink-0
          rounded-md border bg-transparent
          text-muted-foreground
          cursor-pointer
          hover:bg-muted/50
          transition-colors
          disabled:cursor-not-allowed disabled:opacity-50
          ${className}
        `}
        {...props}
      />
    );
  }
);
IconButton.displayName = "IconButton";