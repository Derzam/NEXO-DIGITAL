"use client";

import { useTransition, useState, use } from "react";
import { loginAdminAction } from "../actions";
import { NexoWordmark } from "@/components/nexo-wordmark";
import { AlertCircle, Lock, Mail, Loader2, ArrowRight } from "lucide-react";

export default function AdminLoginPage(props: {
  searchParams?: Promise<{ next?: string; error?: string }>;
}) {
  const searchParams = props.searchParams ? use(props.searchParams) : undefined;
  const next = searchParams?.next || "/admin/resenas";

  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(
    searchParams?.error || null
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    const formData = new FormData(event.currentTarget);
    formData.set("next", next);

    startTransition(async () => {
      const result = await loginAdminAction(formData);
      if (result && !result.success) {
        setErrorMessage(result.error || "No se pudo iniciar sesión.");
      }
    });
  }

  return (
    <div className="tw:mx-auto tw:flex tw:min-h-[calc(100vh-180px)] tw:max-w-md tw:flex-col tw:justify-center tw:py-12">
      <div className="tw:rounded-2xl tw:border tw:border-[#1a334d] tw:bg-[#0c1929] tw:p-8 tw:shadow-2xl tw:shadow-black/50">
        <div className="tw:text-center">
          <div className="tw:mb-6 tw:inline-flex tw:justify-center">
            <NexoWordmark className="tw:w-[170px]" eager />
          </div>
          <h1 className="tw:text-[22px] tw:font-semibold tw:tracking-tight tw:text-white">
            Acceso Administrativo
          </h1>
          <p className="tw:mt-2 tw:text-[14px] tw:text-[#91a8c0]">
            Panel de moderación y control de reseñas.
          </p>
        </div>

        {errorMessage ? (
          <div
            role="alert"
            data-testid="admin-login-error"
            className="tw:mt-6 tw:flex tw:items-start tw:gap-3 tw:rounded-xl tw:border tw:border-[#5a2128] tw:bg-[#2b1014] tw:p-4 tw:text-[14px] tw:text-[#ff9ea9]"
          >
            <AlertCircle className="tw:size-5 tw:shrink-0 tw:text-red-400" aria-hidden="true" />
            <span>{errorMessage}</span>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="tw:mt-6 tw:space-y-4" noValidate>
          <div>
            <label
              htmlFor="email"
              className="tw:block tw:text-[13px] tw:font-medium tw:text-[#b4cbdf]"
            >
              Correo electrónico
            </label>
            <div className="tw:relative tw:mt-1.5">
              <Mail
                className="tw:pointer-events-none tw:absolute tw:left-3.5 tw:top-1/2 tw:size-4 tw:shrink-0 tw:-translate-y-1/2 tw:text-[#5e7c99]"
                aria-hidden="true"
              />
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@nexodigitalstudio.net"
                disabled={isPending}
                className="tw:block tw:w-full tw:rounded-xl tw:border tw:border-[#204060] tw:bg-[#0a1523] tw:py-2.5 tw:pl-10 tw:pr-3.5 tw:text-[15px] tw:text-white tw:placeholder-[#516b85] tw:transition-colors tw:focus:border-[#00e5ff] tw:focus:outline-none tw:focus:ring-1 tw:focus:ring-[#00e5ff] tw:disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="tw:block tw:text-[13px] tw:font-medium tw:text-[#b4cbdf]"
            >
              Contraseña
            </label>
            <div className="tw:relative tw:mt-1.5">
              <Lock
                className="tw:pointer-events-none tw:absolute tw:left-3.5 tw:top-1/2 tw:size-4 tw:shrink-0 tw:-translate-y-1/2 tw:text-[#5e7c99]"
                aria-hidden="true"
              />
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                disabled={isPending}
                className="tw:block tw:w-full tw:rounded-xl tw:border tw:border-[#204060] tw:bg-[#0a1523] tw:py-2.5 tw:pl-10 tw:pr-3.5 tw:text-[15px] tw:text-white tw:placeholder-[#516b85] tw:transition-colors tw:focus:border-[#00e5ff] tw:focus:outline-none tw:focus:ring-1 tw:focus:ring-[#00e5ff] tw:disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="tw:mt-6 tw:inline-flex tw:w-full tw:items-center tw:justify-center tw:gap-2 tw:rounded-xl tw:border tw:border-[#00e5ff]/50 tw:bg-[#00c8e0] tw:py-3 tw:text-[15px] tw:font-semibold tw:text-[#041018] tw:shadow-lg tw:shadow-[#00e5ff]/10 tw:transition-all tw:hover:bg-[#33edff] tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-[#00e5ff] tw:disabled:opacity-60"
          >
            {isPending ? (
              <>
                <Loader2 className="tw:size-4 tw:animate-spin" aria-hidden="true" />
                <span>Validando credenciales...</span>
              </>
            ) : (
              <>
                <span>Iniciar sesión</span>
                <ArrowRight className="tw:size-4" aria-hidden="true" />
              </>
            )}
          </button>
        </form>

        <div className="tw:mt-6 tw:border-t tw:border-[#1a334d] tw:pt-4 tw:text-center">
          <p className="tw:text-[12px] tw:text-[#6a849f]">
            Acceso restringido para personal autorizado. Las sesiones y acciones
            son auditadas en el servidor.
          </p>
        </div>
      </div>
    </div>
  );
}

