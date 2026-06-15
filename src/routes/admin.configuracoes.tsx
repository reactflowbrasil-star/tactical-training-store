import { createFileRoute } from "@tanstack/react-router";
import { RotateCcw, Save } from "lucide-react";
import {
  AdminPageHeader,
  AdminPanel,
  Field,
  PanelHeader,
  inputClass,
  textareaClass,
} from "@/components/admin/AdminShell";
import { AdminShell } from "@/components/admin/AdminShell";
import { type StoreSettings, useAdminStore } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/configuracoes")({
  head: () => ({ meta: [{ title: "Configuracoes | Admin Tactical Training" }] }),
  component: SettingsRoute,
});

function SettingsRoute() {
  return (
    <AdminShell>
      <SettingsPage />
    </AdminShell>
  );
}

function SettingsPage() {
  const { state, updateCollection, resetStore } = useAdminStore();

  const update = <Key extends keyof StoreSettings>(key: Key, value: StoreSettings[Key]) => {
    updateCollection("settings", { ...state.settings, [key]: value });
  };

  const save = () => {
    updateCollection("settings", state.settings, "Configuracoes gerais salvas", "Configuracoes");
  };

  const reset = () => {
    if (window.confirm("Restaurar dados iniciais do painel? Alteracoes locais serao perdidas.")) resetStore();
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Sistema"
        title="Configuracoes da loja"
        description="Edite marca, contatos, redes sociais, politicas, SEO global, compartilhamento e PWA."
        actions={
          <>
            <button
              onClick={reset}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <RotateCcw size={16} />
              Restaurar dados
            </button>
            <button
              onClick={save}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-red-600 px-4 text-sm font-bold text-white transition hover:bg-red-700"
            >
              <Save size={16} />
              Salvar
            </button>
          </>
        }
      />

      <div className="grid gap-5 xl:grid-cols-2">
        <AdminPanel>
          <PanelHeader title="Identidade e contato" />
          <div className="grid gap-4 p-4 sm:grid-cols-2">
            <Field label="Nome da loja">
              <input className={inputClass} value={state.settings.storeName} onChange={(event) => update("storeName", event.target.value)} />
            </Field>
            <Field label="Cor principal">
              <input className={inputClass} value={state.settings.primaryColor} onChange={(event) => update("primaryColor", event.target.value)} />
            </Field>
            <Field label="Logo URL">
              <input className={inputClass} value={state.settings.logoUrl} onChange={(event) => update("logoUrl", event.target.value)} />
            </Field>
            <Field label="Favicon URL">
              <input className={inputClass} value={state.settings.faviconUrl} onChange={(event) => update("faviconUrl", event.target.value)} />
            </Field>
            <Field label="WhatsApp">
              <input className={inputClass} value={state.settings.whatsapp} onChange={(event) => update("whatsapp", event.target.value)} />
            </Field>
            <Field label="E-mail">
              <input className={inputClass} value={state.settings.email} onChange={(event) => update("email", event.target.value)} />
            </Field>
            <Field label="Endereco" className="sm:col-span-2">
              <input className={inputClass} value={state.settings.address} onChange={(event) => update("address", event.target.value)} />
            </Field>
            <Field label="Instagram">
              <input className={inputClass} value={state.settings.instagram} onChange={(event) => update("instagram", event.target.value)} />
            </Field>
            <Field label="Facebook">
              <input className={inputClass} value={state.settings.facebook} onChange={(event) => update("facebook", event.target.value)} />
            </Field>
          </div>
        </AdminPanel>

        <AdminPanel>
          <PanelHeader title="PWA" description="Configuracao para instalacao no celular e modo standalone." />
          <div className="grid gap-4 p-4 sm:grid-cols-2">
            <Field label="Nome curto">
              <input className={inputClass} value={state.settings.pwaShortName} onChange={(event) => update("pwaShortName", event.target.value)} />
            </Field>
            <Field label="Theme color">
              <input className={inputClass} value={state.settings.pwaThemeColor} onChange={(event) => update("pwaThemeColor", event.target.value)} />
            </Field>
            <Field label="Descricao PWA" className="sm:col-span-2">
              <textarea className={textareaClass} value={state.settings.pwaDescription} onChange={(event) => update("pwaDescription", event.target.value)} />
            </Field>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
              <div className="text-sm font-black text-slate-950">Arquivos ativos</div>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                <li>/manifest.json</li>
                <li>/sw.js</li>
                <li>/icon.svg</li>
                <li>Meta tags PWA no root HTML</li>
              </ul>
            </div>
          </div>
        </AdminPanel>

        <AdminPanel>
          <PanelHeader title="Politicas e checkout" />
          <div className="space-y-4 p-4">
            <Field label="Politica de privacidade">
              <textarea className={textareaClass} value={state.settings.privacyPolicy} onChange={(event) => update("privacyPolicy", event.target.value)} />
            </Field>
            <Field label="Termos de uso">
              <textarea className={textareaClass} value={state.settings.terms} onChange={(event) => update("terms", event.target.value)} />
            </Field>
            <Field label="Informacoes de entrega">
              <textarea className={textareaClass} value={state.settings.shippingInfo} onChange={(event) => update("shippingInfo", event.target.value)} />
            </Field>
            <Field label="Informacoes de pagamento">
              <textarea className={textareaClass} value={state.settings.paymentInfo} onChange={(event) => update("paymentInfo", event.target.value)} />
            </Field>
          </div>
        </AdminPanel>

        <AdminPanel>
          <PanelHeader title="SEO global e compartilhamento" />
          <div className="space-y-4 p-4">
            <Field label="Titulo SEO padrao">
              <input className={inputClass} value={state.settings.defaultSeoTitle} onChange={(event) => update("defaultSeoTitle", event.target.value)} />
            </Field>
            <Field label="Descricao SEO padrao">
              <textarea className={textareaClass} value={state.settings.defaultSeoDescription} onChange={(event) => update("defaultSeoDescription", event.target.value)} />
            </Field>
            <Field label="Palavras-chave">
              <input className={inputClass} value={state.settings.defaultKeywords} onChange={(event) => update("defaultKeywords", event.target.value)} />
            </Field>
            <Field label="URL canonica">
              <input className={inputClass} value={state.settings.canonicalUrl} onChange={(event) => update("canonicalUrl", event.target.value)} />
            </Field>
            <Field label="Imagem padrao de compartilhamento">
              <input className={inputClass} value={state.settings.defaultShareImage} onChange={(event) => update("defaultShareImage", event.target.value)} />
            </Field>
          </div>
        </AdminPanel>
      </div>
    </>
  );
}
