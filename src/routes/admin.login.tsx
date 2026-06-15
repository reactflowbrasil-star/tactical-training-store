import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Lock, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { getAdminSession, setAdminSession } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Login administrativo | Tactical Training" }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@tacticaltraining.local");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  useEffect(() => {
    if (getAdminSession()) navigate({ to: "/admin/dashboard" });
  }, [navigate]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.includes("@") || password.length < 6) {
      setError("Informe um e-mail valido e senha com pelo menos 6 caracteres.");
      return;
    }

    setAdminSession(email);
    navigate({ to: "/admin/dashboard" });
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
          <section>
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-red-600 text-sm font-black">
                TT
              </div>
              <div>
                <div className="text-sm font-black uppercase">Tactical Training</div>
                <div className="text-xs text-white/50">Admin Commerce OS</div>
              </div>
            </Link>
            <h1 className="mt-10 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
              Painel profissional para operar a loja sem depender de codigo.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/65">
              Gerencie catalogo, pedidos, usuarios, banners, SEO, midia, PWA e copys comerciais
              em uma interface responsiva, preparada para evoluir para Supabase ou outro backend.
            </p>
            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
              {["Rotas protegidas", "SEO completo", "IA copywriter"].map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <ShieldCheck className="text-red-500" size={20} />
                  <div className="mt-3 text-sm font-bold">{item}</div>
                </div>
              ))}
            </div>
          </section>

          <form onSubmit={submit} className="rounded-lg border border-white/10 bg-white p-5 text-slate-950 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-red-50 text-red-700">
              <Lock size={22} />
            </div>
            <h2 className="mt-5 text-2xl font-black">Entrar no painel</h2>
            <p className="mt-1 text-sm text-slate-500">Sessao local para demonstracao do painel administrativo.</p>

            {error && <div className="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</div>}

            <label className="mt-5 block">
              <span className="text-xs font-bold uppercase text-slate-700">E-mail</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 h-12 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </label>
            <label className="mt-4 block">
              <span className="text-xs font-bold uppercase text-slate-700">Senha</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1 h-12 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />
            </label>

            <button
              type="submit"
              className="mt-5 h-12 w-full rounded-md bg-red-600 text-sm font-black text-white transition hover:bg-red-700"
            >
              Acessar painel
            </button>
            <p className="mt-4 text-xs leading-5 text-slate-500">
              Credenciais demonstrativas ja preenchidas. Nenhuma chave de API e armazenada no codigo.
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
