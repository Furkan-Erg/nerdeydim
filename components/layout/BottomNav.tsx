"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "./nav-items";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t bg-background/95 backdrop-blur md:hidden">
      {navItems.slice(0, 2).map((item) => (
        <NavLink key={item.href} item={item} active={pathname.startsWith(item.href)} />
      ))}

      <Link
        href="/trips/new"
        className="flex flex-col items-center gap-0.5 px-3 py-2 text-primary"
      >
        <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Plus className="size-5" />
        </span>
      </Link>

      {navItems.slice(2).map((item) => (
        <NavLink key={item.href} item={item} active={pathname.startsWith(item.href)} />
      ))}
    </nav>
  );
}

function NavLink({
  item,
  active,
}: {
  item: (typeof navItems)[number];
  active: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex flex-col items-center gap-0.5 px-3 py-2 text-xs",
        active ? "text-primary" : "text-muted-foreground"
      )}
    >
      <item.icon className="size-5" />
      {item.label}
    </Link>
  );
}
