import { createFileRoute } from "@tanstack/react-router";
import { Copy, Send, Sparkles } from "lucide-react";
import { useState } from "react";
import {
  AdminPageHeader,
  AdminPanel,
  Field,
  PanelHeader,
  inputClass,
  textareaClass,
} from "@/components/admin/AdminShell";
import { AdminShell } from "@/components/admin/AdminShell";
import { generateAiCopy, type AiCopyInput, type AiCopyResult, useAdminStore } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/ia-copywriter")({
  head: () => ({ meta: [{ title: "IA Copywriter | Admin Tactical Training" }] }),
  component: AiCopyRoute,
});

const tones = ["Profissional", "Comercial", "Premium", "Direto", "Persuasivo", "Tecnico", "Jovem", "Sofisticado"];

function AiCopyRoute() {
  return (
    <AdminShell>
      <AiCopyPage />
    </AdminShell>
  );
}

function AiCopyPage() {
  const { state, updateCollection } = useAdminStore();
  const [targetType, setTargetType] = useState<"product" | "category">("product");
  const [targetId, setTargetId] = useState(state.products[0]?.id ?? "");
  const [input, setInput] = useState<AiCopyInput>({
    productName: state.products[0]?.name ?? "",
    category: state.products[0]?.category ?? "",
    audience: "clientes que buscam equipamento outdoor confiavel",
    tone: "Comercial",
    focusKeyword: "equipamento tatico",
    benefits: "resistencia, praticidade e seguranca",
    differentials: "curadoria especializada e produtos testados para campo",
    objective: "aumentar conversao e reduzir duvidas antes da compra",
  });
  const [result, setResult] = useState<AiCopyResult | null>(null);
  const [message, setMessage] = useState("");

  const update = <Key extends keyof AiCopyInput>(key: Key, value: AiCopyInput[Key]) => {
    setInput((current) => ({ ...current, [key]: value }));
  };

  const syncTarget = (id: string) => {
    setTargetId(id);
    const source =
      targetType === "product"
        ? state.products.find((product) => product.id === id)
        : state.categories.find((category) => category.id === id);
    if (!source) return;
    setInput((current) => ({
      ...current,
      productName: source.name,
      category: "category" in source ? source.category : source.name,
      focusKeyword: "focusKeyword" in source ? source.focusKeyword : current.focusKeyword,
    }));
  };

  const generate = (event: React.FormEvent) => {
    event.preventDefault();
    const output = generateAiCopy(input);
    setResult(output);
    setMessage("Resultado gerado pela IA simulada.");
  };

  const apply = () => {
    if (!result) return;
    if (targetType === "product") {
      updateCollection(
        "products",
        state.products.map((product) =>
          product.id === targetId
            ? {
                ...product,
                shortDescription: result.shortDescription,
                description: result.description,
                metaTitle: result.metaTitle,
                metaDescription: result.metaDescription,
                focusKeyword: result.keywords.split(",")[0],
                imageAlt: result.imageAlt,
                updatedAt: new Date().toISOString(),
              }
            : product,
        ),
        "Copy aplicada ao produto",
        "IA",
      );
    } else {
      updateCollection(
        "categories",
        state.categories.map((category) =>
          category.id === targetId
            ? {
                ...category,
                description: result.shortDescription,
                metaTitle: result.metaTitle,
                metaDescription: result.metaDescription,
                focusKeyword: result.keywords.split(",")[0],
                updatedAt: new Date().toISOString(),
              }
            : category,
        ),
        "Copy aplicada a categoria",
        "IA",
      );
    }
    setMessage("Resultado aplicado no cadastro selecionado.");
  };

  const targets = targetType === "product" ? state.products : state.categories;

  return (
    <>
      <AdminPageHeader
        eyebrow="Assistente de IA"
        title="IA Copywriter"
        description="Gere descricoes, titulos, metadados, CTAs, textos ALT, palavras-chave e sugestoes de SEO com base no briefing."
      />

      {message && <div className="mb-4 rounded-md bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{message}</div>}

      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <AdminPanel>
          <PanelHeader title="Briefing da IA" description="Dados usados para gerar textos comerciais e SEO." />
          <form onSubmit={generate} className="space-y-4 p-4">
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setTargetType("product")}
                className={`h-10 rounded-md text-sm font-bold ${targetType === "product" ? "bg-white text-red-700 shadow-sm" : "text-slate-600"}`}
              >
                Produto
              </button>
              <button
                type="button"
                onClick={() => setTargetType("category")}
                className={`h-10 rounded-md text-sm font-bold ${targetType === "category" ? "bg-white text-red-700 shadow-sm" : "text-slate-600"}`}
              >
                Categoria
              </button>
            </div>

            <Field label="Aplicar em">
              <select className={inputClass} value={targetId} onChange={(event) => syncTarget(event.target.value)}>
                {targets.map((target) => (
                  <option key={target.id} value={target.id}>
                    {target.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Nome do produto ou tema">
              <input className={inputClass} value={input.productName} onChange={(event) => update("productName", event.target.value)} />
            </Field>
            <Field label="Categoria">
              <input className={inputClass} value={input.category} onChange={(event) => update("category", event.target.value)} />
            </Field>
            <Field label="Publico-alvo">
              <input className={inputClass} value={input.audience} onChange={(event) => update("audience", event.target.value)} />
            </Field>
            <Field label="Tom de voz">
              <select className={inputClass} value={input.tone} onChange={(event) => update("tone", event.target.value)}>
                {tones.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Palavra-chave principal">
              <input className={inputClass} value={input.focusKeyword} onChange={(event) => update("focusKeyword", event.target.value)} />
            </Field>
            <Field label="Beneficios do produto">
              <textarea className={textareaClass} value={input.benefits} onChange={(event) => update("benefits", event.target.value)} />
            </Field>
            <Field label="Diferenciais">
              <textarea className={textareaClass} value={input.differentials} onChange={(event) => update("differentials", event.target.value)} />
            </Field>
            <Field label="Objetivo da copy">
              <textarea className={textareaClass} value={input.objective} onChange={(event) => update("objective", event.target.value)} />
            </Field>
            <button className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-red-600 text-sm font-black text-white transition hover:bg-red-700">
              <Sparkles size={17} />
              Gerar copy e SEO
            </button>
          </form>
        </AdminPanel>

        <AdminPanel>
          <PanelHeader
            title="Resultado gerado"
            description="Copie campos individualmente ou aplique direto no cadastro selecionado."
            actions={
              result && (
                <button
                  onClick={apply}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-red-600 px-4 text-sm font-bold text-white transition hover:bg-red-700"
                >
                  <Send size={16} />
                  Aplicar resultado
                </button>
              )
            }
          />
          {!result ? (
            <div className="p-4">
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                <Sparkles className="mx-auto text-red-600" size={32} />
                <div className="mt-3 font-bold text-slate-900">Nenhum texto gerado ainda</div>
                <p className="mt-1 text-sm text-slate-500">Preencha o briefing e clique em gerar.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 p-4">
              <ResultBlock label="Titulo otimizado" value={result.title} />
              <ResultBlock label="Descricao curta" value={result.shortDescription} />
              <ResultBlock label="Descricao completa" value={result.description} large />
              <div className="grid gap-4 lg:grid-cols-2">
                <ResultBlock label="Meta title" value={result.metaTitle} />
                <ResultBlock label="Meta description" value={result.metaDescription} />
                <ResultBlock label="Palavras-chave" value={result.keywords} />
                <ResultBlock label="CTA" value={result.cta} />
                <ResultBlock label="Texto ALT" value={result.imageAlt} />
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <div className="text-sm font-black text-slate-950">Sugestoes de melhoria</div>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {result.improvements.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </AdminPanel>
      </div>
    </>
  );
}

function ResultBlock({ label, value, large = false }: { label: string; value: string; large?: boolean }) {
  const copy = () => navigator.clipboard?.writeText(value);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-black uppercase text-slate-500">{label}</div>
        <button
          onClick={copy}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-100"
          aria-label={`Copiar ${label}`}
        >
          <Copy size={14} />
        </button>
      </div>
      <p className={`mt-2 text-sm leading-6 text-slate-800 ${large ? "" : "line-clamp-4"}`}>{value}</p>
    </div>
  );
}
