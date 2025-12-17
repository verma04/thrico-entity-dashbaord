import { cn } from "@/lib/utils";
import { Star, ShoppingBag } from "lucide-react";

interface MarketplaceListProps {
  content: Record<string, any>;
  previewDevice: string;
}

export const MarketplaceList = ({
  content,
  previewDevice,
}: MarketplaceListProps) => {
  return (
    <div className="space-y-4">
      {(content.products || []).map((product: any, index: number) => {
        const imageUrl = `https://images.unsplash.com/photo-${
          1600000000000 + index * 100000
        }?auto=format&fit=crop&w=400&q=80`;
        return (
          <div
            key={index}
            className={cn(
              "bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer",
              previewDevice === "mobile" ? "flex-col" : "flex"
            )}
          >
            <div
              className={cn(
                "bg-muted bg-cover bg-center",
                previewDevice === "mobile" ? "h-48 w-full" : "w-32 h-32"
              )}
              style={{ backgroundImage: `url(${imageUrl})` }}
            ></div>
            <div className="p-4 flex-1">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {product.name || `Product ${index + 1}`}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {product.category || "Category"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {product.description || "Product description goes here..."}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <span className="font-bold text-xl">
                    ${product.price || Math.floor(Math.random() * 100) + 10}
                  </span>
                  {product.originalPrice && (
                    <p className="text-sm text-muted-foreground line-through">
                      ${product.originalPrice}
                    </p>
                  )}
                </div>
              </div>
              {product.rating && (
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={cn(
                        "text-lg",
                        i < Math.floor(product.rating)
                          ? "text-yellow-500"
                          : "text-gray-300"
                      )}
                    >
                      ★
                    </span>
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">
                    ({product.reviews || Math.floor(Math.random() * 100)}{" "}
                    reviews)
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
