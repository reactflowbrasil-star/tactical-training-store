import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductEditor } from "@/components/admin/ProductEditor";

export const Route = createFileRoute("/admin/produtos/editar/$id")({
  head: () => ({ meta: [{ title: "Editar produto | Admin Tactical Training" }] }),
  component: EditProductRoute,
});

function EditProductRoute() {
  const { id } = Route.useParams();

  return (
    <AdminShell>
      <ProductEditor productId={id} />
    </AdminShell>
  );
}
