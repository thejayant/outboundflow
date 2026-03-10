import Link from "next/link";
import {
  BarChart3,
  ContactRound,
  FolderInput,
  Inbox,
  LayoutDashboard,
  Mail,
  Settings,
  UserCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/contacts", label: "Contacts", icon: ContactRound },
  { href: "/imports", label: "Imports", icon: FolderInput },
  { href: "/templates", label: "Templates", icon: Mail },
  { href: "/campaigns", label: "Campaigns", icon: BarChart3 },
  { href: "/inbox", label: "Inbox", icon: Inbox },
  { href: "/settings", label: "Workspace", icon: Settings },
  { href: "/profile", label: "Profile", icon: UserCircle2 },
];

export function SidebarNav({ pathname }: { pathname: string }) {
  return (
    <nav className="grid gap-2">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
              active
                ? "bg-white/14 text-sidebar-foreground"
                : "text-sidebar-muted hover:bg-white/8 hover:text-sidebar-foreground",
            )}
          >
            <Icon className="size-4" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
