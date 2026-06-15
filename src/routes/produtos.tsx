import { createFileRoute } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORIES, PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/produtos")({
  head: () => ({
    meta: [
      { title: "Produtos - TACTICAL TRAINING" },
      {
        name: "description",
        content: "Catalogo completo Tactical Training com equipamentos para caca, pesca, camping, vestuario e acessorios.",
      },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("todos");
  const [sort, setSort] = useState("relevance");

  const products = useMemo(() => {
    let result = PRODUCTS.filter((product) => {
      const term = query.toLowerCase();
      const matchesQuery =
        product.name.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term);
      const matchesCategory = category === "todos" || product.category === category;
      return matchesQuery && matchesCategory;
    });

    if (sort === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
    if (sort === "rating") result = [...result].sort((a, b) => b.rating - a.rating);
    return result;
  }, [category, query, sort]);

  return (
    <Layout>
      <section className="bg-ink py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="text-xs font-bold uppercase tracking-[0.4em] text-brand">Catalogo</div>
          <h1 className="mt-2 text-4xl font-display italic font-extrabold uppercase md:text-6xl">Todos os produtos</h1>
          <p className="mt-3 max-w-2xl text-sm text-white/65">
            Navegue por todo o catalogo com busca, filtros e ordenacao para encontrar o equipamento certo para sua missao.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="grid gap-3 border border-border bg-white p-4 md:grid-cols-[1fr_220px_220px]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-11 w-full border border-border bg-white px-3 pl-10 text-sm outline-none focus:border-brand"
              placeholder="Buscar produto, marca ou descricao"
            />
          </label>
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-11 border border-border bg-white px-3 text-sm outline-none focus:border-brand">
            <option value="todos">Todas categorias</option>
            {CATEGORIES.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.label}
              </option>
            ))}
          </select>
          <select value={sort} onChange={(event) => setSort(event.target.value)} className="h-11 border border-border bg-white px-3 text-sm outline-none focus:border-brand">
            <option value="relevance">Relevancia</option>
            <option value="price-asc">Menor preco</option>
            <option value="price-desc">Maior preco</option>
            <option value="rating">Mais avaliados</option>
          </select>
        </div>

        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <SlidersHorizontal size={16} />
          {products.length} produtos encontrados
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </Layout>
  );
}
