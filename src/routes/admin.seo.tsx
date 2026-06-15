import { createFileRoute } from "@tanstack/react-router";
import { Save, SearchCheck } from "lucide-react";
import { useMemo, useState } from "react";
import {
  AdminPageHeader,
  AdminPanel,
  Field,
  GooglePreview,
  PanelHeader,
  inputClass,
  textareaClass,
} from "@/components/admin/AdminShell";
import { AdminShell } from "@/components/admin/AdminShell";
import { getSeoHints, makeId, scoreSeo, type SeoEntry, useAdminStore } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/seo")({
  head: () => ({ meta: [{ title: "SEO | Admin Tactical Training" }] }),
  component: SeoRoute,
});

function SeoRoute() {
  return (
    <AdminShell>
      <SeoPage />
    </AdminShell>
  );
}

function SeoPage() {
  const { state, updateCollection } = useAdminStore();
  const productEntries = useMemo(
    () =>
      state.products.map<SeoEntry>((product) => ({
        id: `seo-product-${product.id}`,
        type: "product",
        target: product.name,
        slug: `/produto/${product.slug}`,
        metaTitle: product.metaTitle,
        metaDescription: product.metaDescription,
        focusKeyword: product.focusKeyword,
        secondaryKeywords: product.tags.join(", "),
        canonicalUrl: `${state.settings.canonicalUrl}/produto/${product.slug}`,
        ogTitle: product.metaTitle,
        ogDescription: product.metaDescription,
        ogImage: product.images[0] ?? state.settings.defaultShareImage,
        robots: "index, follow",
        updatedAt: product.updatedAt,
      })),
    [state.products, state.settings.canonicalUrl, state.settings.defaultShareImage],
  );
  const entries = useMemo(() => [...state.seoEntries, ...productEntries], [productEntries, state.seoEntries]);
  const [selectedId, setSelectedId] = useState(entries[0]?.id ?? "");
  const selected = entries.find((entry) => entry.id === selectedId) ?? entries[0];
  const [draft, setDraft] = useState<SeoEntry | null>(selected ?? null);
  const [message, setMessage] = useState("");

  const select = (entry: SeoEntry) => {
    setSelectedId(entry.id);
    setDraft(entry);
    setMessage("");
  };

  const updateDraft = <Key extends keyof SeoEntry>(key: Key, value: SeoEntry[Key]) => {
    setDraft((current) => (current ? { ...current, [key]: value, updatedAt: new Date().toISOString() } : current));
  };

  const saveEntry = () => {
    if (!draft) return;

    const existingSeo = state.seoEntries.some((entry) => entry.id === draft.id);
    if (draft.type === "product") {
      updateCollection(
        "products",
        state.products.map((product) =>
          `seo-product-${product.id}` === draft.id
            ? {
                ...product,
                metaTitle: draft.metaTitle,
                metaDescription: draft.metaDescription,
                focusKeyword: draft.focusKeyword,
                updatedAt: new Date().toISOString(),
              }
            : product,
        ),
        `SEO do produto ${draft.target} atualizado`,
        "SEO",
      );
    } else {
      const normalized = { ...draft, id: draft.id || makeId("seo") };
      updateCollection(
        "seoEntries",
        existingSeo
          ? state.seoEntries.map((entry) => (entry.id === normalized.id ? normalized : entry))
          : [normalized, ...state.seoEntries],
        `SEO de ${normalized.target} atualizado`,
        "SEO",
      );
    }

    setMessage("SEO salvo com sucesso.");
  };

  const saveSettings = () => {
    updateCollection("settings", state.settings, "SEO global atualizado", "SEO");
    setMessage("Configuracoes globais de SEO salvas.");
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Marketing organico"
        title="SEO completo"
        description="Gerencie SEO global, por pagina, produto e categoria, com pre-visualizacao de busca e campos Open Graph."
      />

      {message && <div className="mb-4 rounded-md bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{message}</div>}

      <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <div className="space-y-5">
          <AdminPanel>
            <PanelHeader title="Itens auditados" description="Clique em um item para editar." />
            <div className="max-h-[520px] space-y-2 overflow-y-auto p-4">
              {entries.map((entry) => {
                const score = scoreSeo(entry);
                return (
                  <button
                    key={entry.id}
                    onClick={() => select(entry)}
                    className={`w-full rounded-md border p-3 text-left transition ${
                      draft?.id === entry.id ? "border-red-300 bg-red-50" : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold text-slate-950">{entry.target}</div>
                        <div className="mt-1 text-xs text-slate-500">{entry.type} - {entry.slug}</div>
                      </div>
                      <div className={`rounded-full px-2 py-1 text-xs font-black ${score >= 85 ? "bg-emerald-50 text-emerald-700" : score >= 60 ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-700"}`}>
                        {score}
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">{getSeoHints(score)}</div>
                  </button>
                );
              })}
            </div>
          </AdminPanel>

          <AdminPanel>
            <PanelHeader title="SEO global da loja" />
            <div className="space-y-3 p-4">
              <Field label="Titulo padrao">
                <input
                  className={inputClass}
                  value={state.settings.defaultSeoTitle}
                  onChange={(event) =>
                    updateCollection("settings", { ...state.settings, defaultSeoTitle: event.target.value })
                  }
                />
              </Field>
              <Field label="Descricao padrao">
                <textarea
                  className={textareaClass}
                  value={state.settings.defaultSeoDescription}
                  onChange={(event) =>
                    updateCollection("settings", { ...state.settings, defaultSeoDescription: event.target.value })
                  }
                />
              </Field>
              <Field label="Palavras-chave padrao">
                <input
                  className={inputClass}
                  value={state.settings.defaultKeywords}
                  onChange={(event) =>
                    updateCollection("settings", { ...state.settings, defaultKeywords: event.target.value })
                  }
                />
              </Field>
              <Field label="URL canonica">
                <input
                  className={inputClass}
                  value={state.settings.canonicalUrl}
                  onChange={(event) =>
                    updateCollection("settings", { ...state.settings, canonicalUrl: event.target.value })
                  }
                />
              </Field>
              <Field label="Imagem padrao de compartilhamento">
                <input
                  className={inputClass}
                  value={state.settings.defaultShareImage}
                  onChange={(event) =>
                    updateCollection("settings", { ...state.settings, defaultShareImage: event.target.value })
                  }
                />
              </Field>
              <button
                onClick={saveSettings}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-red-600 text-sm font-bold text-white transition hover:bg-red-700"
              >
                <Save size={16} />
                Salvar SEO global
              </button>
            </div>
          </AdminPanel>
        </div>

        {draft && (
          <AdminPanel>
            <PanelHeader
              title={`Editar SEO: ${draft.target}`}
              description="Campos usados em title, description, Open Graph, canonical e robots."
              actions={
                <button
                  onClick={saveEntry}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-red-600 px-4 text-sm font-bold text-white transition hover:bg-red-700"
                >
                  <Save size={16} />
                  Salvar
                </button>
              }
            />
            <div className="grid gap-5 p-4 lg:grid-cols-[1fr_360px]">
              <div className="space-y-4">
                <Field label="Meta title" hint={`${draft.metaTitle.length}/65 caracteres recomendados`}>
                  <input className={inputClass} value={draft.metaTitle} onChange={(event) => updateDraft("metaTitle", event.target.value)} />
                </Field>
                <Field label="Meta description" hint={`${draft.metaDescription.length}/160 caracteres recomendados`}>
                  <textarea className={textareaClass} value={draft.metaDescription} onChange={(event) => updateDraft("metaDescription", event.target.value)} />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Palavra-chave principal">
                    <input className={inputClass} value={draft.focusKeyword} onChange={(event) => updateDraft("focusKeyword", event.target.value)} />
                  </Field>
                  <Field label="Palavras-chave secundarias">
                    <input className={inputClass} value={draft.secondaryKeywords} onChange={(event) => updateDraft("secondaryKeywords", event.target.value)} />
                  </Field>
                </div>
                <Field label="URL canonica">
                  <input className={inputClass} value={draft.canonicalUrl} onChange={(event) => updateDraft("canonicalUrl", event.target.value)} />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Open Graph title">
                    <input className={inputClass} value={draft.ogTitle} onChange={(event) => updateDraft("ogTitle", event.target.value)} />
                  </Field>
                  <Field label="Robots">
                    <select className={inputClass} value={draft.robots} onChange={(event) => updateDraft("robots", event.target.value)}>
                      <option value="index, follow">index, follow</option>
                      <option value="noindex, follow">noindex, follow</option>
                      <option value="noindex, nofollow">noindex, nofollow</option>
                    </select>
                  </Field>
                </div>
                <Field label="Open Graph description">
                  <textarea className={textareaClass} value={draft.ogDescription} onChange={(event) => updateDraft("ogDescription", event.target.value)} />
                </Field>
                <Field label="Open Graph image">
                  <input className={inputClass} value={draft.ogImage} onChange={(event) => updateDraft("ogImage", event.target.value)} />
                </Field>
              </div>

              <div className="space-y-4">
                <GooglePreview title={draft.metaTitle} description={draft.metaDescription} url={draft.canonicalUrl} />
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-black text-slate-950">
                    <SearchCheck size={18} className="text-red-600" />
                    Analise automatica
                  </div>
                  <div className="mt-4 text-4xl font-black text-slate-950">{scoreSeo(draft)}<span className="text-base text-slate-500">/100</span></div>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    <li>Meta title entre 35 e 65 caracteres.</li>
                    <li>Meta description entre 90 e 160 caracteres.</li>
                    <li>Palavra-chave principal definida.</li>
                    <li>Canonical absoluta configurada.</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <div className="text-sm font-black text-slate-950">Sitemap e robots.txt</div>
                  <pre className="mt-3 overflow-x-auto rounded-md bg-slate-950 p-3 text-xs text-slate-100">{`User-agent: *
Allow: /
Sitemap: ${state.settings.canonicalUrl}/sitemap.xml`}</pre>
                </div>
              </div>
            </div>
          </AdminPanel>
        )}
      </div>
    </>
  );
}
