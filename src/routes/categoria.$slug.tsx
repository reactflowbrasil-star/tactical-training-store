import { createFileRoute, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, getByCategory, type Category } from "@/lib/products";

export const Route = createFileRoute("/categoria/$slug")({
  head: ({ params }) => {
    const cat = CATEGORIES.find((c) => c.slug === params.slug);
    const title = cat ? `${cat.label} — TACTICAL TRAINING` : "Categoria";
    return {
      meta: [
        { title },
        { name: "description", content: `Produtos de ${cat?.label ?? ""} TACTICAL TRAINING.` },
        { property: "og:title", content: title },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) throw notFound();

  const all = getByCategory(slug as Category);
  const [sort, setSort] = useState("relevance");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [brands, setBrands] = useState<string[]>([]);

  const allBrands = useMemo(() => Array.from(new Set(all.map((p) => p.brand))), [all]);

  const items = useMemo(() => {
    let r = all.filter((p) => p.price <= maxPrice);
    if (brands.length) r = r.filter((p) => brands.includes(p.brand));
    if (sort === "price-asc") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
    return r;
  }, [all, sort, maxPrice, brands]);

  return (
    <Layout>
      <div className="bg-ink text-white py-10">
        <div className="container mx-auto px-4">
          <div className="text-xs uppercase tracking-[0.4em] text-brand font-bold">Categoria</div>
          <h1 className="mt-2 text-4xl md:text-6xl font-display italic font-extrabold uppercase">
            {cat.label}
          </h1>
          <p className="mt-2 text-white/60 text-sm">{all.length} produtos</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        <aside className="space-y-6">
          <FilterBlock title="Preço máximo">
            <input
              type="range"
              min={100}
              max={2000}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-brand"
            />
            <div className="text-sm font-display italic font-bold mt-1">
              Até R$ {maxPrice.toLocaleString("pt-BR")}
            </div>
          </FilterBlock>
          <FilterBlock title="Marca">
            <div className="space-y-2">
              {allBrands.map((b) => (
                <label key={b} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={brands.includes(b)}
                    onChange={() =>
                      setBrands((prev) =>
                        prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b],
                      )
                    }
                    className="accent-brand w-4 h-4"
                  />
                  {b}
                </label>
              ))}
            </div>
          </FilterBlock>
        </aside>

        <div>
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <div className="text-sm text-muted-foreground">{items.length} resultados</div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-border px-3 py-2 text-sm bg-white focus:outline-none focus:border-brand"
            >
              <option value="relevance">Relevância</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
              <option value="rating">Mais avaliados</option>
            </select>
          </div>
          {items.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">Nenhum produto encontrado.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

function FilterBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-l-4 border-brand pl-4">
      <h3 className="font-display italic font-bold uppercase tracking-wider text-sm text-ink mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}
