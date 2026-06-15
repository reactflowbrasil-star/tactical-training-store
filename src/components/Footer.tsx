import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { Logo } from "./Logo";
import { CATEGORIES } from "@/lib/products";

export function Footer() {
  return (
    <footer className="mt-20 bg-ink text-white/80">
      <div className="border-t-4 border-brand" />
      <div className="container mx-auto grid grid-cols-2 gap-10 px-4 py-14 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed">
            Equipamentos taticos para caca, pesca e camping. Performance, durabilidade e estilo
            militar para quem encara o outdoor de verdade.
          </p>
          <div className="mt-5 flex gap-3">
            {[Instagram, Facebook, Youtube].map((Icon, index) => (
              <a
                key={index}
                href="#"
                className="flex h-9 w-9 items-center justify-center bg-ink-2 transition hover:bg-brand"
                aria-label="Social"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-display italic font-bold uppercase tracking-wider text-white">
            Categorias
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/produtos" className="transition hover:text-brand">
                Todos os produtos
              </Link>
            </li>
            {CATEGORIES.map((category) => (
              <li key={category.slug}>
                <Link
                  to="/categoria/$slug"
                  params={{ slug: category.slug }}
                  className="transition hover:text-brand"
                >
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-display italic font-bold uppercase tracking-wider text-white">
            Institucional
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link className="transition hover:text-brand" to="/sobre">
                Quem somos
              </Link>
            </li>
            <li>
              <Link className="transition hover:text-brand" to="/contato">
                Contato
              </Link>
            </li>
            <li>
              <Link className="transition hover:text-brand" to="/politica-de-privacidade">
                Politica de privacidade
              </Link>
            </li>
            <li>
              <Link className="transition hover:text-brand" to="/termos-de-uso">
                Termos de uso
              </Link>
            </li>
            <li>
              <Link className="transition hover:text-brand" to="/admin/login">
                Area administrativa
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-display italic font-bold uppercase tracking-wider text-white">
            Contato
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <Phone size={15} className="mt-0.5 text-brand" /> (11) 4002-8922
            </li>
            <li className="flex items-start gap-2">
              <Mail size={15} className="mt-0.5 text-brand" /> contato@tacticaltraining.com.br
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={15} className="mt-0.5 text-brand" /> Sao Paulo - SP
            </li>
          </ul>
          <div className="mt-5">
            <div className="mb-2 text-xs uppercase tracking-widest text-white/60">Pagamento</div>
            <div className="flex flex-wrap gap-1.5">
              {["PIX", "VISA", "MASTER", "ELO", "AMEX", "BOLETO"].map((payment) => (
                <span key={payment} className="border border-ink-3 bg-ink-2 px-2 py-1 text-[10px] font-bold">
                  {payment}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-ink-2 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} TACTICAL TRAINING - Todos os direitos reservados.
      </div>
    </footer>
  );
}
