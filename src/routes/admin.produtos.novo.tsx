import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductEditor } from "@/components/admin/ProductEditor";

export const Route = createFileRoute("/admin/produtos/novo")({
  head: () => ({ meta: [{ title: "Novo produto | Admin Tactical Training" }] }),
  component: NewProductRoute,
});

function NewProductRoute() {
  return (
    <AdminShell>
      <ProductEditor />
    </AdminShell>
  );
}
