import { Link } from "@tanstack/react-router";
import { ShoppingCart, Star } from "lucide-react";
import type { Product } from "@/lib/products";
import { formatBRL } from "@/lib/products";
import { useCart } from "@/contexts/cart";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;

  return (
    <div className="group relative bg-white border border-border hover:border-ink transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_40px_-12px_rgba(240,37,43,0.45)]">
      {product.badge && (
        <span className="absolute top-3 left-3 z-10 bg-brand text-white text-[11px] font-display italic font-bold px-2.5 py-1 uppercase tracking-wider">
          {product.badge}
        </span>
      )}
      {discount > 0 && !product.badge && (
        <span className="absolute top-3 left-3 z-10 bg-ink text-white text-[11px] font-display italic font-bold px-2.5 py-1">
          -{discount}%
        </span>
      )}

      <Link
        to="/produto/$id"
        params={{ id: product.id }}
        className="block aspect-square overflow-hidden bg-muted"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={800}
          height={800}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      <div className="p-4">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
          {product.brand}
        </div>
        <Link to="/produto/$id" params={{ id: product.id }}>
          <h3 className="mt-1 text-sm font-semibold text-ink line-clamp-2 min-h-[2.5rem] hover:text-brand transition">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mt-2 text-xs">
          <Star size={13} className="fill-brand text-brand" />
          <span className="font-semibold">{product.rating}</span>
          <span className="text-muted-foreground">({product.reviews})</span>
        </div>
        <div className="mt-3">
          {product.oldPrice && (
            <div className="text-xs text-muted-foreground line-through">
              {formatBRL(product.oldPrice)}
            </div>
          )}
          <div className="text-xl font-display italic font-bold text-ink">
            {formatBRL(product.price)}
          </div>
          <div className="text-[11px] text-muted-foreground">
            ou 12x de {formatBRL(product.price / 12)} sem juros
          </div>
        </div>
        <button
          onClick={() => add(product.id)}
          className="mt-4 w-full bg-ink text-white py-2.5 text-sm font-display italic font-bold uppercase tracking-wider hover:bg-brand transition flex items-center justify-center gap-2"
        >
          <ShoppingCart size={15} /> Adicionar
        </button>
      </div>
    </div>
  );
}
