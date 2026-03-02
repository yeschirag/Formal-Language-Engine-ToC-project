import { cn } from "@/lib/utils";

/**
 * A card with subtle glow border effect on hover.
 */
export function GlowCard({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "group relative rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/30 hover:bg-white/[0.06] hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.15)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
