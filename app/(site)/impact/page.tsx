import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Impact",
  description: "Les chiffres d'impact de la Fondation Sarje.",
};

export default async function ImpactPage() {
  const [impactStats, testimonials, galleryPhotos] = await Promise.all([
    prisma.impactStat.findMany({ orderBy: { order: "asc" } }),
    prisma.testimonial.findMany({ orderBy: { order: "asc" }, include: { photo: true } }),
    prisma.galleryPhoto.findMany({ orderBy: { order: "asc" }, include: { photo: true } }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">
        Impact
      </p>
      <h1 className="mt-3 font-display text-h1 text-ink">Notre impact</h1>
      <p className="mt-5 max-w-xl text-body text-muted">
        Quelques chiffres qui donnent la mesure de l&rsquo;action de la
        fondation sur le terrain.
      </p>

      {impactStats.length === 0 ? (
        <p className="mt-12 text-body text-muted">
          Les chiffres d&rsquo;impact de la fondation seront publiés ici
          prochainement.
        </p>
      ) : (
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {impactStats.map((stat) => (
            <div key={stat.id} className="rounded-xl border border-line bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <p className="font-display text-h1 text-accent-deep">{stat.value}</p>
              <div className="mt-4 mb-3 h-[3px] w-12 rounded-full bg-accent" />
              <p className="text-sm font-medium text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-16">
        <h2 className="font-display text-h2 text-ink">Sur le terrain</h2>
        {galleryPhotos.length === 0 ? (
          <div className="mt-6 rounded-md border border-dashed border-line p-8 text-center">
            <p className="text-body text-muted">
              Galerie de terrain à venir, une fois les photos et
              autorisations transmises par la fondation.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {galleryPhotos.map((item) => (
              <figure key={item.id}>
                <Image
                  src={item.photo.url}
                  alt={item.photo.alt}
                  width={360}
                  height={270}
                  className="aspect-4/3 w-full rounded-md object-cover"
                />
                {item.caption && (
                  <figcaption className="mt-1.5 text-xs text-muted">
                    {item.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </div>

      <div className="mt-16">
        <h2 className="font-display text-h2 text-ink">Témoignages</h2>
        {testimonials.length === 0 ? (
          <div className="mt-6 rounded-md border border-dashed border-line p-8 text-center">
            <p className="text-body text-muted">
              Témoignages à venir, une fois les autorisations transmises par
              la fondation.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {testimonials.map((testimonial) => (
              <blockquote
                key={testimonial.id}
                className="relative rounded-xl border border-line bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="absolute top-6 right-6 text-accent/10">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.714 4.103-9.609 9.983-9.609v3.391c-2.83 0-5.467 1.258-6.177 4.609h6.177v9h-9.983zm-14.017 0v-7.391c0-5.714 4.103-9.609 9.983-9.609v3.391c-2.83 0-5.467 1.258-6.177 4.609h6.177v9h-9.983z"/></svg>
                </div>
                <p className="relative z-10 text-body text-ink">&ldquo;{testimonial.quote}&rdquo;</p>
                <footer className="relative z-10 mt-6 flex items-center gap-3 border-t border-line/50 pt-4">
                  {testimonial.photo ? (
                    <Image
                      src={testimonial.photo.url}
                      alt={testimonial.photo.alt}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full border border-line object-cover"
                    />
                  ) : (
                    <span className="h-10 w-10 rounded-full border border-line bg-line/30" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {testimonial.author}
                    </p>
                    {testimonial.role && (
                      <p className="text-xs text-muted">{testimonial.role}</p>
                    )}
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
