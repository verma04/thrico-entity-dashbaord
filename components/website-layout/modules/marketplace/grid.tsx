import { cn } from "@/lib/utils";
import { Star, ShoppingBag } from "lucide-react";

interface MarketplaceGridProps {
  content: Record<string, any>;
  previewDevice: string;
}

export const MarketplaceGrid = ({
  content,
  previewDevice,
}: MarketplaceGridProps) => {
  return (
    <div
      className={cn(
        "grid gap-6",
        previewDevice === "mobile"
          ? "grid-cols-1"
          : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
      )}
    >
      {(content.products || []).map((product: any, index: number) => {
        const imageUrl = `https://images.unsplash.com/photo-${
          1600000000000 + index * 100000
        }?auto=format&fit=crop&w=400&q=80`;
        return (
          <div
            key={index}
            className="bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="relative">
              <div
                className="aspect-square bg-muted bg-cover bg-center group-hover:scale-105 transition-transform"
                style={{ backgroundImage: `url(${imageUrl})` }}
              ></div>
              {product.discount && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  -{product.discount}%
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold truncate">
                {product.name || `Product ${index + 1}`}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {product.category || "Category"}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-bold text-lg">
                  ${product.price || Math.floor(Math.random() * 100) + 10}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              {product.rating && (
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "text-sm",
                        i < Math.floor(product.rating)
                          ? "text-yellow-500"
                          : "text-gray-300"
                      )}
                    >
                      ★
                    </span>
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">
                    ({product.reviews || Math.floor(Math.random() * 100)})
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
