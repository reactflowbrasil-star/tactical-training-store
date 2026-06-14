import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "./Logo";
import { CATEGORIES } from "@/lib/products";

export function Footer() {
  return (
    <footer className="bg-ink text-white/80 mt-20">
      <div className="border-t-4 border-brand" />
      <div className="container mx-auto px-4 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed">
            Equipamentos táticos para caça, pesca e camping. Performance, durabilidade e estilo
            militar para quem encara o outdoor de verdade.
          </p>
          <div className="flex gap-3 mt-5">
            {[Instagram, Facebook, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 flex items-center justify-center bg-ink-2 hover:bg-brand transition"
                aria-label="Social"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-display italic font-bold uppercase tracking-wider text-sm mb-4">
            Categorias
          </h4>
          <ul className="space-y-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/categoria/$slug"
                  params={{ slug: c.slug }}
                  className="hover:text-brand transition"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-display italic font-bold uppercase tracking-wider text-sm mb-4">
            Institucional
          </h4>
          <ul className="space-y-2 text-sm">
            <li><a className="hover:text-brand transition" href="#">Quem somos</a></li>
            <li><a className="hover:text-brand transition" href="#">Política de troca</a></li>
            <li><a className="hover:text-brand transition" href="#">Política de privacidade</a></li>
            <li><a className="hover:text-brand transition" href="#">Termos de uso</a></li>
            <li><a className="hover:text-brand transition" href="#">Frete e prazos</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-display italic font-bold uppercase tracking-wider text-sm mb-4">
            Contato
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2"><Phone size={15} className="mt-0.5 text-brand" /> (11) 4002-8922</li>
            <li className="flex items-start gap-2"><Mail size={15} className="mt-0.5 text-brand" /> contato@tacticaltraining.com.br</li>
            <li className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 text-brand" /> São Paulo — SP</li>
          </ul>
          <div className="mt-5">
            <div className="text-xs uppercase tracking-widest mb-2 text-white/60">Pagamento</div>
            <div className="flex flex-wrap gap-1.5">
              {["PIX", "VISA", "MASTER", "ELO", "AMEX", "BOLETO"].map((p) => (
                <span key={p} className="text-[10px] font-bold bg-ink-2 px-2 py-1 border border-ink-3">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-ink-2 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} TACTICAL TRAINING — Todos os direitos reservados.
      </div>
    </footer>
  );
}
