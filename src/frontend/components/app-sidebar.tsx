"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  Activity,
  Database,
  Globe,
  Home,
  List,
  Monitor,
  Palette,
  Settings,
  Shield,
  Clock,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSidebar } from "@/components/ui/sidebar"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

const themes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "nord", label: "Nord" },
  { value: "catppuccin", label: "Catppuccin" },
  { value: "dracula", label: "Dracula" },
  { value: "sepia", label: "Sepia" },
  { value: "tokyonight", label: "Tokyonight" },
  { value: "gruvbox", label: "Gruvbox" },
] as const

const mainNavItems = [
  {
    title: "Overview",
    url: "/",
    icon: Home,
  },
  {
    title: "Query Log",
    url: "/query-log",
    icon: Activity,
  },
  {
    title: "Devices",
    url: "/devices",
    icon: Monitor,
  },
]

const filterNavItems = [
  {
    title: "Blocklists",
    url: "/blocklists",
    icon: Shield,
  },
  {
    title: "Custom Rules",
    url: "/custom-rules",
    icon: List,
  },
  {
    title: "Schedules",
    url: "/schedules",
    icon: Clock,
  },
]

const systemNavItems = [
  {
    title: "Upstream DNS",
    url: "/upstream-dns",
    icon: Globe,
  },
  {
    title: "Database",
    url: "/database",
    icon: Database,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { state: sidebarState } = useSidebar()
  const { theme = "monochrome", setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isExpanded = sidebarState === "expanded"

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:items-center">
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-foreground">
            <Shield className="size-4 text-background" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold tracking-tight">Blockadeer</span>
            <span className="text-xs text-muted-foreground">DNS Ad Blocker</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={pathname === item.url} tooltip={item.title} asChild>
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Filtering</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filterNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={pathname === item.url} tooltip={item.title} asChild>
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={pathname === item.url} tooltip={item.title} asChild>
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={cn("p-4", !isExpanded && "group-data-[collapsible=icon]:p-2")}>
        {isExpanded && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <Palette className="size-4" />
                <span className="flex-1 text-left">Theme</span>
                <span className="text-xs text-muted-foreground">
                  {mounted ? themes.find(t => t.value === theme)?.label : "..."}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" className="w-48">
              <DropdownMenuLabel>Select Theme</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {themes.map((t) => (
                <DropdownMenuItem
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={cn(theme === t.value && "bg-accent")}
                >
                  {t.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
          <div className="size-2 rounded-full bg-foreground animate-pulse" />
          <span>System Online</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
