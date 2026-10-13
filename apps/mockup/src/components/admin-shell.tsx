"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowsClockwise,
  Bell,
  ClipboardText,
  FolderSimple,
  Images,
  Megaphone,
  Package,
  SquaresFour,
  Ticket,
} from "@phosphor-icons/react/dist/ssr";
import { CaretDown } from "@phosphor-icons/react/dist/ssr/CaretDown";
import { PencilSimple } from "@phosphor-icons/react/dist/ssr/PencilSimple";
import { SignOut } from "@phosphor-icons/react/dist/ssr/SignOut";
import { Storefront } from "@phosphor-icons/react/dist/ssr/Storefront";
import { ButtonGroup } from "@repo/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@repo/ui";
import { useAdmin } from "@/context/admin";
import { useCustomer } from "@/context/customer";

export type AdminNavItem = {
  label: string;
  href: string | null;
  icon: typeof SquaresFour;
};

export const ADMIN_NAV: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: SquaresFour },
  { label: "Pedidos", href: "/admin/pedidos", icon: ClipboardText },
  { label: "Produtos", href: "/admin/produtos", icon: Package },
  { label: "Categorias", href: "/admin/categorias", icon: FolderSimple },
  { label: "Banners", href: null, icon: Images },
  { label: "Cupons", href: null, icon: Ticket },
  { label: "Campanhas", href: null, icon: Megaphone },
  { label: "ConnectPlug", href: null, icon: ArrowsClockwise },
];

function AlertsBell() {
  const { alerts } = useAdmin();

  return (
    <Link
      href="#alertas"
      aria-label={
        alerts.length === 0
          ? "Sem alertas"
          : `${alerts.length} ${alerts.length === 1 ? "alerta" : "alertas"}`
      }
      className="relative flex size-10 shrink-0 items-center justify-center rounded-full text-gunmetal transition hover:bg-muted"
    >
      <Bell size={20} />
      {alerts.length > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-lime text-[11px] font-bold text-gunmetal">
          {alerts.length}
        </span>
      )}
    </Link>
  );
}

function UserMenu() {
  const { profile, logout } = useCustomer();
  const router = useRouter();
  const initials = profile.name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full min-w-0 items-center gap-2.5 rounded-button px-2 py-2 text-left transition outline-none hover:bg-muted focus-visible:border-jungle">
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-jungle/10 font-heading text-sm font-semibold text-jungle"
        >
          {initials}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-gunmetal">
            {profile.name}
          </span>
          <span className="block truncate text-xs text-pine/70">
            {profile.email}
          </span>
        </span>
        <CaretDown size={16} className="shrink-0 text-pine" />
      </DropdownMenuTrigger>

      <DropdownMenuContent side="top" align="start" className="w-56">
        <ButtonGroup orientation="vertical" className="w-full">
          <DropdownMenuItem
            onClick={() => router.push("/home")}
            className="w-full gap-2.5"
          >
            <Storefront size={16} className="shrink-0 text-pine" />
            Voltar à loja
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/conta/dados")}
            className="w-full gap-2.5"
          >
            <PencilSimple size={16} className="shrink-0 text-pine" />
            Editar perfil
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              logout();
              router.push("/home");
            }}
            className="w-full gap-2.5"
          >
            <SignOut size={16} className="shrink-0" />
            Sair
          </DropdownMenuItem>
        </ButtonGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AdminSidebar({ active }: { active: string }) {
  return (
    <Sidebar>
      <SidebarHeader>
        <Link
          href="/home"
          aria-label="Mix Bazar — voltar à loja"
          className="flex items-center gap-2.5 px-2 py-1"
        >
          <img
            src="/mockup/LogoMix.svg"
            alt="Mix Bazar"
            className="size-10 shrink-0 object-contain"
          />
          <span className="truncate font-heading text-base font-semibold tracking-tight text-gunmetal">
            Bazar
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {ADMIN_NAV.map((item) =>
                item.href === null ? (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton aria-disabled="true">
                      <item.icon size={18} />
                      <span className="min-w-0 flex-1 truncate">
                        {item.label}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild isActive={item.label === active}>
                      <Link href={item.href}>
                        <item.icon size={18} />
                        <span className="min-w-0 flex-1 truncate">
                          {item.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}

export function AdminShell({
  active,
  title,
  children,
}: {
  active: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminSidebar active={active} />

      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur">
          <SidebarTrigger className="shrink-0" />
          <h1 className="min-w-0 flex-1 truncate font-heading text-base font-semibold tracking-tight text-gunmetal">
            {title}
          </h1>
          <span className="flex shrink-0 items-center gap-1">
            <AlertsBell />
            <Link
              href="/home"
              className="hidden whitespace-nowrap text-sm font-medium text-jungle transition hover:text-pine sm:block"
            >
              Voltar à loja
            </Link>
          </span>
        </header>

        <div className="min-w-0 flex-1 px-4 py-8 md:px-6 md:py-10">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
