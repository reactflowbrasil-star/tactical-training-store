import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { PRODUCTS, type Product } from "@/lib/products";

export interface CartItem {
  id: string;
  qty: number;
}

interface CartCtx {
  items: CartItem[];
  detailed: (CartItem & { product: Product })[];
  count: number;
  subtotal: number;
  add: (id: string, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "tt_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(KEY) : null;
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const value = useMemo<CartCtx>(() => {
    const detailed = items
      .map((i) => {
        const product = PRODUCTS.find((p) => p.id === i.id);
        return product ? { ...i, product } : null;
      })
      .filter(Boolean) as (CartItem & { product: Product })[];
    const subtotal = detailed.reduce((s, i) => s + i.product.price * i.qty, 0);
    const count = items.reduce((s, i) => s + i.qty, 0);
    return {
      items,
      detailed,
      count,
      subtotal,
      add: (id, qty = 1) =>
        setItems((prev) => {
          const f = prev.find((i) => i.id === id);
          if (f) return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i));
          return [...prev, { id, qty }];
        }),
      remove: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
      setQty: (id, qty) =>
        setItems((prev) =>
          qty <= 0
            ? prev.filter((i) => i.id !== id)
            : prev.map((i) => (i.id === id ? { ...i, qty } : i)),
        ),
      clear: () => setItems([]),
    };
  }, [items]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}
