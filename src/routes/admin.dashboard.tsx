import { createFileRoute, Link } from "@tanstack/react-router";
import { Boxes, FileSearch, FolderPlus, PackagePlus, ShoppingBag, Sparkles, TrendingUp, Users } from "lucide-react";
import { AdminPageHeader, AdminPanel, MetricCard, PanelHeader, StatusBadge } from "@/components/admin/AdminShell";
import { AdminShell } from "@/components/admin/AdminShell";
import { formatDate, money, useAdminStore } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard | Admin Tactical Training" }] }),
  component: DashboardRoute,
});

function DashboardRoute() {
  return (
    <AdminShell>
      <DashboardPage />
    </AdminShell>
  );
}

function DashboardPage() {
  const { state } = useAdminStore();
  const activeProducts = state.products.filter((product) => product.status === "active");
  const lowStock = state.products.filter((product) => product.stock <= 8);
  const revenue = state.orders.reduce((total, order) => total + order.total, 0);
  const featured = state.products.filter((product) => product.featured).slice(0, 5);

  return (
    <>
      <AdminPageHeader
        eyebrow="Visao geral"
        title="Dashboard da loja"
        description="Acompanhe produtos, categorias, usuarios, pedidos, estoque e pendencias comerciais em uma unica tela."
        actions={
          <>
            <QuickAction to="/admin/produtos/novo" icon={PackagePlus} label="Produto" />
            <QuickAction to="/admin/categorias" icon={FolderPlus} label="Categoria" />
            <QuickAction to="/admin/seo" icon={FileSearch} label="SEO" />
            <QuickAction to="/admin/ia-copywriter" icon={Sparkles} label="IA Copy" />
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Produtos" value={String(state.products.length)} detail={`${activeProducts.length} ativos na loja`} icon={Boxes} accent="red" />
        <MetricCard title="Categorias" value={String(state.categories.length)} detail="Com SEO individual configuravel" icon={FileSearch} accent="blue" />
        <MetricCard title="Usuarios" value={String(state.users.length)} detail="Perfis e permissoes por funcao" icon={Users} accent="green" />
        <MetricCard title="Pedidos" value={String(state.orders.length)} detail={`${money(revenue)} em pedidos simulados`} icon={ShoppingBag} accent="amber" />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <AdminPanel>
          <PanelHeader title="Ultimos pedidos" description="Acompanhe status, pagamento e valor total." />
          <div className="divide-y divide-slate-200">
            {state.orders.map((order) => (
              <div key={order.id} className="grid gap-3 p-4 sm:grid-cols-[120px_1fr_120px_130px] sm:items-center">
                <div>
                  <div className="font-black text-slate-950">{order.id}</div>
                  <div className="text-xs text-slate-500">{formatDate(order.createdAt)}</div>
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{order.customer}</div>
                  <div className="text-xs text-slate-500">{order.items.length} itens - {order.payment}</div>
                </div>
                <div className="font-bold text-slate-950">{money(order.total)}</div>
                <StatusBadge status={order.status} />
              </div>
            ))}
          </div>
        </AdminPanel>

        <div className="space-y-5">
          <AdminPanel>
            <PanelHeader title="Status da loja" description="Checklist operacional." />
            <div className="space-y-3 p-4">
              {[
                ["Loja publicada", "Online"],
                ["PWA configurado", "Ativo"],
                ["SEO global", "Revisar"],
                ["Robots e sitemap", "Pronto"],
              ].map(([label, status]) => (
                <div key={label} className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2">
                  <span className="text-sm font-semibold text-slate-700">{label}</span>
                  <StatusBadge status={status} />
                </div>
              ))}
            </div>
          </AdminPanel>

          <AdminPanel>
            <PanelHeader title="Metricas simuladas" />
            <div className="grid grid-cols-2 gap-3 p-4">
              {[
                ["Visitas hoje", "1.284"],
                ["Conversao", "3,8%"],
                ["Ticket medio", money(revenue / Math.max(state.orders.length, 1))],
                ["Carrinhos", "42"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-md bg-slate-50 p-3">
                  <div className="text-xs font-semibold text-slate-500">{label}</div>
                  <div className="mt-1 text-xl font-black text-slate-950">{value}</div>
                </div>
              ))}
            </div>
          </AdminPanel>
        </div>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-3">
        <AdminPanel>
          <PanelHeader title="Baixo estoque" description="Produtos com ate 8 unidades." />
          <div className="space-y-3 p-4">
            {lowStock.map((product) => (
              <div key={product.id} className="flex items-center gap-3">
                <img src={product.images[0]} alt={product.imageAlt} className="h-12 w-12 rounded-md object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="line-clamp-1 text-sm font-bold text-slate-900">{product.name}</div>
                  <div className="text-xs text-amber-700">{product.stock} unidades restantes</div>
                </div>
              </div>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel>
          <PanelHeader title="Produtos em destaque" />
          <div className="space-y-3 p-4">
            {featured.map((product) => (
              <div key={product.id} className="flex items-center gap-3">
                <TrendingUp size={17} className="text-red-600" />
                <div className="min-w-0 flex-1">
                  <div className="line-clamp-1 text-sm font-bold text-slate-900">{product.name}</div>
                  <div className="text-xs text-slate-500">{money(product.price)}</div>
                </div>
              </div>
            ))}
          </div>
        </AdminPanel>

        <AdminPanel>
          <PanelHeader title="Atividade recente" />
          <div className="space-y-3 p-4">
            {state.activityLogs.slice(0, 6).map((log) => (
              <div key={log.id} className="rounded-md border border-slate-200 p-3">
                <div className="text-sm font-bold text-slate-900">{log.action}</div>
                <div className="mt-1 text-xs text-slate-500">
                  {log.user} - {log.area} - {formatDate(log.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </AdminPanel>
      </section>
    </>
  );
}

function QuickAction({ to, icon: Icon, label }: { to: string; icon: typeof PackagePlus; label: string }) {
  return (
    <Link
      to={to}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
    >
      <Icon size={16} />
      {label}
    </Link>
  );
}
