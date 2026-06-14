import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ShoppingCart, Star, Truck, ShieldCheck, RefreshCw, Minus, Plus } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { formatBRL, getProduct, PRODUCTS } from "@/lib/products";
import { useCart } from "@/contexts/cart";

export const Route = createFileRoute("/produto/$id")({
  head: ({ params }) => {
    const p = getProduct(params.id);
    return {
      meta: [
        { title: p ? `${p.name} — TACTICAL TRAINING` : "Produto" },
        { name: "description", content: p?.description ?? "" },
        { property: "og:title", content: p?.name ?? "Produto" },
        { property: "og:image", content: p?.image ?? "" },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const product = getProduct(id);
  if (!product) throw notFound();

  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <nav className="text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-brand">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/categoria/$slug" params={{ slug: product.category }} className="hover:text-brand capitalize">
            {product.category}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-muted aspect-square overflow-hidden border border-border">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          <div>
            <div className="text-xs uppercase tracking-widest text-brand font-bold">{product.brand}</div>
            <h1 className="mt-2 text-3xl md:text-5xl font-display italic font-extrabold uppercase text-ink leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mt-3 text-sm">
              <Star size={16} className="fill-brand text-brand" />
              <span className="font-bold">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviews} avaliações)</span>
            </div>

            <div className="mt-6 border-t border-b py-6">
              {product.oldPrice && (
                <div className="text-sm text-muted-foreground line-through">{formatBRL(product.oldPrice)}</div>
              )}
              <div className="text-5xl font-display italic font-extrabold text-ink">{formatBRL(product.price)}</div>
              <div className="text-sm text-muted-foreground mt-1">
                ou 12x de {formatBRL(product.price / 12)} sem juros
              </div>
              <div className="mt-2 inline-block bg-ink text-white text-xs font-bold px-2 py-1">PIX: 5% OFF</div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center border border-ink">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-12 hover:bg-muted"><Minus size={16} className="mx-auto" /></button>
                <span className="w-12 text-center font-bold">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-10 h-12 hover:bg-muted"><Plus size={16} className="mx-auto" /></button>
              </div>
              <button
                onClick={() => add(product.id, qty)}
                className="flex-1 bg-brand hover:bg-brand-dark text-white py-4 font-display italic font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition"
              >
                <ShoppingCart size={18} /> Adicionar ao carrinho
              </button>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
              {[
                { Icon: Truck, t: "Frete grátis" },
                { Icon: ShieldCheck, t: "Pagamento seguro" },
                { Icon: RefreshCw, t: "Troca fácil" },
              ].map(({ Icon, t }) => (
                <div key={t} className="border border-border p-3 flex flex-col items-center gap-1 text-center">
                  <Icon size={18} className="text-brand" />
                  <span className="font-semibold">{t}</span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="font-display italic font-bold uppercase tracking-wider text-ink mb-2">Descrição</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            <div className="mt-6">
              <h3 className="font-display italic font-bold uppercase tracking-wider text-ink mb-2">Especificações</h3>
              <dl className="text-sm divide-y border-y">
                {product.specs.map((s) => (
                  <div key={s.label} className="grid grid-cols-2 py-2">
                    <dt className="text-muted-foreground">{s.label}</dt>
                    <dd className="font-semibold text-ink">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl md:text-3xl font-display italic font-extrabold uppercase text-ink mb-6">
              Produtos relacionados
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
