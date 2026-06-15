import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato - TACTICAL TRAINING" },
      { name: "description", content: "Fale com a Tactical Training por WhatsApp, e-mail ou formulario de contato." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <Layout>
      <section className="bg-ink py-14 text-white">
        <div className="container mx-auto px-4">
          <div className="text-xs font-bold uppercase tracking-[0.4em] text-brand">Atendimento</div>
          <h1 className="mt-2 text-4xl font-display italic font-extrabold uppercase md:text-6xl">Contato</h1>
          <p className="mt-3 max-w-2xl text-sm text-white/65">
            Tire duvidas sobre produtos, pedidos, entrega, pagamento ou trocas.
          </p>
        </div>
      </section>

      <section className="container mx-auto grid gap-8 px-4 py-12 lg:grid-cols-[1fr_380px]">
        <form className="grid gap-4 border border-border bg-white p-6">
          <label className="block">
            <span className="text-xs font-bold uppercase text-ink">Nome</span>
            <input className="mt-1 h-11 w-full border border-border px-3 text-sm outline-none focus:border-brand" />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase text-ink">E-mail</span>
            <input type="email" className="mt-1 h-11 w-full border border-border px-3 text-sm outline-none focus:border-brand" />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase text-ink">Assunto</span>
            <input className="mt-1 h-11 w-full border border-border px-3 text-sm outline-none focus:border-brand" />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase text-ink">Mensagem</span>
            <textarea className="mt-1 min-h-36 w-full border border-border px-3 py-2 text-sm outline-none focus:border-brand" />
          </label>
          <button type="button" className="h-12 bg-brand font-display italic font-bold uppercase tracking-wider text-white transition hover:bg-brand-dark">
            Enviar mensagem
          </button>
        </form>

        <aside className="space-y-3">
          {[
            { icon: MessageCircle, title: "WhatsApp", text: "+55 11 99999-0000" },
            { icon: Mail, title: "E-mail", text: "contato@tacticaltraining.com.br" },
            { icon: Phone, title: "Telefone", text: "(11) 4002-8922" },
            { icon: MapPin, title: "Endereco", text: "Sao Paulo - SP" },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-3 border border-border bg-white p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-brand text-white">
                <Icon size={19} />
              </div>
              <div>
                <h2 className="font-display italic font-bold uppercase text-ink">{title}</h2>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </aside>
      </section>
    </Layout>
  );
}
