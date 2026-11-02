"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import Script from "next/script";
import { ArrowUpRight, Star } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Textarea } from "@/components/shadcn/textarea";
import { whatsappUrl } from "@/lib/content";

const subscribeToHydration = () => () => {};
const hydratedSnapshot = () => true;
const serverSnapshot = () => false;
const choices = [1, 2, 3, 4, 5] as const;
const siteKey = process.env.NEXT_PUBLIC_REVIEWS_TURNSTILE_SITE_KEY;

export function ReviewForm({ enabled }: { enabled: boolean }) {
  const hydrated = useSyncExternalStore(subscribeToHydration, hydratedSnapshot, serverSnapshot);
  const [rating, setRating] = useState(0);
  const [ratingError, setRatingError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabled || !hydrated || submitting) return;
    const form = event.currentTarget;
    const name = form.elements.namedItem("reviewerName") as HTMLInputElement;
    const comment = form.elements.namedItem("reviewComment") as HTMLTextAreaElement;
    const org = form.elements.namedItem("reviewOrganization") as HTMLInputElement;
    const allowPublish = form.elements.namedItem("reviewPermission") as HTMLInputElement;
    const allowProcessing = form.elements.namedItem("reviewDataConsent") as HTMLInputElement;

    name.setCustomValidity(name.value.trim().length < 2 ? "Ingresa al menos dos caracteres." : "");
    comment.setCustomValidity(comment.value.trim().length < 20 ? "Escribe al menos 20 caracteres." : "");
    if (!form.reportValidity()) return;
    if (!rating) {
      setRatingError(true);
      return;
    }
    const turnstileToken = form.querySelector<HTMLInputElement>('[name="cf-turnstile-response"]')?.value ?? "";
    if (!turnstileToken) {
      setError("Completa la verificación antispam antes de enviar.");
      return;
    }
    setError("");
    setNotice("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.value.trim(),
          organization: org.value.trim(),
          rating,
          comment: comment.value.trim(),
          publicationConsent: allowPublish.checked,
          privacyConsent: allowProcessing.checked,
          turnstileToken,
          website: (form.elements.namedItem("website") as HTMLInputElement).value,
        }),
      });
      const body: { message?: string } = await response.json();
      if (!response.ok) throw new Error(body.message || "No se pudo almacenar la reseña.");
      setNotice(body.message || "Tu reseña se registró para revisión.");
      form.reset();
      setRating(0);
      setRatingError(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo enviar la reseña.");
    } finally {
      setSubmitting(false);
      const turnstile = (window as Window & { turnstile?: { reset: () => void } }).turnstile;
      turnstile?.reset();
    }
  }

  const ready = enabled && Boolean(siteKey);
  return (
    <div className="tw:min-w-0 tw:rounded-2xl tw:border tw:border-[#26425f] tw:bg-[#0c1b2d] tw:p-5 tw:sm:p-7">
      <h3 className="tw:text-[25px] tw:text-[#ecf5ff]">Comparte tu opinión</h3>
      <p className="tw:mt-2 tw:text-[15px] tw:leading-relaxed tw:text-[#b7cbe0]">
        Envíala desde esta página. Quedará almacenada para revisión y solo se publicará si lo autorizas.
      </p>

      {!ready ? (
        <p className="tw:mt-6 tw:rounded-xl tw:border tw:border-[#37516d] tw:bg-[#13273d] tw:p-4 tw:text-[15px] tw:text-[#c1d7ed]" role="status">
          Estamos preparando el envío directo de reseñas. Mientras tanto, puedes{" "}
          <a className="tw:underline" href={whatsappUrl("Hola, quiero compartir una reseña sobre Nexo Digital Studio.")} target="_blank" rel="noopener noreferrer">
            compartir tu experiencia por WhatsApp
          </a>.
        </p>
      ) : null}
      {ready ? <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" /> : null}
      <form onSubmit={handleSubmit} className="tw:mt-6 tw:grid tw:gap-5" onInput={(event) => {
        const field = event.target;
        if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) field.setCustomValidity("");
        setError("");
        setNotice("");
      }}>
        <fieldset disabled={!hydrated || !ready || submitting} className="tw:grid tw:gap-5 tw:disabled:opacity-60" aria-label="Enviar reseña para revisión">
          <div className="tw:grid tw:gap-4 tw:sm:grid-cols-2">
            <div className="tw:grid tw:gap-2">
              <label htmlFor="reviewerName" className="tw:text-[14px] tw:text-[#e5f0ff]">Tu nombre *</label>
              <Input id="reviewerName" name="reviewerName" autoComplete="name" required minLength={2} maxLength={90} className="tw:min-h-12 tw:border-[#35506a] tw:bg-[#071320] tw:text-white" placeholder="Nombre y apellido" />
            </div>
            <div className="tw:grid tw:gap-2">
              <label htmlFor="reviewOrganization" className="tw:text-[14px] tw:text-[#e5f0ff]">Empresa o proyecto (opcional)</label>
              <Input id="reviewOrganization" name="reviewOrganization" maxLength={100} className="tw:min-h-12 tw:border-[#35506a] tw:bg-[#071320] tw:text-white" placeholder="Tu negocio" />
            </div>
          </div>
          <fieldset className="tw:min-w-0 tw:space-y-3">
            <legend className="tw:text-[14px] tw:text-[#e5f0ff]">Calificación *</legend>
            <div className="tw:flex tw:flex-wrap tw:gap-2" role="radiogroup" aria-label="Calificación de 1 a 5 estrellas" aria-invalid={ratingError || undefined}>
              {choices.map((value) => (
                <label key={value} className={"tw:inline-flex tw:min-h-11 tw:min-w-11 tw:cursor-pointer tw:items-center tw:justify-center tw:gap-1 tw:rounded-lg tw:border tw:px-3 tw:focus-within:ring-2 tw:focus-within:ring-[#7bc7ff] " + (rating === value ? "tw:border-[#7ccaff] tw:bg-[#244e75] tw:text-[#c9ecff]" : "tw:border-[#36516c] tw:bg-[#11273d] tw:text-[#b7c9df]")}>
                  <input type="radio" name="reviewRating" value={value} checked={rating === value} onChange={() => { setRating(value); setRatingError(false); }} className="tw:sr-only" aria-label={value + (value === 1 ? " estrella" : " estrellas")} />
                  <Star size={18} aria-hidden="true" fill={rating >= value ? "currentColor" : "none"} />
                  <span className="tw:text-[14px]">{value}</span>
                </label>
              ))}
            </div>
            {ratingError ? <p role="alert" className="tw:text-[13px] tw:text-[#ffb9b9]">Selecciona una calificación.</p> : null}
          </fieldset>
          <div className="tw:grid tw:gap-2">
            <label htmlFor="reviewComment" className="tw:text-[14px] tw:text-[#e5f0ff]">Cuéntanos tu experiencia *</label>
            <Textarea id="reviewComment" name="reviewComment" required minLength={20} maxLength={700} placeholder="¿Qué funcionó y qué podríamos mejorar?" className="tw:min-h-32 tw:border-[#35506a] tw:bg-[#071320] tw:text-white" />
            <p className="tw:text-[13px] tw:text-[#9fb7d1]">20–700 caracteres. No incluyas datos sensibles.</p>
          </div>
          <label className="tw:flex tw:items-start tw:gap-3 tw:text-[14px] tw:leading-relaxed tw:text-[#c2d3e6]">
            <input required type="checkbox" name="reviewDataConsent" className="tw:mt-1 tw:size-4 tw:shrink-0 tw:accent-[#4b9bff]" />
            Autorizo el almacenamiento y tratamiento de estos datos para gestionar mi reseña. *
          </label>
          <label className="tw:flex tw:items-start tw:gap-3 tw:text-[14px] tw:leading-relaxed tw:text-[#c2d3e6]">
            <input type="checkbox" name="reviewPermission" className="tw:mt-1 tw:size-4 tw:shrink-0 tw:accent-[#4b9bff]" />
            Autorizo que Nexo publique mi nombre, empresa si la indiqué, calificación y opinión. Es opcional.
          </label>
          <input type="text" name="website" autoComplete="off" tabIndex={-1} aria-hidden="true" className="tw:absolute tw:-left-[10000px]" />
          {ready ? <div className="cf-turnstile" data-sitekey={siteKey} data-theme="dark" /> : null}
          <Button type="submit" disabled={submitting} className="tw:min-h-12 tw:h-auto tw:justify-self-start tw:rounded-full tw:bg-[#2764e8] tw:px-6 tw:py-3 tw:text-[15px] tw:whitespace-normal tw:text-left">
            {submitting ? "Enviando reseña…" : "Enviar reseña para revisión"} <ArrowUpRight size={18} aria-hidden="true" />
          </Button>
        </fieldset>
        {notice ? <p role="status" className="tw:text-[14px] tw:text-[#b9eacb]">{notice}</p> : null}
        {error ? <p role="alert" className="tw:text-[14px] tw:text-[#ffb9b9]">{error}</p> : null}
        <p className="tw:text-[13px] tw:leading-relaxed tw:text-[#9fb7d1]">
          La reseña se almacena para revisión; no se publica automáticamente.
          Puedes solicitar su retirada escribiéndonos por el canal de contacto.
        </p>
      </form>
    </div>
  );
}
