import { cn } from "@/lib/utils";

const buttonVariants = {
  default: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
  outline: "border border-border bg-card text-foreground hover:bg-secondary",
  ghost: "text-muted-foreground hover:text-foreground hover:bg-secondary",
};

const buttonSizes = {
  default: "px-5 py-2.5 text-sm",
  sm: "px-3.5 py-2 text-xs",
  lg: "px-8 py-3 text-base",
};

export function Button({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
