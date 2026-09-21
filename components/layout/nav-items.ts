import { LayoutDashboard, ListOrdered, Map, BarChart3 } from "lucide-react";

export const navItems = [
  { href: "/map", label: "Map", icon: Map },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/timeline", label: "Timeline", icon: ListOrdered },
  { href: "/statistics", label: "Statistics", icon: BarChart3 },
] as const;
