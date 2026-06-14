import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, CreditCard, QrCode, FileText, Lock } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useCart } from "@/contexts/cart";
import { formatBRL } from "@/lib/products";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — TACTICAL TRAINING" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { detailed, subtotal, clear } = useCart();
  const [pay, setPay] = useState<"pix" | "card" | "boleto">("pix");
  const [done, setDone] = useState(false);
  const nav = useNavigate();

  const shipping = subtotal > 499 || subtotal === 0 ? 0 : 39.9;
  const discount = pay === "pix" ? subtotal * 0.05 : 0;
  const total = Math.max(0, subtotal + shipping - discount);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
    setTimeout(() => {
      clear();
      nav({ to: "/" });
    }, 4000);
  };

  if (done) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center max-w-xl">
          <CheckCircle2 size={72} className="mx-auto text-brand" />
          <h1 className="mt-6 text-4xl font-display italic font-extrabold uppercase text-ink">Pedido confirmado!</h1>
          <p className="mt-3 text-muted-foreground">Você receberá a confirmação por e-mail em instantes.</p>
        </div>
      </Layout>
    );
  }

  if (detailed.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Seu carrinho está vazio.</p>
          <Link to="/" className="mt-4 inline-block text-brand font-bold">Voltar para a loja</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-5xl font-display italic font-extrabold uppercase text-ink">Checkout</h1>

        <form onSubmit={submit} className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
          <div className="space-y-8">
            <Section title="Identificação">
              <div className="grid md:grid-cols-2 gap-4">
                <Input label="Nome completo" required />
                <Input label="E-mail" type="email" required />
                <Input label="CPF" required />
                <Input label="Telefone" required />
              </div>
            </Section>

            <Section title="Endereço de entrega">
              <div className="grid md:grid-cols-3 gap-4">
                <Input label="CEP" required />
                <Input label="Endereço" className="md:col-span-2" required />
                <Input label="Número" required />
                <Input label="Complemento" />
                <Input label="Bairro" required />
                <Input label="Cidade" required />
                <Input label="Estado" required />
              </div>
            </Section>

            <Section title="Forma de pagamento">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "pix" as const, Icon: QrCode, t: "PIX", s: "5% OFF" },
                  { id: "card" as const, Icon: CreditCard, t: "Cartão", s: "Até 12x" },
                  { id: "boleto" as const, Icon: FileText, t: "Boleto", s: "1% OFF" },
                ].map(({ id, Icon, t, s }) => (
                  <button
                    type="button"
                    key={id}
                    onClick={() => setPay(id)}
                    className={`p-4 border-2 text-left transition ${pay === id ? "border-brand bg-brand/5" : "border-border hover:border-ink"}`}
                  >
                    <Icon size={22} className="text-brand" />
                    <div className="mt-2 font-display italic font-bold uppercase text-sm">{t}</div>
                    <div className="text-xs text-muted-foreground">{s}</div>
                  </button>
                ))}
              </div>
              {pay === "card" && (
                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  <Input label="Número do cartão" required />
                  <Input label="Nome impresso" required />
                  <Input label="Validade (MM/AA)" required />
                  <Input label="CVV" required />
                </div>
              )}
              {pay === "pix" && (
                <p className="mt-4 text-sm text-muted-foreground">O QR Code será gerado após a confirmação do pedido.</p>
              )}
              {pay === "boleto" && (
                <p className="mt-4 text-sm text-muted-foreground">O boleto vence em 3 dias úteis.</p>
              )}
            </Section>
          </div>

          <aside className="bg-ink text-white p-6 h-fit sticky top-32 space-y-4">
            <h2 className="font-display italic font-extrabold uppercase tracking-wider text-xl">Pedido</h2>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {detailed.map((it) => (
                <div key={it.id} className="flex gap-3 text-sm">
                  <img src={it.product.image} className="w-12 h-12 object-cover" alt="" />
                  <div className="flex-1 min-w-0">
                    <div className="line-clamp-1">{it.product.name}</div>
                    <div className="text-white/60 text-xs">x{it.qty}</div>
                  </div>
                  <div className="font-bold">{formatBRL(it.product.price * it.qty)}</div>
                </div>
              ))}
            </div>
            <dl className="border-t border-ink-3 pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-white/70">Subtotal</dt><dd>{formatBRL(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-white/70">Frete</dt><dd>{shipping === 0 ? "Grátis" : formatBRL(shipping)}</dd></div>
              {discount > 0 && (
                <div className="flex justify-between text-brand"><dt>Desconto PIX</dt><dd>- {formatBRL(discount)}</dd></div>
              )}
              <div className="border-t border-ink-3 pt-3 flex justify-between text-xl font-display italic font-extrabold">
                <dt>Total</dt><dd>{formatBRL(total)}</dd>
              </div>
            </dl>
            <button
              type="submit"
              className="w-full bg-brand hover:bg-brand-dark py-4 font-display italic font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition"
            >
              <Lock size={16} /> Confirmar pedido
            </button>
            <p className="text-[11px] text-white/50 text-center">Pagamento 100% seguro com criptografia SSL.</p>
          </aside>
        </form>
      </div>
    </Layout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-border p-6">
      <h2 className="font-display italic font-bold uppercase tracking-wider text-ink mb-4 pb-2 border-b-2 border-brand inline-block">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Input({ label, className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={`block text-sm ${className ?? ""}`}>
      <span className="text-xs uppercase tracking-wider font-bold text-ink">{label}</span>
      <input
        {...props}
        className="mt-1 w-full border border-border px-3 py-2.5 focus:outline-none focus:border-brand bg-white"
      />
    </label>
  );
}
