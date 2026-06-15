import { Link, useNavigate } from "@tanstack/react-router";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { CATEGORIES } from "@/lib/products";
import { useCart } from "@/contexts/cart";

export function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const nav = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) nav({ to: "/buscar", search: { q: q.trim() } });
  };

  return (
    <header className="sticky top-0 z-50 bg-ink text-white border-b-2 border-brand">
      {/* Top strip */}
      <div className="bg-brand text-white text-[11px] md:text-xs uppercase tracking-widest font-display italic font-semibold py-1.5 text-center">
        Frete grátis acima de R$ 499 • Pague em até 12x sem juros
      </div>

      <div className="container mx-auto px-4 flex items-center gap-4 h-20">
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>

        <form onSubmit={submit} className="hidden md:flex flex-1 max-w-2xl relative">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar equipamentos táticos..."
            className="w-full bg-ink-2 text-white placeholder:text-white/40 border border-ink-3 px-4 py-2.5 pr-12 focus:outline-none focus:border-brand transition"
          />
          <button
            type="submit"
            className="absolute right-0 top-0 h-full px-4 bg-brand hover:bg-brand-dark transition text-white"
            aria-label="Buscar"
          >
            <Search size={18} />
          </button>
        </form>

        <div className="flex items-center gap-1 ml-auto">
          <Link
            to="/conta"
            className="hidden sm:flex items-center gap-2 px-3 py-2 hover:text-brand transition text-sm font-display italic font-semibold uppercase tracking-wider"
          >
            <User size={20} />
            <span className="hidden lg:inline">Conta</span>
          </Link>
          <Link
            to="/carrinho"
            className="relative flex items-center gap-2 px-3 py-2 hover:text-brand transition text-sm font-display italic font-semibold uppercase tracking-wider"
          >
            <ShoppingCart size={20} />
            <span className="hidden lg:inline">Carrinho</span>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                {count}
              </span>
            )}
          </Link>
          <button
            className="md:hidden ml-1 p-2"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Category nav */}
      <nav className="hidden md:block bg-ink-2 border-t border-ink-3">
        <div className="container mx-auto px-4 flex items-center gap-1">
          <Link
            to="/produtos"
            className="px-4 py-3 text-sm font-display italic font-bold uppercase tracking-wider text-white/80 hover:text-white hover:bg-brand transition"
          >
            Produtos
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to="/categoria/$slug"
              params={{ slug: c.slug }}
              className="px-4 py-3 text-sm font-display italic font-bold uppercase tracking-wider text-white/80 hover:text-white hover:bg-brand transition"
            >
              {c.label}
            </Link>
          ))}
          <Link
            to="/admin/login"
            className="px-4 py-3 text-sm font-display italic font-bold uppercase tracking-wider text-white/60 hover:text-white hover:bg-ink transition"
          >
            Admin
          </Link>
          <Link
            to="/categoria/$slug"
            params={{ slug: "caca" }}
            search={{ promo: true }}
            className="px-4 py-3 text-sm font-display italic font-bold uppercase tracking-wider text-brand hover:bg-brand hover:text-white transition ml-auto"
          >
            🔥 Promoções
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-ink-2 border-t border-ink-3">
          <form onSubmit={submit} className="p-3 flex">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar..."
              className="flex-1 bg-ink text-white placeholder:text-white/40 border border-ink-3 px-3 py-2 focus:outline-none focus:border-brand"
            />
            <button className="px-4 bg-brand text-white" aria-label="Buscar">
              <Search size={18} />
            </button>
          </form>
          <div className="flex flex-col">
            <Link
              to="/produtos"
              onClick={() => setOpen(false)}
              className="px-4 py-3 text-sm font-display italic font-bold uppercase tracking-wider text-white border-t border-ink-3 hover:bg-brand"
            >
              Produtos
            </Link>
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                to="/categoria/$slug"
                params={{ slug: c.slug }}
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-sm font-display italic font-bold uppercase tracking-wider text-white border-t border-ink-3 hover:bg-brand"
              >
                {c.label}
              </Link>
            ))}
            <Link
              to="/admin/login"
              onClick={() => setOpen(false)}
              className="px-4 py-3 text-sm font-display italic font-bold uppercase tracking-wider text-white border-t border-ink-3 hover:bg-brand"
            >
              Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
