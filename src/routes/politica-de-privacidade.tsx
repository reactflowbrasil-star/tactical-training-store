import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () => ({
    meta: [
      { title: "Politica de Privacidade - TACTICAL TRAINING" },
      { name: "description", content: "Politica de privacidade da loja Tactical Training." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <Layout>
      <PolicyPage
        title="Politica de privacidade"
        sections={[
          ["Dados coletados", "Coletamos dados necessarios para cadastro, processamento de pedidos, pagamento, entrega, atendimento e comunicacoes autorizadas."],
          ["Uso das informacoes", "As informacoes sao usadas para operar a loja, melhorar a experiencia de compra, prevenir fraude e cumprir obrigacoes legais."],
          ["Compartilhamento", "Dados podem ser compartilhados com meios de pagamento, transportadoras e fornecedores essenciais para execucao do pedido."],
          ["Seguranca", "Adotamos controles tecnicos e organizacionais para proteger dados pessoais contra acesso nao autorizado."],
          ["Direitos do titular", "O cliente pode solicitar atualizacao, correcao ou exclusao de dados conforme a legislacao aplicavel."],
        ]}
      />
    </Layout>
  );
}

function PolicyPage({ title, sections }: { title: string; sections: [string, string][] }) {
  return (
    <main>
      <section className="bg-ink py-14 text-white">
        <div className="container mx-auto px-4">
          <div className="text-xs font-bold uppercase tracking-[0.4em] text-brand">Legal</div>
          <h1 className="mt-2 text-4xl font-display italic font-extrabold uppercase md:text-6xl">{title}</h1>
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
  );
}
