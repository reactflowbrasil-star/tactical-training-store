import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Target, Truck } from "lucide-react";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre - TACTICAL TRAINING" },
      { name: "description", content: "Conheca a Tactical Training, loja especializada em equipamentos taticos para caca, pesca e camping." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <Layout>
      <section className="bg-ink py-14 text-white">
        <div className="container mx-auto px-4">
          <div className="text-xs font-bold uppercase tracking-[0.4em] text-brand">Institucional</div>
          <h1 className="mt-2 max-w-3xl text-4xl font-display italic font-extrabold uppercase md:text-6xl">
            Equipamentos para quem leva o outdoor a serio.
          </h1>
        </div>
      </section>
      <section className="container mx-auto grid gap-8 px-4 py-12 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5 text-base leading-8 text-muted-foreground">
          <p>
            A Tactical Training nasceu para atender praticantes de caca, pesca, camping e aventura que precisam de produtos confiaveis, resistentes e objetivos.
          </p>
          <p>
            Nossa curadoria prioriza desempenho em campo, boa ergonomia, seguranca na compra e informacao clara para que cada cliente escolha o equipamento certo.
          </p>
          <Link
            to="/produtos"
            className="inline-flex items-center gap-2 bg-brand px-6 py-3 font-display italic font-bold uppercase tracking-wider text-white transition hover:bg-brand-dark"
          >
            Ver produtos <ArrowRight size={17} />
          </Link>
        </div>
        <div className="grid gap-3">
          {[
            { icon: Target, title: "Curadoria tecnica", text: "Produtos selecionados por uso, resistencia e aplicacao real." },
            { icon: ShieldCheck, title: "Compra segura", text: "Checkout com dados protegidos e atendimento direto." },
            { icon: Truck, title: "Entrega nacional", text: "Envio calculado por CEP e frete gratis em pedidos elegiveis." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="border border-border bg-white p-5">
              <Icon className="text-brand" size={24} />
              <h2 className="mt-3 font-display italic text-xl font-bold uppercase text-ink">{title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
