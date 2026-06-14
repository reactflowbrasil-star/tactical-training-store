import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/lib/products";

export function CategoryCard({
  slug,
  title,
  subtitle,
  image,
}: {
  slug: Category;
  title: string;
  subtitle: string;
  image: string;
}) {
  return (
    <Link
      to="/categoria/$slug"
      params={{ slug }}
      className="group relative overflow-hidden block aspect-[4/5] bg-ink"
    >
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <div className="text-xs uppercase tracking-[0.3em] text-brand font-bold">
          {subtitle}
        </div>
        <h3 className="mt-2 text-4xl md:text-5xl font-display italic font-extrabold text-white uppercase">
          {title}
        </h3>
        <div className="mt-3 flex items-center gap-2 text-white font-display italic font-bold uppercase text-sm tracking-wider opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
          Explorar <ArrowRight size={16} />
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-1 bg-brand scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
    </Link>
  );
}
