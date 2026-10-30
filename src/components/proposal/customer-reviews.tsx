"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import { ArrowUpRight, Star } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { Textarea } from "@/components/shadcn/textarea";
import { whatsappUrl } from "@/lib/content";
import { publishedReviews } from "@/lib/published-reviews";

const subscribeToHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;
const stars = [1, 2, 3, 4, 5] as const;

export function CustomerReviews() {
  const hydrated = useSyncExternalStore(subscribeToHydration, clientSnapshot, serverSnapshot);
  const [rating, setRating] = useState(0);
  const [ratingError, setRatingError] = useState(false);
  const [preparedUrl, setPreparedUrl] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hydrated) return;
    const form = event.currentTarget;
    const name = form.elements.namedItem("reviewerName") as HTMLInputElement;
    const comment = form.elements.namedItem("reviewComment") as HTMLTextAreaElement;
    const organization = form.elements.namedItem("reviewOrganization") as HTMLInputElement;
    const permission = form.elements.namedItem("reviewPermission") as HTMLInputElement;
    name.setCustomValidity(name.value.trim().length < 2 ? "Escribe al menos 2 caracteres en el nombre." : "");
    comment.setCustomValidity(comment.value.trim().length < 20 ? "Escribe una opinión de al menos 20 caracteres." : "");
    if (!form.reportValidity()) {
      setPreparedUrl("");
      return;
    }
    if (!stars.some((value) => value === rating)) {
      setRatingError(true);
      setPreparedUrl("");
      return;
    }
    const message = [
      "Hola, quiero compartir una reseña sobre mi experiencia con Nexo Digital Studio.",
      "Nombre: " + name.value.trim(),
      organization.value.trim() ? "Empresa o proyecto: " + organization.value.trim() : "",
      "Calificación: " + rating + "/5",
      "Opinión: " + comment.value.trim(),
      "¿Autorizo publicar mi nombre, empresa si la indiqué, calificación y opinión?: " + (permission.checked ? "Sí" : "No"),
      "Solicito revisión antes de publicar; entiendo que el sitio no publica automáticamente.",
    ].filter(Boolean).join("\n");
    const url = whatsappUrl(message);
    setPreparedUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <section id="resenas" aria-labelledby="resenas-heading" className="refinement-section tw:bg-[#0a1423]">
      <div className="proposal-container">
        <div className="tw:grid tw:items-start tw:gap-10 tw:lg:grid-cols-[.82fr_1.18fr]">
          <div className="tw:min-w-0">
            <p className="tw:mb-4 tw:text-[13px] tw:font-semibold tw:tracking-[.15em] tw:text-[#8ad1ff] tw:uppercase">Opiniones de clientes</p>
            <h2 id="resenas-heading" className="refinement-heading">Tu experiencia<br />también cuenta.</h2>
            <p className="tw:mt-6 tw:max-w-[420px] tw:text-[17px] tw:leading-relaxed tw:text-muted-foreground">
              Si trabajaste con Nexo Digital Studio, cuéntanos cómo fue la experiencia.
              Nos interesa conocer lo que funcionó y lo que podemos mejorar.
            </p>
            <p className="tw:mt-5 tw:max-w-[440px] tw:text-[15px] tw:leading-relaxed tw:text-muted-foreground">
              Las opiniones no se publican automáticamente. Solo mostramos testimonios reales,
              revisados y autorizados por quien los escribió.
            </p>
          </div>
          <div className="tw:min-w-0 tw:rounded-2xl tw:border tw:border-[#26425f] tw:bg-[#0c1b2d] tw:p-5 tw:sm:p-7">
            <h3 className="tw:text-[25px] tw:text-[#ecf5ff]">Comparte tu opinión</h3>
            <p className="tw:mt-2 tw:text-[15px] tw:leading-relaxed tw:text-[#b7cbe0]">
              Prepara tu reseña y envíala por WhatsApp. No se publica ni se envía sin tu acción.
            </p>
            <form
              className="tw:mt-6 tw:grid tw:gap-5"
              onSubmit={handleSubmit}
              onInput={(event) => {
                const element = event.target;
                if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
                  element.setCustomValidity("");
                }
                setPreparedUrl("");
              }}
            >
              <noscript><p className="tw:text-[14px] tw:text-[#b7cbe0]">
                Activa JavaScript para preparar tu opinión o{" "}
                <a href={whatsappUrl("Hola, quiero compartir mi experiencia con Nexo Digital Studio.")} target="_blank" rel="noopener noreferrer" className="tw:underline">
                  escríbenos por WhatsApp
                </a>.
              </p></noscript>
              <fieldset disabled={!hydrated} className="tw:grid tw:gap-5 tw:disabled:opacity-60" aria-label="Tu reseña para Nexo Digital Studio">
                <div className="tw:grid tw:gap-4 tw:sm:grid-cols-2">
                  <div className="tw:grid tw:gap-2">
                    <label htmlFor="reviewerName" className="tw:text-[14px] tw:text-[#e5f0ff]">Tu nombre *</label>
                    <Input id="reviewerName" name="reviewerName" autoComplete="name" required minLength={2} maxLength={90} placeholder="Nombre y apellido" className="tw:min-h-12 tw:border-[#35506a] tw:bg-[#071320] tw:text-white" />
                  </div>
                  <div className="tw:grid tw:gap-2">
                    <label htmlFor="reviewOrganization" className="tw:text-[14px] tw:text-[#e5f0ff]">Empresa o proyecto (opcional)</label>
                    <Input id="reviewOrganization" name="reviewOrganization" maxLength={100} placeholder="Tu negocio" className="tw:min-h-12 tw:border-[#35506a] tw:bg-[#071320] tw:text-white" />
                  </div>
                </div>
                <fieldset className="tw:min-w-0 tw:space-y-3">
                  <legend className="tw:text-[14px] tw:text-[#e5f0ff]">¿Cómo calificarías tu experiencia? *</legend>
                  <div className="tw:flex tw:flex-wrap tw:gap-2" role="radiogroup" aria-label="Calificación de 1 a 5 estrellas" aria-invalid={ratingError || undefined} aria-describedby={ratingError ? "reviewRatingError" : undefined}>
                    {stars.map((value) => (
                      <label key={value} className={"tw:inline-flex tw:min-h-11 tw:min-w-11 tw:cursor-pointer tw:items-center tw:justify-center tw:gap-1 tw:rounded-lg tw:border tw:px-3 tw:focus-within:ring-2 tw:focus-within:ring-[#7bc7ff] " + (rating === value ? "tw:border-[#7ccaff] tw:bg-[#244e75] tw:text-[#c9ecff]" : "tw:border-[#36516c] tw:bg-[#11273d] tw:text-[#b7c9df]")}>
                        <input type="radio" name="reviewRating" value={value} checked={rating === value} onChange={() => { setRating(value); setRatingError(false); setPreparedUrl(""); }} className="tw:sr-only" aria-label={value + (value === 1 ? " estrella" : " estrellas")} />
                        <Star size={18} aria-hidden="true" fill={rating >= value ? "currentColor" : "none"} />
                        <span className="tw:text-[14px]">{value}</span>
                      </label>
                    ))}
                  </div>
                  {ratingError ? <p id="reviewRatingError" role="alert" className="tw:text-[13px] tw:text-[#ffb9b9]">Selecciona una calificación entre 1 y 5.</p> : null}
                </fieldset>
                <div className="tw:grid tw:gap-2">
                  <label htmlFor="reviewComment" className="tw:text-[14px] tw:text-[#e5f0ff]">Cuéntanos tu experiencia *</label>
                  <Textarea id="reviewComment" name="reviewComment" required minLength={20} maxLength={700} placeholder="¿Cómo fue trabajar con Nexo? ¿Qué mejorarías?" className="tw:min-h-32 tw:border-[#35506a] tw:bg-[#071320] tw:text-white" />
                  <p className="tw:text-[13px] tw:text-[#9fb7d1]">De 20 a 700 caracteres. No incluyas datos sensibles.</p>
                </div>
                <label className="tw:flex tw:cursor-pointer tw:items-start tw:gap-3 tw:text-[14px] tw:leading-relaxed tw:text-[#c2d3e6]">
                  <input type="checkbox" name="reviewPermission" className="tw:mt-1 tw:size-4 tw:shrink-0 tw:accent-[#4b9bff]" />
                  Autorizo que Nexo publique mi nombre, empresa si la indiqué, calificación y opinión. Es opcional; si no marcas esta casilla, tu comentario será privado.
                </label>
                <Button type="submit" className="tw:min-h-12 tw:h-auto tw:justify-self-start tw:rounded-full tw:bg-[#2764e8] tw:px-6 tw:py-3 tw:text-[15px] tw:whitespace-normal tw:text-left">
                  Preparar reseña por WhatsApp <ArrowUpRight size={18} aria-hidden="true" />
                </Button>
              </fieldset>
              {preparedUrl ? (
                <p role="status" className="tw:text-[14px] tw:leading-relaxed tw:text-[#c1e9ff]">
                  Tu reseña está preparada. Revisa el mensaje y pulsa enviar en WhatsApp para compartirla.{" "}
                  <a href={preparedUrl} target="_blank" rel="noopener noreferrer" className="tw:underline">Abrir mensaje en WhatsApp</a>.
                </p>
              ) : null}
              <p className="tw:text-[13px] tw:leading-relaxed tw:text-[#9fb7d1]">
                Este formulario no guarda datos en el sitio: abre WhatsApp con un mensaje preparado.
                Solo se enviará si decides enviarlo allí. Nexo revisa los mensajes antes de cualquier publicación.
              </p>
            </form>
          </div>
        </div>
        {publishedReviews.length > 0 ? (
          <div className="tw:mt-10 tw:grid tw:gap-4 tw:md:grid-cols-2 tw:xl:grid-cols-3" aria-label="Reseñas publicadas">
            {publishedReviews.map((review) => (
              <figure key={review.id} className="tw:m-0 tw:rounded-2xl tw:border tw:border-[#24415e] tw:bg-[#112239] tw:p-6">
                <div className="tw:mb-4 tw:flex tw:gap-1 tw:text-[#9ed9ff]" aria-label={review.rating + " de 5 estrellas"}>
                  {stars.map((value) => <Star key={value} size={17} fill={value <= review.rating ? "currentColor" : "none"} aria-hidden="true" />)}
                </div>
                <blockquote className="tw:text-[16px] tw:leading-relaxed tw:text-[#e1edfb]">“{review.comment}”</blockquote>
                <figcaption className="tw:mt-6 tw:text-[14px] tw:text-[#b6cce1]">
                  <strong className="tw:font-semibold tw:text-[#e7f3ff]">{review.displayName}</strong>
                  {review.organization ? <span> · {review.organization}</span> : null}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
