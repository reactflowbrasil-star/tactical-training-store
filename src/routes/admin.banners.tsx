import { createFileRoute } from "@tanstack/react-router";
import { Edit, ImagePlus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  AdminPageHeader,
  AdminPanel,
  Field,
  PanelHeader,
  StatusBadge,
  inputClass,
  textareaClass,
} from "@/components/admin/AdminShell";
import { AdminShell } from "@/components/admin/AdminShell";
import { bannerAreas, makeId, type AdminBanner, useAdminStore } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/banners")({
  head: () => ({ meta: [{ title: "Banners | Admin Tactical Training" }] }),
  component: BannersRoute,
});

const blankBanner = (): AdminBanner => ({
  id: makeId("bn"),
  area: bannerAreas[0],
  title: "",
  subtitle: "",
  ctaLabel: "",
  ctaUrl: "",
  desktopImage: "",
  mobileImage: "",
  status: "active",
  displayOrder: 99,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

function BannersRoute() {
  return (
    <AdminShell>
      <BannersPage />
    </AdminShell>
  );
}

function BannersPage() {
  const { state, updateCollection } = useAdminStore();
  const [draft, setDraft] = useState<AdminBanner>(() => blankBanner());
  const [message, setMessage] = useState("");

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.title.trim() || !draft.area) {
      setMessage("Informe area e titulo do banner.");
      return;
    }

    const normalized = { ...draft, updatedAt: new Date().toISOString() };
    const exists = state.banners.some((banner) => banner.id === normalized.id);
    const next = exists
      ? state.banners.map((banner) => (banner.id === normalized.id ? normalized : banner))
      : [normalized, ...state.banners];
    updateCollection("banners", next, `Banner ${normalized.title} salvo`, "Banners");
    setDraft(blankBanner());
    setMessage("Banner salvo com sucesso.");
  };

  const edit = (banner: AdminBanner) => {
    setDraft(banner);
    setMessage("");
  };

  const remove = (id: string) => {
    if (!window.confirm("Excluir este banner?")) return;
    updateCollection(
      "banners",
      state.banners.filter((banner) => banner.id !== id),
      "Banner removido",
      "Banners",
    );
  };

  const update = <Key extends keyof AdminBanner>(key: Key, value: AdminBanner[Key]) => {
    setDraft((current) => ({ ...current, [key]: value, updatedAt: new Date().toISOString() }));
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Conteudo"
        title="Banners e conteudos"
        description="Gerencie banners da home, categorias, promocoes e versoes mobile com CTA e ordem de exibicao."
      />

      {message && <div className="mb-4 rounded-md bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{message}</div>}

      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <AdminPanel>
          <PanelHeader title="Banners cadastrados" />
          <div className="grid gap-4 p-4 lg:grid-cols-2">
            {state.banners
              .slice()
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((banner) => (
                <article key={banner.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                  <img src={banner.desktopImage} alt={banner.title} className="h-40 w-full bg-slate-100 object-cover" />
                  <div className="p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={banner.status} />
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{banner.area}</span>
                    </div>
                    <h2 className="mt-3 text-lg font-black text-slate-950">{banner.title}</h2>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">{banner.subtitle}</p>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => edit(banner)}
                        className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md border border-slate-200 text-sm font-semibold"
                      >
                        <Edit size={15} />
                        Editar
                      </button>
                      <button
                        onClick={() => remove(banner.id)}
                        className="inline-flex h-10 w-11 items-center justify-center rounded-md border border-rose-200 text-rose-700"
                        aria-label="Excluir banner"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
          </div>
        </AdminPanel>

        <AdminPanel>
          <PanelHeader title="Editor de banner" />
          <form onSubmit={save} className="space-y-4 p-4">
            <Field label="Area de exibicao">
              <select className={inputClass} value={draft.area} onChange={(event) => update("area", event.target.value)}>
                {bannerAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Titulo">
              <input className={inputClass} value={draft.title} onChange={(event) => update("title", event.target.value)} />
            </Field>
            <Field label="Subtitulo">
              <textarea className={textareaClass} value={draft.subtitle} onChange={(event) => update("subtitle", event.target.value)} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Botao CTA">
                <input className={inputClass} value={draft.ctaLabel} onChange={(event) => update("ctaLabel", event.target.value)} />
              </Field>
              <Field label="Link do botao">
                <input className={inputClass} value={draft.ctaUrl} onChange={(event) => update("ctaUrl", event.target.value)} />
              </Field>
            </div>
            <Field label="Imagem desktop">
              <input className={inputClass} value={draft.desktopImage} onChange={(event) => update("desktopImage", event.target.value)} />
            </Field>
            <Field label="Imagem mobile">
              <input className={inputClass} value={draft.mobileImage} onChange={(event) => update("mobileImage", event.target.value)} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Status">
                <select className={inputClass} value={draft.status} onChange={(event) => update("status", event.target.value as AdminBanner["status"])}>
                  <option value="active">Ativo</option>
                  <option value="draft">Rascunho</option>
                  <option value="inactive">Inativo</option>
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
            </div>
            <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-red-600 text-sm font-bold text-white transition hover:bg-red-700">
              <ImagePlus size={16} />
              Salvar banner
            </button>
          </form>
        </AdminPanel>
      </div>
    </>
  );
}
