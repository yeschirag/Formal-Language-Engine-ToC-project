import { cn } from "@/lib/utils";

/**
 * A clean card component with subtle hover effect.
 */
export function GlowCard({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:border-primary/25 hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
