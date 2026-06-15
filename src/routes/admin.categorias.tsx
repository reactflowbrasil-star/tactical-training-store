import { createFileRoute } from "@tanstack/react-router";
import { Edit, FolderPlus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
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
} from "@/components/admin/AdminShell";
import { AdminShell } from "@/components/admin/AdminShell";
import { makeId, makeSlug, type AdminCategory, useAdminStore } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/categorias")({
  head: () => ({ meta: [{ title: "Categorias | Admin Tactical Training" }] }),
  component: CategoriesRoute,
});

const blankCategory = (): AdminCategory => ({
  id: makeId("cat"),
  name: "",
  slug: "",
  description: "",
  image: "",
  icon: "Package",
  parentId: "",
  status: "active",
  displayOrder: 99,
  metaTitle: "",
  metaDescription: "",
  focusKeyword: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

function CategoriesRoute() {
  return (
    <AdminShell>
      <CategoriesPage />
    </AdminShell>
  );
}

function CategoriesPage() {
  const { state, updateCollection } = useAdminStore();
  const [draft, setDraft] = useState<AdminCategory>(() => blankCategory());
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");

  const sorted = useMemo(
    () => [...state.categories].sort((a, b) => a.displayOrder - b.displayOrder),
    [state.categories],
  );

  const update = <Key extends keyof AdminCategory>(key: Key, value: AdminCategory[Key]) => {
    setDraft((current) => ({
      ...current,
      [key]: value,
      slug: key === "name" && !editing ? makeSlug(String(value)) : current.slug,
      updatedAt: new Date().toISOString(),
    }));
  };

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.name.trim()) {
      setMessage("Informe o nome da categoria.");
      return;
    }

    const normalized = {
      ...draft,
      slug: draft.slug || makeSlug(draft.name),
      metaTitle: draft.metaTitle || `${draft.name} | Tactical Training`,
      metaDescription: draft.metaDescription || draft.description,
      focusKeyword: draft.focusKeyword || draft.name.toLowerCase(),
      updatedAt: new Date().toISOString(),
    };
    const exists = state.categories.some((category) => category.id === normalized.id);
    const next = exists
      ? state.categories.map((category) => (category.id === normalized.id ? normalized : category))
      : [normalized, ...state.categories];

    updateCollection("categories", next, `Categoria ${normalized.name} salva`, "Categorias");
    setDraft(blankCategory());
    setEditing(false);
    setMessage("Categoria salva com sucesso.");
  };

  const edit = (category: AdminCategory) => {
    setDraft(category);
    setEditing(true);
    setMessage("");
  };

  const remove = (id: string) => {
    if (!window.confirm("Excluir esta categoria? Produtos associados nao serao removidos.")) return;
    updateCollection(
      "categories",
      state.categories.filter((category) => category.id !== id),
      "Categoria removida",
      "Categorias",
    );
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Catalogo"
        title="Categorias"
        description="Organize categorias, subcategorias, imagens, icones, ordem de exibicao e SEO individual."
      />

      {message && <div className="mb-4 rounded-md bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{message}</div>}

      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <AdminPanel>
          <PanelHeader title="Categorias cadastradas" description="Use status ativo/inativo para controlar a exibicao na loja." />
          {sorted.length === 0 ? (
            <div className="p-4">
              <EmptyState title="Nenhuma categoria" description="Cadastre a primeira categoria da loja." />
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {sorted.map((category) => (
                <article key={category.id} className="grid gap-3 p-4 md:grid-cols-[64px_1fr_120px_130px] md:items-center">
                  <img src={category.image} alt={category.name} className="h-16 w-16 rounded-md bg-slate-100 object-cover" />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-bold text-slate-950">{category.name}</h2>
                      <StatusBadge status={category.status} />
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">{category.description}</p>
                    <div className="mt-1 text-xs text-slate-400">/{category.slug} - Icone: {category.icon}</div>
                  </div>
                  <div className="text-sm">
                    <div className="text-xs text-slate-500">Ordem</div>
                    <div className="font-bold">{category.displayOrder}</div>
                  </div>
                  <div className="flex gap-2 md:justify-end">
                    <button
                      onClick={() => edit(category)}
                      className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-semibold md:flex-none"
                    >
                      <Edit size={15} />
                      Editar
                    </button>
                    <button
                      onClick={() => remove(category.id)}
                      className="inline-flex h-10 w-11 items-center justify-center rounded-md border border-rose-200 text-rose-700"
                      aria-label="Excluir categoria"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </AdminPanel>

        <AdminPanel>
          <PanelHeader
            title={editing ? "Editar categoria" : "Nova categoria"}
            actions={
              editing && (
                <button
                  onClick={() => {
                    setDraft(blankCategory());
                    setEditing(false);
                  }}
                  className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold"
                >
                  Limpar
                </button>
              )
            }
          />
          <form onSubmit={save} className="space-y-4 p-4">
            <Field label="Nome">
              <input className={inputClass} value={draft.name} onChange={(event) => update("name", event.target.value)} />
            </Field>
            <Field label="Slug">
              <input className={inputClass} value={draft.slug} onChange={(event) => update("slug", makeSlug(event.target.value))} />
            </Field>
            <Field label="Descricao">
              <textarea className={textareaClass} value={draft.description} onChange={(event) => update("description", event.target.value)} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Imagem">
                <input className={inputClass} value={draft.image} onChange={(event) => update("image", event.target.value)} />
              </Field>
              <Field label="Icone">
                <input className={inputClass} value={draft.icon} onChange={(event) => update("icon", event.target.value)} />
              </Field>
              <Field label="Categoria pai">
                <select className={inputClass} value={draft.parentId} onChange={(event) => update("parentId", event.target.value)}>
                  <option value="">Categoria raiz</option>
                  {state.categories
                    .filter((category) => category.id !== draft.id)
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </Field>
              <Field label="Status">
                <select className={inputClass} value={draft.status} onChange={(event) => update("status", event.target.value as AdminCategory["status"])}>
                  <option value="active">Ativa</option>
                  <option value="draft">Rascunho</option>
                  <option value="inactive">Inativa</option>
                </select>
              </Field>
              <Field label="Ordem">
                <input
                  type="number"
                  className={inputClass}
                  value={draft.displayOrder}
                  onChange={(event) => update("displayOrder", Number(event.target.value))}
                />
              </Field>
              <Field label="Palavra-chave">
                <input className={inputClass} value={draft.focusKeyword} onChange={(event) => update("focusKeyword", event.target.value)} />
              </Field>
            </div>
            <Field label="Meta title">
              <input className={inputClass} value={draft.metaTitle} onChange={(event) => update("metaTitle", event.target.value)} />
            </Field>
            <Field label="Meta description">
              <textarea className={textareaClass} value={draft.metaDescription} onChange={(event) => update("metaDescription", event.target.value)} />
            </Field>
            <GooglePreview
              title={draft.metaTitle}
              description={draft.metaDescription}
              url={`https://tacticaltraining.com.br/categoria/${draft.slug || "categoria"}`}
            />
            <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-red-600 text-sm font-bold text-white transition hover:bg-red-700">
              <FolderPlus size={16} />
              Salvar categoria
            </button>
          </form>
        </AdminPanel>
      </div>
    </>
  );
}
