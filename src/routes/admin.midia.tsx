import { createFileRoute } from "@tanstack/react-router";
import { Copy, ImagePlus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  AdminPageHeader,
  AdminPanel,
  Field,
  PanelHeader,
  inputClass,
} from "@/components/admin/AdminShell";
import { AdminShell } from "@/components/admin/AdminShell";
import { makeId, makeSlug, type MediaItem, useAdminStore } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/midia")({
  head: () => ({ meta: [{ title: "Midia | Admin Tactical Training" }] }),
  component: MediaRoute,
});

const blankMedia = (): MediaItem => ({
  id: makeId("media"),
  name: "",
  url: "",
  alt: "",
  linkedTo: "",
  type: "produto",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

function MediaRoute() {
  return (
    <AdminShell>
      <MediaPage />
    </AdminShell>
  );
}

function MediaPage() {
  const { state, updateCollection } = useAdminStore();
  const [draft, setDraft] = useState<MediaItem>(() => blankMedia());
  const [message, setMessage] = useState("");

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.url.trim()) {
      setMessage("Informe a URL da imagem.");
      return;
    }

    const normalized = {
      ...draft,
      name: draft.name || `${makeSlug(draft.alt || "imagem-tactical")}.jpg`,
      updatedAt: new Date().toISOString(),
    };
    updateCollection("media", [normalized, ...state.media], "Imagem adicionada a biblioteca", "Midia");
    setDraft(blankMedia());
    setMessage("Imagem adicionada com sucesso.");
  };

  const remove = (id: string) => {
    if (!window.confirm("Excluir esta imagem da biblioteca?")) return;
    updateCollection(
      "media",
      state.media.filter((item) => item.id !== id),
      "Imagem removida",
      "Midia",
    );
  };

  const updateMedia = (item: MediaItem) => {
    updateCollection(
      "media",
      state.media.map((media) => (media.id === item.id ? item : media)),
      "Metadados de imagem atualizados",
      "Midia",
    );
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Assets"
        title="Biblioteca de midia"
        description="Gerencie imagens, texto ALT, nome SEO e associacao com produtos, categorias ou banners."
      />

      {message && <div className="mb-4 rounded-md bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{message}</div>}

      <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <AdminPanel>
          <PanelHeader title="Adicionar imagem" description="Upload real deve ser conectado ao backend depois." />
          <form onSubmit={save} className="space-y-4 p-4">
            <Field label="URL da imagem">
              <input className={inputClass} value={draft.url} onChange={(event) => setDraft({ ...draft, url: event.target.value })} />
            </Field>
            <Field label="Texto ALT">
              <input className={inputClass} value={draft.alt} onChange={(event) => setDraft({ ...draft, alt: event.target.value })} />
            </Field>
            <Field label="Nome do arquivo SEO">
              <input className={inputClass} value={draft.name} onChange={(event) => setDraft({ ...draft, name: makeSlug(event.target.value) })} />
            </Field>
            <Field label="Associar a">
              <input className={inputClass} value={draft.linkedTo} onChange={(event) => setDraft({ ...draft, linkedTo: event.target.value })} />
            </Field>
            <Field label="Tipo">
              <select className={inputClass} value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value as MediaItem["type"] })}>
                <option value="produto">Produto</option>
                <option value="categoria">Categoria</option>
                <option value="banner">Banner</option>
                <option value="institucional">Institucional</option>
              </select>
            </Field>
            <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-red-600 text-sm font-bold text-white transition hover:bg-red-700">
              <ImagePlus size={16} />
              Adicionar imagem
            </button>
          </form>
        </AdminPanel>

        <AdminPanel>
          <PanelHeader title={`${state.media.length} imagens`} description="Grid responsivo da biblioteca." />
          <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {state.media.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                <img src={item.url} alt={item.alt} className="aspect-[4/3] w-full bg-slate-100 object-cover" />
                <div className="space-y-3 p-3">
                  <input
                    className={`${inputClass} h-10`}
                    value={item.name}
                    onChange={(event) => updateMedia({ ...item, name: makeSlug(event.target.value), updatedAt: new Date().toISOString() })}
                    aria-label="Nome da imagem"
                  />
                  <input
                    className={`${inputClass} h-10`}
                    value={item.alt}
                    onChange={(event) => updateMedia({ ...item, alt: event.target.value, updatedAt: new Date().toISOString() })}
                    aria-label="Texto ALT"
                  />
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 font-bold">{item.type}</span>
                    <span className="line-clamp-1">{item.linkedTo}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigator.clipboard?.writeText(item.url)}
                      className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md border border-slate-200 text-sm font-semibold"
                    >
                      <Copy size={15} />
                      Copiar URL
                    </button>
                    <button
                      onClick={() => remove(item.id)}
                      className="inline-flex h-10 w-11 items-center justify-center rounded-md border border-rose-200 text-rose-700"
                      aria-label="Excluir imagem"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </AdminPanel>
      </div>
    </>
  );
}
