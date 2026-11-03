import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { NexoWordmark } from "@/components/nexo-wordmark";
import { getAuthenticatedAdminUser } from "@/lib/supabase/auth";
import { logoutAdminAction } from "./actions";
import { ExternalLink, LogOut, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Panel Administrativo | Nexo Digital Studio",
  description: "Administración y moderación privada de reseñas de clientes.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#081221",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getAuthenticatedAdminUser();
  const isAdmin = !auth.error && auth.admin && auth.user;

  return (
    <div className="tw:min-h-screen tw:bg-[#070e17] tw:text-[#e7f3ff] tw:font-sans">
      <header className="tw:sticky tw:top-0 tw:z-40 tw:border-b tw:border-[#1a3048] tw:bg-[#091524]/95 tw:backdrop-blur-md">
        <div className="tw:mx-auto tw:flex tw:max-w-7xl tw:items-center tw:justify-between tw:px-4 tw:py-3.5 tw:sm:px-6 tw:lg:px-8">
          <div className="tw:flex tw:items-center tw:gap-4">
            <Link
              href={isAdmin ? "/admin/resenas" : "/admin/login"}
              className="tw:inline-flex tw:items-center tw:gap-2 tw:transition-opacity tw:hover:opacity-85"
              aria-label="Panel administrativo de Nexo Digital"
            >
              <NexoWordmark className="tw:w-[130px] tw:sm:w-[150px]" eager />
            </Link>
            <span className="tw:hidden tw:rounded-full tw:border tw:border-[#204060] tw:bg-[#0e2238] tw:px-2.5 tw:py-0.5 tw:text-[11px] tw:font-semibold tw:tracking-wider tw:text-[#8ad1ff] tw:uppercase tw:sm:inline-flex tw:items-center tw:gap-1">
              <ShieldCheck className="tw:size-3.5" aria-hidden="true" />
              Panel de Moderación
            </span>
          </div>

          <div className="tw:flex tw:items-center tw:gap-3">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ver sitio público"
              className="tw:inline-flex tw:items-center tw:gap-1.5 tw:rounded-lg tw:border tw:border-[#204060] tw:bg-[#0e2238] tw:px-3 tw:py-1.5 tw:text-[13px] tw:font-medium tw:text-[#c4ddf5] tw:transition-colors tw:hover:border-[#33608c] tw:hover:text-white"
            >
              <span className="tw:hidden tw:sm:inline">Ver sitio</span>
              <ExternalLink className="tw:size-3.5" aria-hidden="true" />
            </Link>

            {isAdmin ? (
              <div className="tw:flex tw:items-center tw:gap-3">
                <span className="tw:hidden tw:text-[13px] tw:text-[#9dbcdb] tw:md:inline-block">
                  {auth.admin?.email}
                </span>
                <form action={logoutAdminAction}>
                  <button
                    type="submit"
                    className="tw:inline-flex tw:items-center tw:gap-1.5 tw:rounded-lg tw:border tw:border-[#4d252e] tw:bg-[#251016] tw:px-3 tw:py-1.5 tw:text-[13px] tw:font-medium tw:text-[#f8a8b8] tw:transition-colors tw:hover:bg-[#381620] tw:hover:text-[#ffdbe3] tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-red-400"
                    aria-label="Cerrar sesión de administrador"
                  >
                    <LogOut className="tw:size-3.5" aria-hidden="true" />
                    <span>Cerrar sesión</span>
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <div className="tw:mx-auto tw:max-w-7xl tw:px-4 tw:py-8 tw:sm:px-6 tw:lg:px-8">
        {children}
      </div>
    </div>
  );
}

