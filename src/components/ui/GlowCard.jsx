import { cn } from "@/lib/utils";

/**
 * A clean card component with subtle hover effect.
 */
export function GlowCard({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:border-indigo-500/40 hover:shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
