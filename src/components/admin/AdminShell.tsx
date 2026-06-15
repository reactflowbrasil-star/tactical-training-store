import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Boxes,
  FileSearch,
  FolderTree,
  Home,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { clearAdminSession, getAdminSession, type UserRole } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

type Session = { name: string; email: string; role: UserRole };

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/produtos", label: "Produtos", icon: Package },
  { to: "/admin/categorias", label: "Categorias", icon: FolderTree },
  { to: "/admin/usuarios", label: "Usuarios", icon: Users },
  { to: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { to: "/admin/banners", label: "Banners", icon: Images },
  { to: "/admin/seo", label: "SEO", icon: FileSearch },
  { to: "/admin/ia-copywriter", label: "IA", icon: Sparkles },
  { to: "/admin/midia", label: "Midia", icon: Boxes },
  { to: "/admin/configuracoes", label: "Ajustes", icon: Settings },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [session, setSession] = useState<Session | null>(null);
  const [checked, setChecked] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const current = getAdminSession();
    setSession(current);
    setChecked(true);
    if (!current) navigate({ to: "/admin/login" });
  }, [navigate]);

  const activeSection = useMemo(() => {
    return navItems.find((item) => pathname.startsWith(item.to))?.label ?? "Painel";
  }, [pathname]);

  const logout = () => {
    clearAdminSession();
    navigate({ to: "/admin/login" });
  };

  if (!checked || !session) {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="mx-auto h-3 w-28 animate-pulse rounded bg-slate-200" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <AdminBrand />
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => (
            <AdminNavLink key={item.to} item={item} active={pathname.startsWith(item.to)} />
          ))}
        </nav>
        <div className="border-t border-slate-200 p-4">
          <div className="text-sm font-semibold text-slate-900">{session.name}</div>
          <div className="mt-0.5 text-xs text-slate-500">{session.role}</div>
          <button
            onClick={logout}
            className="mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-white text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur lg:ml-72">
        <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 lg:hidden"
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>
          <div>
            <div className="text-xs font-semibold uppercase text-red-600">Admin</div>
            <div className="text-base font-semibold text-slate-950">{activeSection}</div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/"
              className="hidden h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:inline-flex"
            >
              <Home size={16} />
              Loja
            </Link>
            <button
              onClick={logout}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 lg:hidden"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-slate-950/60"
            onClick={() => setMobileOpen(false)}
            aria-label="Fechar menu"
          />
          <aside className="relative flex h-full w-[min(86vw,320px)] flex-col border-r border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 pr-3">
              <AdminBrand />
              <button
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200"
                onClick={() => setMobileOpen(false)}
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
              {navItems.map((item) => (
                <AdminNavLink
                  key={item.to}
                  item={item}
                  active={pathname.startsWith(item.to)}
                  onClick={() => setMobileOpen(false)}
                />
              ))}
            </nav>
          </aside>
        </div>
      )}

      <main className="pb-24 lg:ml-72 lg:pb-8">
        <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:py-8">{children}</div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white lg:hidden">
        <div className="grid grid-cols-5">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold",
                  active ? "text-red-600" : "text-slate-500",
                )}
              >
                <Icon size={19} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function AdminBrand() {
  return (
    <div className="flex h-20 items-center gap-3 px-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-md bg-slate-950 text-sm font-black text-white">
        TT
      </div>
      <div>
        <div className="text-sm font-black uppercase text-slate-950">Tactical Training</div>
        <div className="text-xs text-slate-500">Commerce OS</div>
      </div>
    </div>
  );
}

function AdminNavLink({
  item,
  active,
  onClick,
}: {
  item: (typeof navItems)[number];
  active: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      onClick={onClick}
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition",
        active
          ? "bg-red-50 text-red-700 ring-1 ring-red-100"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
      )}
    >
      <Icon size={18} />
      <span>{item.label}</span>
    </Link>
  );
}

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <div className="text-xs font-bold uppercase text-red-600">{eyebrow}</div>}
        <h1 className="mt-1 text-2xl font-black text-slate-950 sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 max-w-3xl text-sm text-slate-600">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function AdminPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-lg border border-slate-200 bg-white shadow-sm", className)}>
      {children}
    </section>
  );
}

export function PanelHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-base font-bold text-slate-950">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
      </div>
      {actions}
    </div>
  );
}

export function MetricCard({
  title,
  value,
  detail,
  icon: Icon,
  accent = "red",
}: {
  title: string;
  value: string;
  detail: string;
  icon: typeof BarChart3;
  accent?: "red" | "green" | "blue" | "amber";
}) {
  const accentClass = {
    red: "bg-red-50 text-red-700",
    green: "bg-emerald-50 text-emerald-700",
    blue: "bg-sky-50 text-sky-700",
    amber: "bg-amber-50 text-amber-700",
  }[accent];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-slate-500">{title}</div>
          <div className="mt-2 text-2xl font-black text-slate-950">{value}</div>
        </div>
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-md", accentClass)}>
          <Icon size={20} />
        </div>
      </div>
      <div className="mt-3 text-xs text-slate-500">{detail}</div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const color =
    normalized.includes("active") ||
    normalized.includes("pago") ||
    normalized.includes("entregue") ||
    normalized.includes("enviado")
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : normalized.includes("cancel") || normalized.includes("inactive")
        ? "bg-rose-50 text-rose-700 ring-rose-200"
        : normalized.includes("draft") || normalized.includes("analise")
          ? "bg-amber-50 text-amber-700 ring-amber-200"
          : "bg-slate-100 text-slate-700 ring-slate-200";

  const label = status === "active" ? "Ativo" : status === "inactive" ? "Inativo" : status === "draft" ? "Rascunho" : status;

  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1", color)}>
      {label}
    </span>
  );
}

export function Field({
  label,
  children,
  hint,
  className,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="text-xs font-bold uppercase text-slate-700">{label}</span>
      <div className="mt-1">{children}</div>
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-100";

export const textareaClass =
  "min-h-28 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-100";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
      <div className="text-sm font-bold text-slate-800">{title}</div>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}

export function GooglePreview({
  title,
  description,
  url,
}: {
  title: string;
  description: string;
  url: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="text-xs text-emerald-700">{url || "https://tacticaltraining.com.br"}</div>
      <div className="mt-1 line-clamp-1 text-lg text-blue-700">{title || "Titulo da pagina"}</div>
      <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-600">
        {description || "A meta description aparecera aqui quando for preenchida."}
      </p>
    </div>
  );
}
