import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/buscar")({
  validateSearch: z.object({ q: z.string().optional() }),
  head: () => ({ meta: [{ title: "Buscar — TACTICAL TRAINING" }] }),
  component: SearchPage,
});

function SearchPage() {
  const { q = "" } = Route.useSearch();
  const term = q.toLowerCase();
  const results = term
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.brand.toLowerCase().includes(term) ||
          p.category.includes(term),
      )
    : [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <div className="text-xs uppercase tracking-[0.4em] text-brand font-bold">Resultados</div>
        <h1 className="mt-2 text-3xl md:text-5xl font-display italic font-extrabold uppercase text-ink">
          Busca: "{q}"
        </h1>
        <p className="text-muted-foreground text-sm mt-1">{results.length} produtos encontrados</p>

        {results.length === 0 ? (
          <div className="mt-16 py-20 text-center border-2 border-dashed border-border text-muted-foreground">
            Nenhum produto encontrado para "{q}".
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
