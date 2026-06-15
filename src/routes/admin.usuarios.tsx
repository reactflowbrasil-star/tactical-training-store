import { createFileRoute } from "@tanstack/react-router";
import { Edit, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import {
  AdminPageHeader,
  AdminPanel,
  Field,
  PanelHeader,
  StatusBadge,
  inputClass,
} from "@/components/admin/AdminShell";
import { AdminShell } from "@/components/admin/AdminShell";
import { formatDate, makeId, type AdminUser, type UserRole, userRoles, useAdminStore } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/usuarios")({
  head: () => ({ meta: [{ title: "Usuarios | Admin Tactical Training" }] }),
  component: UsersRoute,
});

const permissions = ["Produtos", "Categorias", "Pedidos", "Banners", "SEO", "IA", "Midia", "Configuracoes", "Usuarios"];

const blankUser = (): AdminUser => ({
  id: makeId("usr"),
  name: "",
  email: "",
  phone: "",
  role: "Cliente",
  status: "active",
  permissions: [],
  createdAt: new Date().toISOString(),
  lastAccess: new Date().toISOString(),
});

function UsersRoute() {
  return (
    <AdminShell>
      <UsersPage />
    </AdminShell>
  );
}

function UsersPage() {
  const { state, updateCollection } = useAdminStore();
  const [draft, setDraft] = useState<AdminUser>(() => blankUser());
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.name.trim() || !draft.email.includes("@")) {
      setMessage("Informe nome e e-mail valido.");
      return;
    }

    const exists = state.users.some((user) => user.id === draft.id);
    const next = exists
      ? state.users.map((user) => (user.id === draft.id ? draft : user))
      : [draft, ...state.users];
    updateCollection("users", next, `Usuario ${draft.name} salvo`, "Usuarios");
    setDraft(blankUser());
    setOpen(false);
    setMessage("Usuario salvo com sucesso.");
  };

  const edit = (user: AdminUser) => {
    setDraft(user);
    setOpen(true);
    setMessage("");
  };

  const remove = (id: string) => {
    if (!window.confirm("Excluir este usuario?")) return;
    updateCollection(
      "users",
      state.users.filter((user) => user.id !== id),
      "Usuario removido",
      "Usuarios",
    );
  };

  const updateDraft = <Key extends keyof AdminUser>(key: Key, value: AdminUser[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const togglePermission = (permission: string) => {
    setDraft((current) => ({
      ...current,
      permissions: current.permissions.includes(permission)
        ? current.permissions.filter((item) => item !== permission)
        : [...current.permissions, permission],
    }));
  };

  return (
    <>
      <AdminPageHeader
        eyebrow="Seguranca"
        title="Usuarios e permissoes"
        description="Controle perfis de acesso, status do usuario e permissoes por area do painel."
        actions={
          <button
            onClick={() => {
              setDraft(blankUser());
              setOpen((current) => !current);
            }}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-red-600 px-4 text-sm font-bold text-white transition hover:bg-red-700"
          >
            <UserPlus size={16} />
            Novo usuario
          </button>
        }
      />

      {message && <div className="mb-4 rounded-md bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{message}</div>}

      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <AdminPanel>
          <PanelHeader title="Equipe e clientes" description="Historico de acesso e perfil operacional." />
          <div className="divide-y divide-slate-200">
            {state.users.map((user) => (
              <article key={user.id} className="grid gap-3 p-4 md:grid-cols-[1fr_180px_120px_140px] md:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold text-slate-950">{user.name}</h2>
                    <StatusBadge status={user.status} />
                  </div>
                  <div className="mt-1 text-sm text-slate-500">{user.email} - {user.phone}</div>
                  <div className="mt-1 text-xs text-slate-400">Criado em {formatDate(user.createdAt)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Perfil</div>
                  <div className="text-sm font-bold">{user.role}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Ultimo acesso</div>
                  <div className="text-sm font-bold">{formatDate(user.lastAccess)}</div>
                </div>
                <div className="flex gap-2 md:justify-end">
                  <button
                    onClick={() => edit(user)}
                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-semibold md:flex-none"
                  >
                    <Edit size={15} />
                    Editar
                  </button>
                  <button
                    onClick={() => remove(user.id)}
                    className="inline-flex h-10 w-11 items-center justify-center rounded-md border border-rose-200 text-rose-700"
                    aria-label="Excluir usuario"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </AdminPanel>

        <div className="space-y-5">
          {open && (
            <AdminPanel>
              <PanelHeader title="Cadastro de usuario" />
              <form onSubmit={save} className="space-y-4 p-4">
                <Field label="Nome">
                  <input className={inputClass} value={draft.name} onChange={(event) => updateDraft("name", event.target.value)} />
                </Field>
                <Field label="E-mail">
                  <input className={inputClass} value={draft.email} onChange={(event) => updateDraft("email", event.target.value)} />
                </Field>
                <Field label="Telefone">
                  <input className={inputClass} value={draft.phone} onChange={(event) => updateDraft("phone", event.target.value)} />
                </Field>
                <Field label="Perfil de acesso">
                  <select className={inputClass} value={draft.role} onChange={(event) => updateDraft("role", event.target.value as UserRole)}>
                    {userRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Status">
                  <select className={inputClass} value={draft.status} onChange={(event) => updateDraft("status", event.target.value as AdminUser["status"])}>
                    <option value="active">Ativo</option>
                    <option value="draft">Pendente</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </Field>
                <div>
                  <div className="text-xs font-bold uppercase text-slate-700">Permissoes</div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {permissions.map((permission) => (
                      <label key={permission} className="flex min-h-10 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-semibold">
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-red-600"
                          checked={draft.permissions.includes(permission)}
                          onChange={() => togglePermission(permission)}
                        />
                        {permission}
                      </label>
                    ))}
                  </div>
                </div>
                <button className="h-11 w-full rounded-md bg-red-600 text-sm font-bold text-white transition hover:bg-red-700">
                  Salvar usuario
                </button>
              </form>
            </AdminPanel>
          )}

          <AdminPanel>
            <PanelHeader title="Historico de acoes" />
            <div className="space-y-3 p-4">
              {state.activityLogs.slice(0, 8).map((log) => (
                <div key={log.id} className="rounded-md border border-slate-200 p-3">
                  <div className="text-sm font-bold text-slate-900">{log.action}</div>
                  <div className="mt-1 text-xs text-slate-500">{log.user} - {log.area} - {formatDate(log.createdAt)}</div>
                </div>
              ))}
            </div>
          </AdminPanel>
        </div>
      </div>
    </>
  );
}
