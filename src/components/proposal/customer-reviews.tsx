import { Star } from "lucide-react";
import { ReviewForm } from "@/components/proposal/review-form";
import { loadPublishedReviews } from "@/lib/review-store";

const stars = [1, 2, 3, 4, 5] as const;

export async function CustomerReviews() {
  // Read only published AND consented rows. Each request fetches a fresh,
  // RLS-filtered response; never access private reviews in this component.
  const publishedReviews = await loadPublishedReviews();
  const submissionEnabled = process.env.REVIEWS_SUBMISSION_ENABLED === "true";

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
              Las opiniones pasan por revisión antes de publicarse.
              Solo mostramos testimonios reales autorizados por quienes los escribieron.
            </p>
          </div>
          <ReviewForm enabled={submissionEnabled} />
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
        ) : (
          <p className="tw:mt-8 tw:text-[15px] tw:text-[#a9bfd5]">
            Las reseñas aprobadas aparecerán aquí.
          </p>
        )}
      </div>
    </section>
  );
}
