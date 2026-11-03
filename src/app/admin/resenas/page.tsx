import { getAuthenticatedAdminUser } from "@/lib/supabase/auth";
import { fetchAdminReviews } from "@/lib/supabase/reviews";
import { redirect } from "next/navigation";
import { AdminReviewsClient } from "./admin-reviews-client";
import { logoutAdminAction } from "../actions";
import { AlertTriangle, LogOut, ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminResenasPage() {
  const auth = await getAuthenticatedAdminUser();

  if (auth.error === "UNAUTHENTICATED" || !auth.user) {
    redirect("/admin/login?next=/admin/resenas");
  }

  if (auth.error === "FORBIDDEN") {
    return (
      <div className="tw:mx-auto tw:max-w-xl tw:py-16">
        <div className="tw:rounded-2xl tw:border tw:border-red-900/60 tw:bg-[#1f0f13] tw:p-8 tw:text-center">
          <div className="tw:mx-auto tw:flex tw:size-14 tw:items-center tw:justify-center tw:rounded-full tw:bg-red-950/80 tw:text-red-400">
            <ShieldAlert className="tw:size-8" aria-hidden="true" />
          </div>
          <h1 className="tw:mt-5 tw:text-[22px] tw:font-semibold tw:text-white">
            403 — Acceso no autorizado
          </h1>
          <p className="tw:mt-3 tw:text-[15px] tw:leading-relaxed tw:text-[#e4a4af]">
            La cuenta <strong className="tw:text-white">{auth.user?.email}</strong> está
            autenticada pero no tiene permisos de administrador activos en la tabla{" "}
            <code className="tw:rounded tw:bg-red-950 tw:px-1.5 tw:py-0.5 tw:text-[13px] tw:text-red-200">
              public.nexo_admin_users
            </code>.
          </p>
          <div className="tw:mt-6 tw:flex tw:justify-center">
            <form action={logoutAdminAction}>
              <button
                type="submit"
                className="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-xl tw:border tw:border-[#632935] tw:bg-[#3d1620] tw:px-5 tw:py-2.5 tw:text-[14px] tw:font-medium tw:text-[#ffd6dc] tw:transition-colors tw:hover:bg-[#521c29]"
              >
                <LogOut className="tw:size-4" aria-hidden="true" />
                <span>Cerrar sesión e intentar con otra cuenta</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (auth.error === "NOT_CONFIGURED" || !auth.user || !auth.admin) {
    return (
      <div className="tw:mx-auto tw:max-w-xl tw:py-16">
        <div className="tw:rounded-2xl tw:border tw:border-amber-900/60 tw:bg-[#1f170b] tw:p-8 tw:text-center">
          <div className="tw:mx-auto tw:flex tw:size-14 tw:items-center tw:justify-center tw:rounded-full tw:bg-amber-950/80 tw:text-amber-400">
            <AlertTriangle className="tw:size-8" aria-hidden="true" />
          </div>
          <h1 className="tw:mt-5 tw:text-[22px] tw:font-semibold tw:text-white">
            Configuración requerida
          </h1>
          <p className="tw:mt-3 tw:text-[15px] tw:leading-relaxed tw:text-[#ebd1a7]">
            Las credenciales de Supabase del proyecto exclusivo de Nexo (
            <code className="tw:text-amber-200">nnujqzopkbzoddqhnavr</code>) no están
            configuradas en el entorno del servidor.
          </p>
        </div>
      </div>
    );
  }

  const initialData = await fetchAdminReviews({
    status: "all",
    sort: "newest",
    page: 1,
    limit: 10,
  });

  return (
    <AdminReviewsClient
      initialData={initialData}
      adminEmail={auth.admin.email}
      adminRole={auth.admin.role}
    />
  );
}

