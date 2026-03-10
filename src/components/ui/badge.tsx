import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em]",
  {
    variants: {
      variant: {
        neutral: "bg-muted text-foreground",
        success: "bg-accent text-accent-foreground",
        warning: "bg-secondary text-secondary-foreground",
        danger: "bg-danger/15 text-danger",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
