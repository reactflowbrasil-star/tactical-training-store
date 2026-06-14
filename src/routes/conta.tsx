import { createFileRoute, Link } from "@tanstack/react-router";
import { User } from "lucide-react";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/conta")({
  head: () => ({ meta: [{ title: "Minha Conta — TACTICAL TRAINING" }] }),
  component: AccountPage,
});

function AccountPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand mx-auto flex items-center justify-center">
            <User size={28} className="text-white" />
          </div>
          <h1 className="mt-4 text-3xl font-display italic font-extrabold uppercase text-ink">Acesse sua conta</h1>
          <p className="text-sm text-muted-foreground mt-2">Acompanhe pedidos e ofertas exclusivas.</p>
        </div>

        <form className="space-y-4 bg-white border border-border p-6">
          <label className="block text-sm">
            <span className="text-xs uppercase tracking-wider font-bold text-ink">E-mail</span>
            <input type="email" className="mt-1 w-full border border-border px-3 py-2.5 focus:outline-none focus:border-brand" />
          </label>
          <label className="block text-sm">
            <span className="text-xs uppercase tracking-wider font-bold text-ink">Senha</span>
            <input type="password" className="mt-1 w-full border border-border px-3 py-2.5 focus:outline-none focus:border-brand" />
          </label>
          <button type="button" className="w-full bg-brand hover:bg-brand-dark text-white py-3 font-display italic font-bold uppercase tracking-wider">
            Entrar
          </button>
          <Link to="/" className="block text-center text-sm text-muted-foreground hover:text-brand">
            Voltar para a loja
          </Link>
        </form>
      </div>
    </Layout>
  );
}
