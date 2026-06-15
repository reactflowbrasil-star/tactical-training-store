import { Link, useNavigate } from "@tanstack/react-router";
import { Save, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CATEGORIES } from "@/lib/products";
import {
  arrayToCsv,
  createBlankProduct,
  csvToArray,
  generateAiCopy,
  makeSlug,
  type AdminProduct,
  useAdminStore,
} from "@/lib/admin-data";
import {
  AdminPageHeader,
  AdminPanel,
  EmptyState,
  Field,
  GooglePreview,
  PanelHeader,
  StatusBadge,
  inputClass,
  textareaClass,
} from "./AdminShell";

export function ProductEditor({ productId }: { productId?: string }) {
  const navigate = useNavigate();
  const { state, ready, upsertProduct } = useAdminStore();
  const source = useMemo(
    () => (productId ? state.products.find((product) => product.id === productId) : undefined),
    [productId, state.products],
  );
  const [draft, setDraft] = useState<AdminProduct>(() => source ?? createBlankProduct());
  const [tags, setTags] = useState(() => arrayToCsv(draft.tags));
  const [imageUrl, setImageUrl] = useState(() => draft.images[0] ?? "");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!productId || !source) return;
    setDraft(source);
    setTags(arrayToCsv(source.tags));
    setImageUrl(source.images[0] ?? "");
  }, [productId, source]);

  const update = <Key extends keyof AdminProduct>(key: Key, value: AdminProduct[Key]) => {
    setDraft((current) => ({
      ...current,
      [key]: value,
      updatedAt: new Date().toISOString(),
      slug: key === "name" && !productId ? makeSlug(String(value)) : current.slug,
    }));
  };

  const generateCopy = () => {
    const result = generateAiCopy({
      productName: draft.name || "Novo produto",
      category: draft.category,
      audience: "clientes que praticam caca, pesca e camping",
      tone: "Comercial",
      focusKeyword: draft.focusKeyword || draft.name,
      benefits: "durabilidade, seguranca e alto desempenho",
      differentials: draft.attributes || "curadoria especializada Tactical Training",
      objective: "aumentar conversao no produto",
    });

    setDraft((current) => ({
      ...current,
      name: current.name || result.title,
      shortDescription: result.shortDescription,
      description: result.description,
      metaTitle: result.metaTitle,
      metaDescription: result.metaDescription,
      focusKeyword: current.focusKeyword || result.keywords.split(",")[0],
      imageAlt: result.imageAlt,
      updatedAt: new Date().toISOString(),
    }));
    setTags(result.keywords);
    setMessage("Copy e campos de SEO preenchidos pela IA simulada.");
  };

  const save = (event: React.FormEvent) => {
    event.preventDefault();

    if (!draft.name.trim() || !draft.category || draft.price <= 0) {
      setMessage("Preencha nome, categoria e preco antes de salvar.");
      return;
    }

    const normalized: AdminProduct = {
      ...draft,
      slug: draft.slug || makeSlug(draft.name),
      tags: csvToArray(tags),
      images: imageUrl.trim() ? [imageUrl.trim()] : draft.images,
      metaTitle: draft.metaTitle || `${draft.name} | Tactical Training`,
      metaDescription: draft.metaDescription || draft.shortDescription,
      focusKeyword: draft.focusKeyword || draft.name.toLowerCase(),
      imageAlt: draft.imageAlt || `${draft.name} Tactical Training`,
      inStock: draft.stock > 0,
      updatedAt: new Date().toISOString(),
    };

    upsertProduct(normalized);
    setMessage("Produto salvo com sucesso.");
    navigate({ to: "/admin/produtos" });
  };

  if (productId && ready && !source) {
    return (
      <>
        <AdminPageHeader title="Produto nao encontrado" description="O item solicitado nao existe na base local." />
        <EmptyState title="Registro indisponivel" description="Volte para a lista de produtos e selecione outro item." />
      </>
    );
  }

  return (
    <form onSubmit={save}>
      <AdminPageHeader
        eyebrow="Catalogo"
        title={productId ? "Editar produto" : "Novo produto"}
        description="Gerencie cadastro, estoque, imagens, atributos, status comercial e SEO do produto."
        actions={
          <>
            <Link
              to="/admin/produtos"
              className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Cancelar
            </Link>
            <button
              type="button"
              onClick={generateCopy}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <Sparkles size={16} />
              Otimizar com IA
            </button>
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-red-600 px-4 text-sm font-bold text-white transition hover:bg-red-700"
            >
              <Save size={16} />
              Salvar
            </button>
          </>
        }
      />

      {message && (
        <div className="mb-4 rounded-md border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {message}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <AdminPanel>
            <PanelHeader title="Informacoes principais" description="Campos obrigatorios para exibicao e venda." />
            <div className="grid gap-4 p-4 sm:grid-cols-2">
              <Field label="Nome do produto" className="sm:col-span-2">
                <input className={inputClass} value={draft.name} onChange={(e) => update("name", e.target.value)} />
              </Field>
              <Field label="Slug automatico editavel">
                <input className={inputClass} value={draft.slug} onChange={(e) => update("slug", makeSlug(e.target.value))} />
              </Field>
              <Field label="Categoria">
                <select className={inputClass} value={draft.category} onChange={(e) => update("category", e.target.value)}>
                  {CATEGORIES.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Descricao curta" className="sm:col-span-2">
                <textarea
                  className={textareaClass}
                  value={draft.shortDescription}
                  onChange={(e) => update("shortDescription", e.target.value)}
                />
              </Field>
              <Field label="Descricao completa" className="sm:col-span-2">
                <textarea
                  className="min-h-44 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  value={draft.description}
                  onChange={(e) => update("description", e.target.value)}
                />
              </Field>
            </div>
          </AdminPanel>

          <AdminPanel>
            <PanelHeader title="Preco, estoque e variacoes" description="Controle comercial para vitrine e checkout." />
            <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Preco">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={inputClass}
                  value={draft.price}
                  onChange={(e) => update("price", Number(e.target.value))}
                />
              </Field>
              <Field label="Preco promocional">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={inputClass}
                  value={draft.salePrice}
                  onChange={(e) => update("salePrice", Number(e.target.value))}
                />
              </Field>
              <Field label="SKU">
                <input className={inputClass} value={draft.sku} onChange={(e) => update("sku", e.target.value)} />
              </Field>
              <Field label="Estoque">
                <input
                  type="number"
                  min="0"
                  className={inputClass}
                  value={draft.stock}
                  onChange={(e) => update("stock", Number(e.target.value))}
                />
              </Field>
              <Field label="Peso">
                <input className={inputClass} value={draft.weight} onChange={(e) => update("weight", e.target.value)} />
              </Field>
              <Field label="Dimensoes">
                <input className={inputClass} value={draft.dimensions} onChange={(e) => update("dimensions", e.target.value)} />
              </Field>
              <Field label="Ordem">
                <input
                  type="number"
                  className={inputClass}
                  value={draft.displayOrder}
                  onChange={(e) => update("displayOrder", Number(e.target.value))}
                />
              </Field>
              <Field label="Status">
                <select className={inputClass} value={draft.status} onChange={(e) => update("status", e.target.value as AdminProduct["status"])}>
                  <option value="active">Ativo</option>
                  <option value="draft">Rascunho</option>
                  <option value="inactive">Inativo</option>
                </select>
              </Field>
              <Field label="Atributos e variacoes" className="sm:col-span-2 lg:col-span-4">
                <textarea
                  className={textareaClass}
                  value={draft.attributes}
                  onChange={(e) => update("attributes", e.target.value)}
                  placeholder="Tamanho: G&#10;Cor: Camuflado&#10;Material: Cordura"
                />
              </Field>
            </div>
          </AdminPanel>

          <AdminPanel>
            <PanelHeader title="Imagens e tags" description="Use URLs por enquanto; a biblioteca de midia gerencia os assets locais." />
            <div className="grid gap-4 p-4 sm:grid-cols-2">
              <Field label="Imagem principal por URL" className="sm:col-span-2">
                <input className={inputClass} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              </Field>
              <Field label="Texto alternativo da imagem">
                <input className={inputClass} value={draft.imageAlt} onChange={(e) => update("imageAlt", e.target.value)} />
              </Field>
              <Field label="Tags separadas por virgula">
                <input className={inputClass} value={tags} onChange={(e) => setTags(e.target.value)} />
              </Field>
            </div>
          </AdminPanel>
        </div>

        <aside className="space-y-5">
          <AdminPanel>
            <PanelHeader title="Status comercial" />
            <div className="space-y-3 p-4">
              <StatusBadge status={draft.status} />
              {[
                ["featured", "Produto em destaque"],
                ["novelty", "Lancamento"],
                ["promotion", "Promocao"],
                ["inStock", "Em estoque"],
              ].map(([key, label]) => (
                <label key={key} className="flex min-h-11 items-center justify-between gap-3 rounded-md border border-slate-200 px-3 text-sm font-semibold">
                  {label}
                  <input
                    type="checkbox"
                    className="h-5 w-5 accent-red-600"
                    checked={Boolean(draft[key as keyof AdminProduct])}
                    onChange={(e) => update(key as keyof AdminProduct, e.target.checked as never)}
                  />
                </label>
              ))}
            </div>
          </AdminPanel>

          <AdminPanel>
            <PanelHeader title="SEO do produto" description="Previa e campos para Google e redes sociais." />
            <div className="space-y-4 p-4">
              <Field label="Meta title">
                <input className={inputClass} value={draft.metaTitle} onChange={(e) => update("metaTitle", e.target.value)} />
              </Field>
              <Field label="Meta description">
                <textarea
                  className={textareaClass}
                  value={draft.metaDescription}
                  onChange={(e) => update("metaDescription", e.target.value)}
                />
              </Field>
              <Field label="Palavra-chave principal">
                <input className={inputClass} value={draft.focusKeyword} onChange={(e) => update("focusKeyword", e.target.value)} />
              </Field>
              <GooglePreview
                title={draft.metaTitle}
                description={draft.metaDescription}
                url={`https://tacticaltraining.com.br/produto/${draft.slug || "produto"}`}
              />
            </div>
          </AdminPanel>
        </aside>
      </div>
    </form>
  );
}
