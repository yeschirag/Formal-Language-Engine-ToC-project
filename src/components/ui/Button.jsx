import { cn } from "@/lib/utils";

const buttonVariants = {
  default: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/25",
  outline: "border border-white/10 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm",
  ghost: "text-neutral-400 hover:text-white hover:bg-white/5",
};

const buttonSizes = {
  default: "px-6 py-2.5 text-sm",
  sm: "px-4 py-2 text-xs",
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
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50",
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
