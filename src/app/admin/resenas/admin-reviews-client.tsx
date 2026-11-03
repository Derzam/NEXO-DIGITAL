"use client";

import { useState, useTransition, useId } from "react";
import type {
  AdminReview,
  ReviewModerationStatus,
  ReviewStats,
} from "@/lib/supabase/reviews";
import {
  approveReviewAction,
  rejectReviewAction,
  withdrawReviewAction,
  getReviewsAction,
} from "../actions";
import {
  AlertCircle,
  Archive,
  Ban,
  CheckCircle2,
  Clock,
  Filter,
  Globe,
  HelpCircle,
  MessageSquare,
  MessageSquareDiff,
  RefreshCw,
  Search,
  Star,
  X,
  XCircle,
} from "lucide-react";

type InitialData = {
  reviews: AdminReview[];
  stats: ReviewStats;
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
};

type ConfirmationState = {
  isOpen: boolean;
  action: "approve" | "reject" | "withdraw";
  review: AdminReview | null;
  notes: string;
};

const stars = [1, 2, 3, 4, 5] as const;

export function AdminReviewsClient({
  initialData,
  adminEmail,
  adminRole,
}: {
  initialData: InitialData;
  adminEmail: string;
  adminRole: string;
}) {
  const [reviews, setReviews] = useState<AdminReview[]>(initialData.reviews);
  const [stats, setStats] = useState<ReviewStats>(initialData.stats);
  const [pagination, setPagination] = useState(initialData.pagination);

  const [statusFilter, setStatusFilter] = useState<"all" | ReviewModerationStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const [isPending, startTransition] = useTransition();
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [confirmation, setConfirmation] = useState<ConfirmationState>({
    isOpen: false,
    action: "approve",
    review: null,
    notes: "",
  });

  const searchInputId = useId();

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 6000);
  }

  function reloadData(pageToLoad = pagination.page) {
    startTransition(async () => {
      const response = await getReviewsAction({
        status: statusFilter,
        search: searchTerm,
        sort: sortOrder,
        page: pageToLoad,
        limit: 10,
      });

      if (response.success && response.data) {
        setReviews(response.data.reviews);
        setStats(response.data.stats);
        setPagination(response.data.pagination);
      } else {
        showToast("error", response.error || "No se pudieron recargar las reseñas.");
      }
    });
  }

  function handleFilterChange(newStatus: "all" | ReviewModerationStatus) {
    setStatusFilter(newStatus);
    startTransition(async () => {
      const response = await getReviewsAction({
        status: newStatus,
        search: searchTerm,
        sort: sortOrder,
        page: 1,
        limit: 10,
      });

      if (response.success && response.data) {
        setReviews(response.data.reviews);
        setStats(response.data.stats);
        setPagination(response.data.pagination);
      }
    });
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    reloadData(1);
  }

  function openConfirmation(
    action: "approve" | "reject" | "withdraw",
    review: AdminReview
  ) {
    setConfirmation({
      isOpen: true,
      action,
      review,
      notes: "",
    });
  }

  function closeConfirmation() {
    setConfirmation((prev) => ({ ...prev, isOpen: false, review: null, notes: "" }));
  }

  async function executeConfirmedAction() {
    if (!confirmation.review) return;
    const { action, review, notes } = confirmation;
    setActiveActionId(review.id);
    closeConfirmation();

    let result: { success: boolean; error: string | null };

    if (action === "approve") {
      result = await approveReviewAction(review.id, notes);
    } else if (action === "reject") {
      result = await rejectReviewAction(review.id, notes);
    } else {
      result = await withdrawReviewAction(review.id, notes);
    }

    setActiveActionId(null);

    if (result.success) {
      const actionName =
        action === "approve"
          ? "aprobada y publicada"
          : action === "reject"
          ? "rechazada"
          : "retirada de la web";
      showToast("success", `Reseña de ${review.displayName} ${actionName} correctamente.`);
      reloadData();
    } else {
      showToast("error", result.error || "Ocurrió un error al procesar la acción.");
    }
  }

  function formatDate(isoString: string) {
    try {
      return new Intl.DateTimeFormat("es-EC", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(isoString));
    } catch {
      return isoString;
    }
  }

  return (
    <div className="tw:space-y-8">
      {/* Toast Notification */}
      {toast ? (
        <div
          role="status"
          aria-live="polite"
          className={`tw:fixed tw:bottom-6 tw:right-6 tw:z-50 tw:flex tw:max-w-md tw:items-start tw:gap-3 tw:rounded-xl tw:border tw:p-4 tw:shadow-2xl ${
            toast.type === "success"
              ? "tw:border-emerald-600/50 tw:bg-[#0d281e] tw:text-emerald-100"
              : "tw:border-red-600/50 tw:bg-[#2b1014] tw:text-red-100"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="tw:size-5 tw:shrink-0 tw:text-emerald-400" aria-hidden="true" />
          ) : (
            <AlertCircle className="tw:size-5 tw:shrink-0 tw:text-red-400" aria-hidden="true" />
          )}
          <div className="tw:flex-1 tw:text-[14px] tw:leading-relaxed">{toast.message}</div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="tw:text-current tw:opacity-70 tw:hover:opacity-100"
            aria-label="Cerrar notificación"
          >
            <X className="tw:size-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}

      {/* Header bar */}
      <div className="tw:flex tw:flex-col tw:gap-4 tw:sm:flex-row tw:sm:items-center tw:sm:justify-between">
        <div>
          <h1 className="tw:text-[26px] tw:font-bold tw:tracking-tight tw:text-white">
            Moderación de Reseñas
          </h1>
          <p className="tw:mt-1 tw:text-[14px] tw:text-[#91a8c0]">
            Sesión activa como <strong className="tw:text-white">{adminEmail}</strong> (
            <span className="tw:text-[#00e5ff]">{adminRole}</span>).
          </p>
        </div>

        <button
          type="button"
          onClick={() => reloadData()}
          disabled={isPending}
          className="tw:inline-flex tw:items-center tw:gap-2 tw:self-start tw:rounded-xl tw:border tw:border-[#204060] tw:bg-[#0c1a2c] tw:px-4 tw:py-2 tw:text-[13px] tw:font-medium tw:text-[#bcd3ea] tw:transition-colors tw:hover:bg-[#12263f] tw:disabled:opacity-50"
          aria-label="Actualizar listado de reseñas"
        >
          <RefreshCw
            className={`tw:size-3.5 ${isPending ? "tw:animate-spin tw:text-[#00e5ff]" : ""}`}
            aria-hidden="true"
          />
          <span>Actualizar datos</span>
        </button>
      </div>

      {/* KPI Cards / Indicadores */}
      <section aria-labelledby="kpis-heading" className="tw:grid tw:gap-4 tw:sm:grid-cols-2 tw:lg:grid-cols-4">
        <h2 id="kpis-heading" className="tw:sr-only">
          Indicadores de reseñas
        </h2>

        {/* Total */}
        <div className="tw:rounded-2xl tw:border tw:border-[#1e3852] tw:bg-[#0c1a2a] tw:p-5">
          <div className="tw:flex tw:items-center tw:justify-between">
            <span className="tw:text-[13px] tw:font-semibold tw:uppercase tw:tracking-wider tw:text-[#8cb1d4]">
              Total recibidas
            </span>
            <div className="tw:rounded-lg tw:bg-[#152a42] tw:p-2 tw:text-[#8cb1d4]">
              <MessageSquare className="tw:size-4" aria-hidden="true" />
            </div>
          </div>
          <p className="tw:mt-3 tw:text-[32px] tw:font-bold tw:text-white">{stats.total}</p>
          <span className="tw:text-[12px] tw:text-[#6f8da8]">Registradas en Supabase</span>
        </div>

        {/* Pendientes */}
        <div
          className={`tw:rounded-2xl tw:border tw:p-5 ${
            stats.pending > 0
              ? "tw:border-amber-600/60 tw:bg-[#20180d] tw:shadow-lg tw:shadow-amber-950/40"
              : "tw:border-[#1e3852] tw:bg-[#0c1a2a]"
          }`}
        >
          <div className="tw:flex tw:items-center tw:justify-between">
            <span
              className={`tw:text-[13px] tw:font-semibold tw:uppercase tw:tracking-wider ${
                stats.pending > 0 ? "tw:text-amber-300" : "tw:text-[#8cb1d4]"
              }`}
            >
              Pendientes
            </span>
            <div
              className={`tw:rounded-lg tw:p-2 ${
                stats.pending > 0
                  ? "tw:bg-amber-950/80 tw:text-amber-300"
                  : "tw:bg-[#152a42] tw:text-[#8cb1d4]"
              }`}
            >
              <Clock className="tw:size-4" aria-hidden="true" />
            </div>
          </div>
          <p
            className={`tw:mt-3 tw:text-[32px] tw:font-bold ${
              stats.pending > 0 ? "tw:text-amber-200" : "tw:text-white"
            }`}
          >
            {stats.pending}
          </p>
          <span className="tw:text-[12px] tw:text-[#9c8969]">Requieren moderación</span>
        </div>

        {/* Publicadas */}
        <div className="tw:rounded-2xl tw:border tw:border-[#1a4436] tw:bg-[#0a2019] tw:p-5">
          <div className="tw:flex tw:items-center tw:justify-between">
            <span className="tw:text-[13px] tw:font-semibold tw:uppercase tw:tracking-wider tw:text-emerald-300">
              Publicadas
            </span>
            <div className="tw:rounded-lg tw:bg-[#12362a] tw:p-2 tw:text-emerald-300">
              <CheckCircle2 className="tw:size-4" aria-hidden="true" />
            </div>
          </div>
          <p className="tw:mt-3 tw:text-[32px] tw:font-bold tw:text-emerald-100">{stats.published}</p>
          <span className="tw:text-[12px] tw:text-[#6a9e88]">Visibles en la web pública</span>
        </div>

        {/* Rechazadas */}
        <div className="tw:rounded-2xl tw:border tw:border-[#38262b] tw:bg-[#191014] tw:p-5">
          <div className="tw:flex tw:items-center tw:justify-between">
            <span className="tw:text-[13px] tw:font-semibold tw:uppercase tw:tracking-wider tw:text-[#d38b99]">
              Rechazadas / Retiradas
            </span>
            <div className="tw:rounded-lg tw:bg-[#2b1720] tw:p-2 tw:text-[#d38b99]">
              <XCircle className="tw:size-4" aria-hidden="true" />
            </div>
          </div>
          <p className="tw:mt-3 tw:text-[32px] tw:font-bold tw:text-[#fad2d9]">{stats.rejected}</p>
          <span className="tw:text-[12px] tw:text-[#8f6c74]">Ocultas al público</span>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="tw:rounded-2xl tw:border tw:border-[#1a334d] tw:bg-[#0c1929] tw:p-4 tw:sm:p-5">
        <div className="tw:flex tw:flex-col tw:gap-4 tw:lg:flex-row tw:lg:items-center tw:lg:justify-between">
          {/* Status Tabs */}
          <div
            role="tablist"
            aria-label="Filtrar reseñas por estado"
            className="tw:inline-flex tw:flex-wrap tw:gap-1.5 tw:rounded-xl tw:border tw:border-[#1e3852] tw:bg-[#081220] tw:p-1"
          >
            {[
              { id: "all", label: "Todas", count: stats.total },
              { id: "pending", label: "Pendientes", count: stats.pending },
              { id: "published", label: "Publicadas", count: stats.published },
              { id: "rejected", label: "Rechazadas", count: stats.rejected },
            ].map((tab) => (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={statusFilter === tab.id}
                onClick={() => handleFilterChange(tab.id as "all" | ReviewModerationStatus)}
                className={`tw:inline-flex tw:items-center tw:gap-2 tw:rounded-lg tw:px-3.5 tw:py-2 tw:text-[13px] tw:font-medium tw:transition-all ${
                  statusFilter === tab.id
                    ? "tw:bg-[#00c8e0] tw:font-semibold tw:text-[#041018] tw:shadow-md"
                    : "tw:text-[#8cb1d4] tw:hover:bg-[#10243b] tw:hover:text-white"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`tw:rounded-full tw:px-2 tw:py-0.5 tw:text-[11px] ${
                    statusFilter === tab.id
                      ? "tw:bg-[#042838] tw:text-[#8ad1ff]"
                      : "tw:bg-[#142840] tw:text-[#7ba1c4]"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search and Sort */}
          <div className="tw:flex tw:flex-col tw:gap-3 tw:sm:flex-row tw:sm:items-center">
            <form onSubmit={handleSearchSubmit} className="tw:relative tw:flex-1 tw:sm:w-72">
              <label htmlFor={searchInputId} className="tw:sr-only">
                Buscar por nombre, empresa o texto de reseña
              </label>
              <Search
                className="tw:pointer-events-none tw:absolute tw:left-3.5 tw:top-1/2 tw:size-4 tw:-translate-y-1/2 tw:text-[#5e7c99]"
                aria-hidden="true"
              />
              <input
                id={searchInputId}
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar cliente, empresa o texto..."
                className="tw:w-full tw:rounded-xl tw:border tw:border-[#204060] tw:bg-[#091524] tw:py-2 tw:pl-10 tw:pr-3.5 tw:text-[14px] tw:text-white tw:placeholder-[#516b85] tw:focus:border-[#00e5ff] tw:focus:outline-none"
              />
            </form>

            <div className="tw:flex tw:items-center tw:gap-2">
              <label htmlFor="sort-order" className="tw:sr-only">
                Ordenar por fecha
              </label>
              <select
                id="sort-order"
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value as "newest" | "oldest");
                  startTransition(async () => {
                    const response = await getReviewsAction({
                      status: statusFilter,
                      search: searchTerm,
                      sort: e.target.value as "newest" | "oldest",
                      page: 1,
                      limit: 10,
                    });
                    if (response.success && response.data) {
                      setReviews(response.data.reviews);
                      setPagination(response.data.pagination);
                    }
                  });
                }}
                className="tw:rounded-xl tw:border tw:border-[#204060] tw:bg-[#091524] tw:px-3 tw:py-2 tw:text-[13px] tw:text-[#bcd3ea] tw:focus:border-[#00e5ff] tw:focus:outline-none"
              >
                <option value="newest">Más recientes primero</option>
                <option value="oldest">Más antiguas primero</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <section aria-labelledby="reviews-list-heading" className="tw:space-y-4">
        <div className="tw:flex tw:items-center tw:justify-between">
          <h2 id="reviews-list-heading" className="tw:text-[17px] tw:font-semibold tw:text-white">
            {statusFilter === "all"
              ? "Todas las reseñas"
              : statusFilter === "pending"
              ? "Reseñas pendientes de revisión"
              : statusFilter === "published"
              ? "Reseñas publicadas en la web"
              : "Reseñas rechazadas u ocultas"}
          </h2>
          <span className="tw:text-[13px] tw:text-[#7ba1c4]">
            Mostrando {reviews.length} de {pagination.totalItems} resultados
          </span>
        </div>

        {reviews.length === 0 ? (
          <div className="tw:rounded-2xl tw:border tw:border-dashed tw:border-[#1e3852] tw:bg-[#0a1523] tw:p-12 tw:text-center">
            <div className="tw:mx-auto tw:flex tw:size-12 tw:items-center tw:justify-center tw:rounded-full tw:bg-[#12263d] tw:text-[#6f94b8]">
              <MessageSquareDiff className="tw:size-6" aria-hidden="true" />
            </div>
            <h3 className="tw:mt-4 tw:text-[16px] tw:font-semibold tw:text-white">
              No se encontraron reseñas
            </h3>
            <p className="tw:mt-1 tw:text-[14px] tw:text-[#7ba1c4]">
              {searchTerm
                ? "No hay reseñas que coincidan con los términos de búsqueda."
                : "No hay reseñas en este estado en este momento."}
            </p>
            {searchTerm ? (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  startTransition(async () => {
                    const response = await getReviewsAction({
                      status: statusFilter,
                      search: "",
                      sort: sortOrder,
                      page: 1,
                      limit: 10,
                    });
                    if (response.success && response.data) {
                      setReviews(response.data.reviews);
                      setPagination(response.data.pagination);
                    }
                  });
                }}
                className="tw:mt-4 tw:inline-flex tw:items-center tw:gap-1.5 tw:rounded-lg tw:border tw:border-[#204060] tw:bg-[#0c1a2c] tw:px-3.5 tw:py-1.5 tw:text-[13px] tw:text-[#bcd3ea] tw:hover:bg-[#152c48]"
              >
                Limpiar búsqueda
              </button>
            ) : null}
          </div>
        ) : (
          <div className="tw:grid tw:gap-4">
            {reviews.map((review) => {
              const isWorking = activeActionId === review.id;
              const hasConsent = review.publicationConsent;

              return (
                <article
                  key={review.id}
                  className={`tw:rounded-2xl tw:border tw:bg-[#0c1929] tw:p-6 tw:transition-all ${
                    review.moderationStatus === "pending"
                      ? "tw:border-amber-700/50 tw:shadow-md tw:shadow-amber-950/20"
                      : review.moderationStatus === "published"
                      ? "tw:border-[#1e4438]"
                      : "tw:border-[#2e2025]"
                  }`}
                >
                  <div className="tw:flex tw:flex-col tw:gap-4 tw:lg:flex-row tw:lg:items-start tw:lg:justify-between">
                    {/* Left: Review details */}
                    <div className="tw:min-w-0 tw:flex-1 tw:space-y-3">
                      {/* Top badges and rating */}
                      <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-2.5">
                        {/* Rating stars */}
                        <div
                          className="tw:flex tw:items-center tw:gap-1 tw:text-amber-400"
                          aria-label={`Calificación: ${review.rating} de 5 estrellas`}
                        >
                          {stars.map((val) => (
                            <Star
                              key={val}
                              size={16}
                              fill={val <= review.rating ? "currentColor" : "none"}
                              aria-hidden="true"
                            />
                          ))}
                          <span className="tw:ml-1 tw:text-[13px] tw:font-bold tw:text-white">
                            {review.rating}/5
                          </span>
                        </div>

                        {/* Status Badge */}
                        {review.moderationStatus === "pending" ? (
                          <span className="tw:inline-flex tw:items-center tw:gap-1 tw:rounded-full tw:border tw:border-amber-700/60 tw:bg-amber-950/80 tw:px-2.5 tw:py-0.5 tw:text-[12px] tw:font-semibold tw:text-amber-300">
                            <Clock className="tw:size-3" aria-hidden="true" />
                            Pendiente
                          </span>
                        ) : review.moderationStatus === "published" ? (
                          <span className="tw:inline-flex tw:items-center tw:gap-1 tw:rounded-full tw:border tw:border-emerald-700/60 tw:bg-emerald-950/80 tw:px-2.5 tw:py-0.5 tw:text-[12px] tw:font-semibold tw:text-emerald-300">
                            <CheckCircle2 className="tw:size-3" aria-hidden="true" />
                            Publicada
                          </span>
                        ) : (
                          <span className="tw:inline-flex tw:items-center tw:gap-1 tw:rounded-full tw:border tw:border-red-900/60 tw:bg-red-950/80 tw:px-2.5 tw:py-0.5 tw:text-[12px] tw:font-semibold tw:text-red-300">
                            <XCircle className="tw:size-3" aria-hidden="true" />
                            Rechazada / Retirada
                          </span>
                        )}

                        {/* Publication Consent Badge */}
                        {hasConsent ? (
                          <span className="tw:inline-flex tw:items-center tw:gap-1 tw:rounded-full tw:border tw:border-[#1b4b60] tw:bg-[#0d2a38] tw:px-2.5 tw:py-0.5 tw:text-[12px] tw:font-medium tw:text-[#7ee2ff]">
                            ✓ Autorizada para publicar
                          </span>
                        ) : (
                          <span className="tw:inline-flex tw:items-center tw:gap-1 tw:rounded-full tw:border tw:border-amber-900/50 tw:bg-[#281c0f] tw:px-2.5 tw:py-0.5 tw:text-[12px] tw:font-medium tw:text-amber-300">
                            ✕ Solo privada (sin autorización)
                          </span>
                        )}

                        {/* Source Badge */}
                        <span className="tw:inline-flex tw:items-center tw:gap-1 tw:text-[12px] tw:text-[#7ba1c4]">
                          {review.source === "website" ? (
                            <>
                              <Globe className="tw:size-3" aria-hidden="true" />
                              Sitio web
                            </>
                          ) : (
                            <>
                              <MessageSquare className="tw:size-3" aria-hidden="true" />
                              WhatsApp manual
                            </>
                          )}
                        </span>
                      </div>

                      {/* Client Header */}
                      <div>
                        <h3 className="tw:text-[18px] tw:font-bold tw:text-white">
                          {review.displayName}
                        </h3>
                        {review.organization ? (
                          <p className="tw:text-[14px] tw:font-medium tw:text-[#8ad1ff]">
                            {review.organization}
                          </p>
                        ) : (
                          <p className="tw:text-[13px] tw:text-[#6a849f]">Cliente particular</p>
                        )}
                      </div>

                      {/* Comment text */}
                      <blockquote className="tw:rounded-xl tw:border tw:border-[#1c3650] tw:bg-[#071322] tw:p-4 tw:text-[15px] tw:leading-relaxed tw:text-[#dbe9f7]">
                        “{review.comment}”
                      </blockquote>

                      {/* Timestamp metadata */}
                      <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-4 tw:text-[12px] tw:text-[#6f8da8]">
                        <span>Recibida: {formatDate(review.createdAt)}</span>
                        {review.publishedAt ? (
                          <span>Publicada: {formatDate(review.publishedAt)}</span>
                        ) : null}
                      </div>
                    </div>

                    {/* Right: Administrative actions */}
                    <div className="tw:flex tw:flex-row tw:flex-wrap tw:gap-2.5 tw:lg:w-48 tw:lg:flex-col tw:lg:items-stretch">
                      {review.moderationStatus === "pending" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => openConfirmation("approve", review)}
                            disabled={isWorking || !hasConsent}
                            className={`tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:rounded-xl tw:px-4 tw:py-2.5 tw:text-[13px] tw:font-semibold tw:transition-all ${
                              hasConsent
                                ? "tw:bg-emerald-500 tw:text-[#031d14] tw:shadow-md tw:shadow-emerald-950/40 tw:hover:bg-emerald-400 tw:focus:ring-2 tw:focus:ring-emerald-400"
                                : "tw:cursor-not-allowed tw:border tw:border-[#2b3a4a] tw:bg-[#142232] tw:text-[#668099]"
                            } tw:disabled:opacity-60`}
                            title={
                              !hasConsent
                                ? "No se puede publicar: el cliente no otorgó consentimiento de publicación."
                                : "Aprobar y publicar testimonio en la web"
                            }
                          >
                            <CheckCircle2 className="tw:size-4" aria-hidden="true" />
                            <span>Aprobar</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => openConfirmation("reject", review)}
                            disabled={isWorking}
                            className="tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:rounded-xl tw:border tw:border-red-900/60 tw:bg-[#251016] tw:px-4 tw:py-2.5 tw:text-[13px] tw:font-medium tw:text-[#ff9ea9] tw:transition-colors tw:hover:bg-[#381620] tw:disabled:opacity-60"
                          >
                            <Ban className="tw:size-4" aria-hidden="true" />
                            <span>Rechazar</span>
                          </button>
                        </>
                      ) : review.moderationStatus === "published" ? (
                        <button
                          type="button"
                          onClick={() => openConfirmation("withdraw", review)}
                          disabled={isWorking}
                          className="tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:rounded-xl tw:border tw:border-amber-700/60 tw:bg-[#26170a] tw:px-4 tw:py-2.5 tw:text-[13px] tw:font-semibold tw:text-amber-200 tw:transition-colors tw:hover:bg-[#3d2410] tw:disabled:opacity-60"
                        >
                          <Archive className="tw:size-4" aria-hidden="true" />
                          <span>Retirar de la web</span>
                        </button>
                      ) : (
                        /* Rejected: allow re-approving if consented */
                        hasConsent ? (
                          <button
                            type="button"
                            onClick={() => openConfirmation("approve", review)}
                            disabled={isWorking}
                            className="tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:rounded-xl tw:border tw:border-emerald-600/60 tw:bg-[#0e2920] tw:px-4 tw:py-2.5 tw:text-[13px] tw:font-medium tw:text-emerald-200 tw:transition-colors tw:hover:bg-[#153f31] tw:disabled:opacity-60"
                          >
                            <CheckCircle2 className="tw:size-4" aria-hidden="true" />
                            <span>Reactivar y Publicar</span>
                          </button>
                        ) : (
                          <span className="tw:text-center tw:text-[12px] tw:text-[#6a849f]">
                            Sin acciones disponibles (sin consentimiento).
                          </span>
                        )
                      )}

                      {!hasConsent && review.moderationStatus === "pending" ? (
                        <p className="tw:text-[11px] tw:leading-snug tw:text-amber-400/90">
                          ⚠ Bloqueado: el cliente no autorizó la publicación pública.
                        </p>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Pagination controls */}
        {pagination.totalPages > 1 ? (
          <nav
            aria-label="Paginación de reseñas"
            className="tw:mt-6 tw:flex tw:items-center tw:justify-between tw:rounded-xl tw:border tw:border-[#1a334d] tw:bg-[#0c1929] tw:p-4"
          >
            <button
              type="button"
              disabled={pagination.page <= 1 || isPending}
              onClick={() => reloadData(pagination.page - 1)}
              className="tw:inline-flex tw:items-center tw:gap-1.5 tw:rounded-lg tw:border tw:border-[#204060] tw:bg-[#091524] tw:px-3.5 tw:py-2 tw:text-[13px] tw:text-[#bcd3ea] tw:hover:bg-[#12263f] tw:disabled:opacity-40"
            >
              Anterior
            </button>
            <span className="tw:text-[13px] tw:text-[#8cb1d4]">
              Página {pagination.page} de {pagination.totalPages}
            </span>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages || isPending}
              onClick={() => reloadData(pagination.page + 1)}
              className="tw:inline-flex tw:items-center tw:gap-1.5 tw:rounded-lg tw:border tw:border-[#204060] tw:bg-[#091524] tw:px-3.5 tw:py-2 tw:text-[13px] tw:text-[#bcd3ea] tw:hover:bg-[#12263f] tw:disabled:opacity-40"
            >
              Siguiente
            </button>
          </nav>
        ) : null}
      </section>

      {/* Confirmation Modal */}
      {confirmation.isOpen && confirmation.review ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
          className="tw:fixed tw:inset-0 tw:z-50 tw:flex tw:items-center tw:justify-center tw:bg-black/80 tw:p-4 tw:backdrop-blur-sm"
        >
          <div className="tw:w-full tw:max-w-lg tw:rounded-2xl tw:border tw:border-[#1f3a56] tw:bg-[#0a1828] tw:p-6 tw:shadow-2xl">
            <div className="tw:flex tw:items-center tw:justify-between">
              <h3 id="confirm-modal-title" className="tw:text-[18px] tw:font-bold tw:text-white">
                {confirmation.action === "approve"
                  ? "¿Aprobar y publicar reseña?"
                  : confirmation.action === "reject"
                  ? "¿Rechazar reseña?"
                  : "¿Retirar reseña de la página web?"}
              </h3>
              <button
                type="button"
                onClick={closeConfirmation}
                className="tw:rounded-lg tw:p-1.5 tw:text-[#7ba1c4] tw:hover:bg-[#142840] tw:hover:text-white"
                aria-label="Cerrar modal"
              >
                <X className="tw:size-5" aria-hidden="true" />
              </button>
            </div>

            <div className="tw:mt-4 tw:space-y-3">
              <p className="tw:text-[14px] tw:text-[#c2d7eb]">
                {confirmation.action === "approve"
                  ? "Esta acción hará visible inmediatamente la opinión del cliente en la sección #resenas del sitio público."
                  : confirmation.action === "reject"
                  ? "Esta reseña no se mostrará públicamente pero se conservará en el registro administrativo."
                  : "Esta reseña dejará de ser visible de forma inmediata en la web pública."}
              </p>

              <div className="tw:rounded-xl tw:border tw:border-[#1b344e] tw:bg-[#06111f] tw:p-3.5 tw:text-[13px]">
                <p className="tw:font-semibold tw:text-white">
                  {confirmation.review.displayName}
                  {confirmation.review.organization ? ` (${confirmation.review.organization})` : ""}
                </p>
                <p className="tw:mt-1 tw:line-clamp-2 tw:text-[#9bb7d2]">
                  “{confirmation.review.comment}”
                </p>
                <p className="tw:mt-1.5 tw:font-medium tw:text-amber-400">
                  Calificación: {confirmation.review.rating} / 5 estrellas
                </p>
              </div>

              <div>
                <label
                  htmlFor="moderation-notes"
                  className="tw:block tw:text-[12px] tw:font-medium tw:text-[#8cb1d4]"
                >
                  Nota de moderación (opcional, para bitácora interna)
                </label>
                <input
                  id="moderation-notes"
                  type="text"
                  value={confirmation.notes}
                  onChange={(e) =>
                    setConfirmation((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="Ej: Verificado por WhatsApp, cliente de Quito"
                  className="tw:mt-1 tw:block tw:w-full tw:rounded-xl tw:border tw:border-[#204060] tw:bg-[#091524] tw:px-3.5 tw:py-2 tw:text-[13px] tw:text-white tw:placeholder-[#516b85] tw:focus:border-[#00e5ff] tw:focus:outline-none"
                />
              </div>
            </div>

            <div className="tw:mt-6 tw:flex tw:items-center tw:justify-end tw:gap-3">
              <button
                type="button"
                onClick={closeConfirmation}
                className="tw:rounded-xl tw:border tw:border-[#204060] tw:bg-[#0c1a2c] tw:px-4 tw:py-2.5 tw:text-[13px] tw:font-medium tw:text-[#bcd3ea] tw:hover:bg-[#12263f]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={executeConfirmedAction}
                className={`tw:inline-flex tw:items-center tw:gap-1.5 tw:rounded-xl tw:px-4 tw:py-2.5 tw:text-[13px] tw:font-semibold ${
                  confirmation.action === "approve"
                    ? "tw:bg-emerald-500 tw:text-[#031d14] tw:hover:bg-emerald-400"
                    : confirmation.action === "reject"
                    ? "tw:bg-red-600 tw:text-white tw:hover:bg-red-500"
                    : "tw:bg-amber-600 tw:text-white tw:hover:bg-amber-500"
                }`}
              >
                Confirmar{" "}
                {confirmation.action === "approve"
                  ? "Aprobación"
                  : confirmation.action === "reject"
                  ? "Rechazo"
                  : "Retirada"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

