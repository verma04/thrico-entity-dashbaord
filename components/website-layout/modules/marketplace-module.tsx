import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import { ModuleHeader } from "./module-header";
import { ModuleContainer } from "./module-container";

interface MarketplaceModuleProps {
  content: ModuleData["content"];
  layout: string;
}

export const MarketplaceModule = ({
  content,
  layout,
}: MarketplaceModuleProps) => {
  const products = content.products || [];

  return (
    <ModuleContainer 
      containerSettings={content.containerSettings}
      className="bg-gradient-to-b from-background to-muted/20"
    >
      <ModuleHeader
        title={content.title}
        description={content.description}
        alignment="center"
        titleClassName="text-3xl sm:text-4xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
        descriptionClassName="max-w-2xl mx-auto"
        layoutSettings={content.layoutSettings}
      />


        {/* 1. GRID CARDS */}
        {layout === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: any, index: number) => (
              <div
                key={index}
                className="group bg-card border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/50 cursor-pointer"
              >
                <div className="relative aspect-square bg-muted overflow-hidden">
                  {product.image ? (
                    <>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ShoppingBag className="w-16 h-16 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name || "Product Name"}
                  </h3>
                  {product.category && (
                    <p className="text-xs text-muted-foreground mb-2">
                      {product.category}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg text-primary">
                      ${product.price || "0.00"}
                    </span>
                    {product.rating && (
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500 text-sm">★</span>
                        <span className="text-sm font-medium">
                          {product.rating}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. LIST VIEW */}
        {layout === "list" && (
          <div className="space-y-4">
            {products.map((product: any, index: number) => (
              <div
                key={index}
                className="group bg-card border rounded-xl p-4 sm:p-5 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/50 cursor-pointer"
              >
                <div className="flex gap-4">
                  <div className="relative w-32 h-32 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                    {product.image ? (
                      <>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ShoppingBag className="w-12 h-12 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-xl mb-1 group-hover:text-primary transition-colors">
                          {product.name || "Product Name"}
                        </h3>
                        {product.category && (
                          <p className="text-sm text-muted-foreground">
                            {product.category}
                          </p>
                        )}
                      </div>
                      <span className="font-bold text-2xl text-primary">
                        ${product.price || "0.00"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                      {product.description || "High-quality product with excellent features and great value."}
                    </p>
                    <div className="flex items-center gap-4">
                      {product.seller && (
                        <span className="text-sm text-muted-foreground">
                          Sold by: {product.seller}
                        </span>
                      )}
                      {product.rating && (
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span className="text-sm font-medium">
                            {product.rating} / 5
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. MASONRY */}
        {layout === "masonry" && (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
            {products.map((product: any, index: number) => (
              <div
                key={index}
                className="break-inside-avoid group bg-card border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/50 cursor-pointer"
              >
                <div className="relative w-full bg-muted overflow-hidden">
                  {product.image ? (
                    <>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </>
                  ) : (
                    <div className="aspect-square flex items-center justify-center">
                      <ShoppingBag className="w-16 h-16 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">
                    {product.name || "Product Name"}
                  </h3>
                  {product.description && (
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {product.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg text-primary">
                      ${product.price || "0.00"}
                    </span>
                    {product.rating && (
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm">{product.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. FEATURED CARDS */}
        {layout === "cards" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product: any, index: number) => (
              <div
                key={index}
                className="group bg-card border-2 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 hover:border-primary/50 cursor-pointer"
              >
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  {product.image ? (
                    <>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ShoppingBag className="w-20 h-20 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  {product.category && (
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-3">
                      {product.category}
                    </span>
                  )}
                  <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                    {product.name || "Product Name"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                    {product.description || "Premium product with exceptional quality and outstanding features."}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="font-bold text-2xl text-primary">
                      ${product.price || "0.00"}
                    </span>
                    {product.rating && (
                      <div className="flex items-center gap-1">
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
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {products.length === 0 && (
          <div className="text-center py-16 px-4">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground text-lg">
              No products yet. Add products in the settings panel.
            </p>
          </div>
        )}
    </ModuleContainer>
  );
};
