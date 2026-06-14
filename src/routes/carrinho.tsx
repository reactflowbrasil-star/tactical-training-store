import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useCart } from "@/contexts/cart";
import { formatBRL } from "@/lib/products";

export const Route = createFileRoute("/carrinho")({
  head: () => ({ meta: [{ title: "Carrinho — TACTICAL TRAINING" }] }),
  component: CartPage,
});

function CartPage() {
  const { detailed, subtotal, setQty, remove } = useCart();
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(0);

  const apply = () => {
    if (coupon.trim().toUpperCase() === "TACTICAL15") setApplied(subtotal * 0.15);
    else setApplied(0);
  };

  const shipping = subtotal > 499 || subtotal === 0 ? 0 : 39.9;
  const total = Math.max(0, subtotal - applied + shipping);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-5xl font-display italic font-extrabold uppercase text-ink">
          Carrinho
        </h1>

        {detailed.length === 0 ? (
          <div className="mt-10 py-20 text-center border-2 border-dashed border-border">
            <ShoppingBag size={48} className="mx-auto text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Seu carrinho está vazio.</p>
            <Link
              to="/"
              className="mt-6 inline-block bg-brand text-white px-6 py-3 font-display italic font-bold uppercase tracking-wider text-sm hover:bg-brand-dark transition"
            >
              Continuar comprando
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
            <div className="space-y-4">
              {detailed.map((it) => (
                <div key={it.id} className="flex gap-4 border border-border p-4 bg-white">
                  <img src={it.product.image} alt={it.product.name} className="w-24 h-24 object-cover bg-muted" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{it.product.brand}</div>
                    <Link to="/produto/$id" params={{ id: it.id }} className="font-semibold text-ink hover:text-brand line-clamp-2">
                      {it.product.name}
                    </Link>
                    <div className="mt-2 flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center border border-ink">
                        <button onClick={() => setQty(it.id, it.qty - 1)} className="w-8 h-8 hover:bg-muted"><Minus size={14} className="mx-auto" /></button>
                        <span className="w-10 text-center text-sm font-bold">{it.qty}</span>
                        <button onClick={() => setQty(it.id, it.qty + 1)} className="w-8 h-8 hover:bg-muted"><Plus size={14} className="mx-auto" /></button>
                      </div>
                      <div className="font-display italic font-bold text-lg text-ink">
                        {formatBRL(it.product.price * it.qty)}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => remove(it.id)} className="text-muted-foreground hover:text-brand self-start" aria-label="Remover">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <aside className="bg-ink text-white p-6 h-fit sticky top-32">
              <h2 className="font-display italic font-extrabold uppercase tracking-wider text-xl">Resumo</h2>
              <div className="mt-4 flex gap-2">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Cupom"
                  className="flex-1 bg-ink-2 text-white border border-ink-3 px-3 py-2 text-sm focus:outline-none focus:border-brand"
                />
                <button onClick={apply} className="bg-brand hover:bg-brand-dark px-4 py-2 text-sm font-display italic font-bold uppercase">Aplicar</button>
              </div>
              <dl className="mt-6 space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-white/70">Subtotal</dt><dd>{formatBRL(subtotal)}</dd></div>
                <div className="flex justify-between"><dt className="text-white/70">Frete</dt><dd>{shipping === 0 ? "Grátis" : formatBRL(shipping)}</dd></div>
                {applied > 0 && (
                  <div className="flex justify-between text-brand"><dt>Desconto</dt><dd>- {formatBRL(applied)}</dd></div>
                )}
                <div className="border-t border-ink-3 pt-3 flex justify-between text-xl font-display italic font-extrabold">
                  <dt>Total</dt><dd>{formatBRL(total)}</dd>
                </div>
              </dl>
              <Link
                to="/checkout"
                className="mt-6 w-full bg-brand hover:bg-brand-dark text-white py-4 font-display italic font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition"
              >
                Finalizar compra <ArrowRight size={18} />
              </Link>
            </aside>
          </div>
        )}
      </div>
    </Layout>
  );
}
