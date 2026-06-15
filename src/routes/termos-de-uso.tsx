import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/termos-de-uso")({
  head: () => ({
    meta: [
      { title: "Termos de Uso - TACTICAL TRAINING" },
      { name: "description", content: "Termos de uso e condicoes comerciais da loja Tactical Training." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  const sections: [string, string][] = [
    ["Compra e cadastro", "Ao comprar na Tactical Training, o cliente declara que as informacoes fornecidas sao verdadeiras e atualizadas."],
    ["Precos e disponibilidade", "Precos, promocoes e estoque podem variar sem aviso previo. O pedido e confirmado apos validacao de pagamento."],
    ["Entrega", "Prazos sao estimados conforme CEP, transportadora e confirmacao de pagamento. Eventos externos podem alterar a previsao."],
    ["Trocas e devolucoes", "Solicitacoes devem respeitar prazos legais, estado do produto e politica vigente da loja."],
    ["Uso do site", "E proibido usar a loja para fins fraudulentos, automatizados ou que prejudiquem a operacao do sistema."],
  ];

  return (
    <Layout>
      <main>
        <section className="bg-ink py-14 text-white">
          <div className="container mx-auto px-4">
            <div className="text-xs font-bold uppercase tracking-[0.4em] text-brand">Legal</div>
            <h1 className="mt-2 text-4xl font-display italic font-extrabold uppercase md:text-6xl">Termos de uso</h1>
          </div>
        </section>
        <section className="container mx-auto max-w-3xl px-4 py-12">
          <div className="space-y-6">
            {sections.map(([heading, text]) => (
              <section key={heading} className="border-b border-border pb-5">
                <h2 className="font-display italic text-2xl font-bold uppercase text-ink">{heading}</h2>
                <p className="mt-2 leading-7 text-muted-foreground">{text}</p>
              </section>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
