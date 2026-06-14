import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Truck, ShieldCheck, RefreshCw, CreditCard, Flame } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { CategoryCard } from "@/components/CategoryCard";
import { PRODUCTS } from "@/lib/products";
import hero from "@/assets/hero-tactical.jpg";
import catCaca from "@/assets/cat-caca.jpg";
import catPesca from "@/assets/cat-pesca.jpg";
import catCamping from "@/assets/cat-camping.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TACTICAL TRAINING — Equipamentos para Caça, Pesca e Camping" },
      { name: "description", content: "Loja oficial TACTICAL TRAINING. Equipamentos táticos premium para caça, pesca e camping. Frete grátis acima de R$ 499." },
      { property: "og:title", content: "TACTICAL TRAINING" },
      { property: "og:description", content: "Equipamentos táticos para outdoor extremo." },
    ],
  }),
  component: Home,
});

function Home() {
  const bestsellers = PRODUCTS.filter((p) => p.bestseller);
  const novelties = PRODUCTS.filter((p) => p.novelty);

  return (
    <Layout>
      {/* HERO */}
      <section className="relative bg-ink text-white overflow-hidden">
        <img
          src={hero}
          alt="Operador tático na floresta"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-transparent" />
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-[60%] h-[120%] bg-brand/30 blur-3xl rounded-full pointer-events-none" />

        <div className="relative container mx-auto px-4 py-24 md:py-36 max-w-6xl">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-brand text-white text-xs font-display italic font-bold uppercase tracking-widest px-3 py-1.5">
              <Flame size={14} /> Coleção Tática 2026
            </div>
            <h1 className="mt-6 text-5xl md:text-7xl lg:text-8xl font-display italic font-extrabold uppercase leading-[0.9]">
              Domine o <span className="text-brand">terreno.</span>
              <br />
              Sem desculpas.
            </h1>
            <p className="mt-6 text-lg text-white/80 max-w-xl">
              Equipamentos táticos forjados para caçadores, pescadores e aventureiros que
              encaram o outdoor de verdade. Performance, durabilidade e estilo militar.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/categoria/$slug"
                params={{ slug: "caca" }}
                className="group bg-brand hover:bg-brand-dark text-white px-8 py-4 font-display italic font-bold uppercase tracking-wider text-sm flex items-center gap-3 transition"
              >
                Comprar agora <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
              </Link>
              <Link
                to="/categoria/$slug"
                params={{ slug: "camping" }}
                className="border-2 border-white/30 hover:border-white text-white px-8 py-4 font-display italic font-bold uppercase tracking-wider text-sm transition"
              >
                Ver coleções
              </Link>
            </div>
          </div>
        </div>

        {/* Diagonal bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-background" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 80%)" }} />
      </section>

      {/* Trust strip */}
      <section className="bg-ink-2 text-white">
        <div className="container mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { Icon: Truck, t: "Frete Grátis", s: "Acima de R$ 499" },
            { Icon: ShieldCheck, t: "Pagamento Seguro", s: "SSL + Antifraude" },
            { Icon: RefreshCw, t: "Troca Fácil", s: "Até 30 dias" },
            { Icon: CreditCard, t: "12x sem juros", s: "Em todo o site" },
          ].map(({ Icon, t, s }) => (
            <div key={t} className="flex items-center gap-3">
              <div className="w-11 h-11 bg-brand flex items-center justify-center shrink-0">
                <Icon size={20} />
              </div>
              <div>
                <div className="font-display italic font-bold uppercase text-sm">{t}</div>
                <div className="text-xs text-white/60">{s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <SectionHeader eyebrow="Explore" title="Categorias em destaque" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <CategoryCard slug="caca" title="Caça" subtitle="Precisão & Performance" image={catCaca} />
          <CategoryCard slug="pesca" title="Pesca" subtitle="Da margem ao alto-mar" image={catPesca} />
          <CategoryCard slug="camping" title="Camping" subtitle="Conquiste a natureza" image={catCamping} />
        </div>
      </section>

      {/* Bestsellers */}
      <section className="container mx-auto px-4 py-10">
        <SectionHeader eyebrow="Top 10" title="Mais vendidos" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {bestsellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Promo banner */}
      <section className="container mx-auto px-4 my-16">
        <div className="relative overflow-hidden bg-brand text-white p-10 md:p-16 grid md:grid-cols-2 gap-8 items-center">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-ink/20 rounded-full blur-3xl" />
          <div className="relative">
            <div className="text-xs uppercase tracking-[0.4em] font-bold">Oferta limitada</div>
            <h3 className="mt-3 text-4xl md:text-6xl font-display italic font-extrabold uppercase leading-none">
              -15% off
              <br />
              <span className="text-ink">no primeiro pedido</span>
            </h3>
            <p className="mt-4 text-white/90 max-w-md">
              Use o cupom abaixo no checkout e leve sua primeira missão com desconto.
            </p>
          </div>
          <div className="relative flex flex-col items-start md:items-end gap-4">
            <div className="bg-ink text-white border-2 border-dashed border-white/40 px-6 py-4 font-display italic font-extrabold text-3xl tracking-widest">
              TACTICAL15
            </div>
            <Link
              to="/categoria/$slug"
              params={{ slug: "acessorios" }}
              className="bg-ink hover:bg-ink-2 text-white px-6 py-3 font-display italic font-bold uppercase tracking-wider text-sm flex items-center gap-2"
            >
              Usar cupom <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Novelties */}
      <section className="container mx-auto px-4 py-10 pb-20">
        <SectionHeader eyebrow="Recém-chegados" title="Novidades" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {novelties.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </Layout>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <div className="text-xs uppercase tracking-[0.4em] text-brand font-bold">{eyebrow}</div>
        <h2 className="mt-2 text-3xl md:text-5xl font-display italic font-extrabold uppercase text-ink">
          {title}
        </h2>
      </div>
      <div className="hidden md:block h-1 w-32 bg-ink" />
    </div>
  );
}
