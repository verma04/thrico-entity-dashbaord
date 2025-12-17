import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  name?: string;
  price?: string;
  description?: string;
  image?: string;
  category?: string;
  seller?: string;
  rating?: number;
}

interface MarketplaceSettingsProps {
  content: {
    products?: Product[];
    [key: string]: any;
  };
  onChange: (updates: any) => void;
}

const MarketplaceSettings: React.FC<MarketplaceSettingsProps> = ({
  content,
  onChange,
}) => {
  const updateProducts = (products: Product[]) => {
    onChange({ products });
  };

  const addProduct = () => {
    const products = [...(content.products || [])];
    products.push({
      name: "",
      price: "",
      description: "",
      image: "",
      category: "",
      seller: "",
      rating: 5,
    });
    updateProducts(products);
  };

  const removeProduct = (index: number) => {
    const products = [...(content.products || [])];
    products.splice(index, 1);
    updateProducts(products);
  };

  const updateProduct = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const products = [...(content.products || [])];
    products[index] = {
      ...products[index],
      [field]: value,
    };
    updateProducts(products);
  };

  return (
    <div className="space-y-3 border rounded-lg p-3 bg-muted/10">
      <div className="flex justify-between items-center">
        <Label className="text-xs uppercase font-bold text-muted-foreground">
          Products
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addProduct}
          className="h-7 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Product
        </Button>
      </div>

      {(content.products || []).map((product: Product, index: number) => (
        <div key={index} className="space-y-2 p-3 bg-background rounded border">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold">Product {index + 1}</span>
            <button
              onClick={() => removeProduct(index)}
              className="text-red-500 hover:bg-red-50 p-1 rounded"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[10px] text-muted-foreground">
                Product Name
              </Label>
              <Input
                value={product.name || ""}
                onChange={(e) => updateProduct(index, "name", e.target.value)}
                placeholder="Product Name"
                className="h-8 text-xs"
              />
            </div>

            <div>
              <Label className="text-[10px] text-muted-foreground">Price</Label>
              <Input
                value={product.price || ""}
                onChange={(e) => updateProduct(index, "price", e.target.value)}
                placeholder="99.99"
                className="h-8 text-xs"
                type="number"
                step="0.01"
              />
            </div>

            <div>
              <Label className="text-[10px] text-muted-foreground">
                Category
              </Label>
              <Input
                value={product.category || ""}
                onChange={(e) =>
                  updateProduct(index, "category", e.target.value)
                }
                placeholder="Electronics"
                className="h-8 text-xs"
              />
            </div>

            <div>
              <Label className="text-[10px] text-muted-foreground">
                Seller (Optional)
              </Label>
              <Input
                value={product.seller || ""}
                onChange={(e) => updateProduct(index, "seller", e.target.value)}
                placeholder="Seller Name"
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div>
            <Label className="text-[10px] text-muted-foreground">
              Description
            </Label>
            <Textarea
              value={product.description || ""}
              onChange={(e) =>
                updateProduct(index, "description", e.target.value)
              }
              placeholder="Product description..."
              className="text-xs min-h-[50px]"
              rows={2}
            />
          </div>

          <div>
            <ImageUploadWithCrop
              currentImage={product.image}
              onImageUpdate={(imageUrl) => updateProduct(index, "image", imageUrl)}
              label="Product Image"
              recommendedWidth={600}
              recommendedHeight={400}
              aspectRatio={3 / 2}
              maxFileSize={5}
              showDimensions={true}
            />
          </div>

          <div>
            <Label className="text-[10px] text-muted-foreground">Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => updateProduct(index, "rating", star)}
                  className={cn(
                    "text-2xl transition-colors",
                    star <= (product.rating || 0)
                      ? "text-yellow-500"
                      : "text-gray-300"
                  )}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}

      {(content.products || []).length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-4">
          No products yet. Click "Add Product" to create one.
        </p>
      )}
    </div>
  );
};

export default MarketplaceSettings;
