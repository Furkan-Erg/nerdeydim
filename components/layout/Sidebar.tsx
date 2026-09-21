"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, LogOut, Plus } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { navItems } from "./nav-items";

export function Sidebar({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground md:flex">
      <div className="flex items-center gap-2 px-5 py-5 text-lg font-semibold">
        <Compass className="size-5 text-primary" />
        Where Have I Been?
      </div>

      <div className="px-3">
        <Button asChild className="w-full justify-start gap-2">
          <Link href="/trips/new">
            <Plus className="size-4" />
            Add a trip
          </Link>
        </Button>
      </div>

      <nav className="mt-4 flex flex-1 flex-col gap-1 px-3">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center justify-between gap-2 border-t px-4 py-3">
        <span className="truncate text-sm text-sidebar-foreground/70">{userName}</span>
        <Button
          variant="ghost"
          size="icon"
          title="Log out"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="size-4" />
        </Button>
      </div>
    </aside>
  );
}
