import { createFileRoute, Link } from "@tanstack/react-router";
import { Edit, Eye, PackagePlus, Search, Star, Tag, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { AdminPageHeader, AdminPanel, EmptyState, PanelHeader, StatusBadge, inputClass } from "@/components/admin/AdminShell";
import { AdminShell } from "@/components/admin/AdminShell";
import { CATEGORIES } from "@/lib/products";
import { money, useAdminStore } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/produtos")({
  head: () => ({ meta: [{ title: "Produtos | Admin Tactical Training" }] }),
  component: ProductsAdminRoute,
});

function ProductsAdminRoute() {
  return (
    <AdminShell>
      <ProductsPage />
    </AdminShell>
  );
}

function ProductsPage() {
  const { state, removeProduct, upsertProduct } = useAdminStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("todos");
  const [status, setStatus] = useState("todos");

  const products = useMemo(() => {
    return state.products
      .filter((product) => {
        const term = query.toLowerCase();
        const matchesQuery =
          product.name.toLowerCase().includes(term) ||
          product.sku.toLowerCase().includes(term) ||
          product.tags.join(" ").toLowerCase().includes(term);
        const matchesCategory = category === "todos" || product.category === category;
        const matchesStatus = status === "todos" || product.status === status;
        return matchesQuery && matchesCategory && matchesStatus;
      })
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [category, query, state.products, status]);

  const remove = (id: string) => {
    if (window.confirm("Excluir este produto? Esta acao nao pode ser desfeita.")) {
      removeProduct(id);
    }
  };

  const toggleFeatured = (id: string) => {
    const product = state.products.find((item) => item.id === id);
    if (!product) return;
    upsertProduct({ ...product, featured: !product.featured, updatedAt: new Date().toISOString() });
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Catalogo"
        title="Produtos"
        description="CRUD completo de produtos com estoque, imagens, tags, status comercial e campos de SEO."
        actions={
          <Link
            to="/admin/produtos/novo"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-red-600 px-4 text-sm font-bold text-white transition hover:bg-red-700"
          >
            <PackagePlus size={16} />
            Novo produto
          </Link>
        }
      />

      <AdminPanel className="mb-5">
        <div className="grid gap-3 p-4 md:grid-cols-[1fr_180px_180px]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className={`${inputClass} pl-10`}
              placeholder="Buscar por nome, SKU ou tag"
            />
          </label>
          <select className={inputClass} value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="todos">Todas categorias</option>
            {CATEGORIES.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.label}
              </option>
            ))}
          </select>
          <select className={inputClass} value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="todos">Todos status</option>
            <option value="active">Ativos</option>
            <option value="draft">Rascunhos</option>
            <option value="inactive">Inativos</option>
          </select>
        </div>
      </AdminPanel>

      <AdminPanel>
        <PanelHeader title={`${products.length} produtos encontrados`} description="Tabelas viram cards no celular para leitura rapida." />
        {products.length === 0 ? (
          <div className="p-4">
            <EmptyState title="Nenhum produto encontrado" description="Ajuste os filtros ou cadastre um novo item." />
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[920px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Produto</th>
                    <th className="px-4 py-3">Categoria</th>
                    <th className="px-4 py-3">Preco</th>
                    <th className="px-4 py-3">Estoque</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Tags</th>
                    <th className="px-4 py-3 text-right">Acoes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {products.map((product) => (
                    <tr key={product.id} className="align-middle">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={product.images[0]} alt={product.imageAlt} className="h-14 w-14 rounded-md object-cover" />
                          <div>
                            <div className="font-bold text-slate-950">{product.name}</div>
                            <div className="text-xs text-slate-500">{product.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 capitalize">{product.category}</td>
                      <td className="px-4 py-3 font-semibold">{money(product.price)}</td>
                      <td className="px-4 py-3">
                        <span className={product.stock <= 8 ? "font-bold text-amber-700" : "text-slate-700"}>
                          {product.stock} un.
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={product.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex max-w-56 flex-wrap gap-1">
                          {product.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => toggleFeatured(product.id)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-amber-50 hover:text-amber-700"
                            aria-label="Destaque"
                          >
                            <Star size={16} className={product.featured ? "fill-amber-500 text-amber-500" : ""} />
                          </button>
                          <Link
                            to="/produto/$id"
                            params={{ id: product.id }}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                            aria-label="Ver na loja"
                          >
                            <Eye size={16} />
                          </Link>
                          <Link
                            to="/admin/produtos/editar/$id"
                            params={{ id: product.id }}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                            aria-label="Editar"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => remove(product.id)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-rose-50 hover:text-rose-700"
                            aria-label="Excluir"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 p-4 md:hidden">
              {products.map((product) => (
                <article key={product.id} className="rounded-lg border border-slate-200 bg-white p-3">
                  <div className="flex gap-3">
                    <img src={product.images[0]} alt={product.imageAlt} className="h-20 w-20 rounded-md object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="line-clamp-2 font-bold text-slate-950">{product.name}</div>
                      <div className="mt-1 text-xs text-slate-500">{product.sku}</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <StatusBadge status={product.status} />
                        {product.featured && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-200">
                            <Star size={12} />
                            Destaque
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <div className="text-xs text-slate-500">Preco</div>
                      <div className="font-bold">{money(product.price)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Estoque</div>
                      <div className="font-bold">{product.stock}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Categoria</div>
                      <div className="font-bold capitalize">{product.category}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link
                      to="/admin/produtos/editar/$id"
                      params={{ id: product.id }}
                      className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md border border-slate-200 text-sm font-semibold"
                    >
                      <Edit size={15} />
                      Editar
                    </Link>
                    <button
                      onClick={() => remove(product.id)}
                      className="inline-flex h-10 w-12 items-center justify-center rounded-md border border-rose-200 text-rose-700"
                      aria-label="Excluir"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </AdminPanel>
    </>
  );
}
