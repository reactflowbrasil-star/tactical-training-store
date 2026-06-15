import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList, Save } from "lucide-react";
import { useMemo, useState } from "react";
import {
  AdminPageHeader,
  AdminPanel,
  Field,
  PanelHeader,
  StatusBadge,
  inputClass,
  textareaClass,
} from "@/components/admin/AdminShell";
import { AdminShell } from "@/components/admin/AdminShell";
import { formatDate, money, orderStatuses, type AdminOrder, type OrderStatus, useAdminStore } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/pedidos")({
  head: () => ({ meta: [{ title: "Pedidos | Admin Tactical Training" }] }),
  component: OrdersRoute,
});

function OrdersRoute() {
  return (
    <AdminShell>
      <OrdersPage />
    </AdminShell>
  );
}

function OrdersPage() {
  const { state, updateCollection } = useAdminStore();
  const [status, setStatus] = useState("todos");
  const [selectedId, setSelectedId] = useState(state.orders[0]?.id ?? "");

  const orders = useMemo(
    () => state.orders.filter((order) => status === "todos" || order.status === status),
    [state.orders, status],
  );
  const selected = state.orders.find((order) => order.id === selectedId) ?? orders[0];

  const updateOrder = (order: AdminOrder) => {
    updateCollection(
      "orders",
      state.orders.map((item) => (item.id === order.id ? { ...order, updatedAt: new Date().toISOString() } : item)),
      `Pedido ${order.id} atualizado`,
      "Pedidos",
    );
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Operacao"
        title="Pedidos"
        description="Acompanhe status, pagamento, dados do cliente, endereco, itens e observacoes internas."
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <AdminPanel>
          <PanelHeader
            title="Lista de pedidos"
            actions={
              <select className={`${inputClass} w-full sm:w-56`} value={status} onChange={(event) => setStatus(event.target.value)}>
                <option value="todos">Todos os status</option>
                {orderStatuses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            }
          />
          <div className="divide-y divide-slate-200">
            {orders.map((order) => (
              <button
                key={order.id}
                onClick={() => setSelectedId(order.id)}
                className={`grid w-full gap-3 p-4 text-left transition md:grid-cols-[110px_1fr_120px_140px] md:items-center ${
                  selected?.id === order.id ? "bg-red-50" : "hover:bg-slate-50"
                }`}
              >
                <div>
                  <div className="font-black text-slate-950">{order.id}</div>
                  <div className="text-xs text-slate-500">{formatDate(order.createdAt)}</div>
                </div>
                <div>
                  <div className="font-bold text-slate-900">{order.customer}</div>
                  <div className="text-sm text-slate-500">{order.email}</div>
                </div>
                <div className="font-bold text-slate-950">{money(order.total)}</div>
                <StatusBadge status={order.status} />
              </button>
            ))}
          </div>
        </AdminPanel>

        {selected && (
          <AdminPanel>
            <PanelHeader title={`Pedido ${selected.id}`} description="Detalhes e controle operacional." />
            <div className="space-y-5 p-4">
              <div className="rounded-lg bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-bold text-slate-950">{selected.customer}</div>
                    <div className="mt-1 text-sm text-slate-500">{selected.email}</div>
                    <div className="text-sm text-slate-500">{selected.phone}</div>
                  </div>
                  <ClipboardList className="text-red-600" size={22} />
                </div>
                <div className="mt-3 text-sm text-slate-700">{selected.address}</div>
              </div>

              <Field label="Status do pedido">
                <select
                  className={inputClass}
                  value={selected.status}
                  onChange={(event) => updateOrder({ ...selected, status: event.target.value as OrderStatus })}
                >
                  {orderStatuses.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </Field>

              <div>
                <div className="text-xs font-bold uppercase text-slate-700">Produtos comprados</div>
                <div className="mt-2 space-y-2">
                  {selected.items.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between rounded-md border border-slate-200 p-3 text-sm">
                      <div>
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-xs text-slate-500">Quantidade: {item.qty}</div>
                      </div>
                      <div className="font-bold">{money(item.price * item.qty)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md bg-slate-50 p-3">
                  <div className="text-xs text-slate-500">Pagamento</div>
                  <div className="font-bold">{selected.payment}</div>
                </div>
                <div className="rounded-md bg-slate-50 p-3">
                  <div className="text-xs text-slate-500">Total</div>
                  <div className="font-bold">{money(selected.total)}</div>
                </div>
              </div>

              <Field label="Observacoes internas">
                <textarea
                  className={textareaClass}
                  value={selected.internalNotes}
                  onChange={(event) => updateOrder({ ...selected, internalNotes: event.target.value })}
                />
              </Field>

              <button
                onClick={() => updateOrder(selected)}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-red-600 text-sm font-bold text-white transition hover:bg-red-700"
              >
                <Save size={16} />
                Salvar pedido
              </button>
            </div>
          </AdminPanel>
        )}
      </div>
    </>
  );
}
