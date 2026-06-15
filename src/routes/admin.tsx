import { Outlet, createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { getAdminSession } from "@/lib/admin-data";

export const Route = createFileRoute("/admin")({
  component: AdminParentRoute,
});

function AdminParentRoute() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    if (pathname !== "/admin") return;
    navigate({ to: getAdminSession() ? "/admin/dashboard" : "/admin/login" });
  }, [navigate, pathname]);

  return <Outlet />;
}
