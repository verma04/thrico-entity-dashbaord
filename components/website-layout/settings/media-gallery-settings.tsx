import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical, Trash2, Plus } from "lucide-react";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";

interface MediaGallerySettingsProps {
  content: {
    images?: Array<{
      src: string;
      alt: string;
      caption?: string;
    }>;
    title?: string;
    description?: string;
  };
  onChange: (updates: any) => void;
}

const MediaGallerySettings: React.FC<MediaGallerySettingsProps> = ({
  content,
  onChange,
}) => {
  const [openPopover, setOpenPopover] = useState<number | null>(null);

  const {
    images = [
      {
        src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        alt: "Gallery Image 1",
        caption: "Beautiful landscape",
      },
      {
        src: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=600&fit=crop",
        alt: "Gallery Image 2",
        caption: "City architecture",
      },
      {
        src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
        alt: "Gallery Image 3",
        caption: "Nature photography",
      },
      {
        src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
        alt: "Gallery Image 4",
        caption: "Urban design",
      },
      {
        src: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=800&h=600&fit=crop",
        alt: "Gallery Image 5",
        caption: "Modern art",
      },
      {
        src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop",
        alt: "Gallery Image 6",
        caption: "Street photography",
      },
    ],
    title = "Our Gallery",
    description = "Explore our collection of featured images",
  } = content;

  const addImage = () => {
    const newImages = [
      ...images,
      {
        src: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop",
        alt: "New Image",
        caption: "Image caption",
      },
    ];
    onChange({ images: newImages });
  };

  const updateImage = (index: number, updates: Partial<(typeof images)[0]>) => {
    const newImages = images.map((image, i) =>
      i === index ? { ...image, ...updates } : image
    );
    onChange({ images: newImages });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange({ images: newImages });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const newImages = Array.from(images);
    const [reorderedImage] = newImages.splice(result.source.index, 1);
    newImages.splice(result.destination.index, 0, reorderedImage);

    onChange({ images: newImages });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Section Title</Label>
          <Input
            value={title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Our Gallery"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Section Description</Label>
          <Textarea
            value={description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Explore our collection of featured images"
            rows={2}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <Label className="text-sm font-medium">Gallery Images</Label>
          <Button
            onClick={addImage}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Image
          </Button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="gallery-images">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {images.map((image, index) => (
                  <Draggable
                    key={`image-${index}`}
                    draggableId={`image-${index}`}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`p-4 border rounded-lg space-y-3 bg-white ${
                          snapshot.isDragging ? "shadow-lg" : ""
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab hover:cursor-grabbing"
                            >
                              <GripVertical className="h-4 w-4 text-gray-400" />
                            </div>
                            <span className="text-sm font-medium">
                              Image #{index + 1}
                            </span>
                          </div>
                          <Popover
                            open={openPopover === index}
                            onOpenChange={(open) =>
                              setOpenPopover(open ? index : null)
                            }
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64" align="end">
                              <div className="space-y-3">
                                <div>
                                  <h4 className="font-medium text-sm">
                                    Delete Image
                                  </h4>
                                  <p className="text-xs text-muted-foreground">
                                    Are you sure you want to delete this image?
                                    This action cannot be undone.
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setOpenPopover(null)}
                                    className="flex-1"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => {
                                      removeImage(index);
                                      setOpenPopover(null);
                                    }}
                                    className="flex-1"
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          {/* Image Upload Component */}
                          <ImageUploadWithCrop
                            currentImage={image.src}
                            onImageUpdate={(url) =>
                              updateImage(index, { src: url })
                            }
                            label="Gallery Image"
                            recommendedWidth={800}
                            recommendedHeight={600}
                            aspectRatio={4 / 3}
                            maxFileSize={5}
                            showDimensions={true}
                            className="mb-2"
                          />

                          <div>
                            <Label className="text-xs text-gray-600">
                              Alt Text
                            </Label>
                            <Input
                              value={image.alt}
                              onChange={(e) =>
                                updateImage(index, { alt: e.target.value })
                              }
                              placeholder="Image description for accessibility"
                            />
                          </div>

                          <div>
                            <Label className="text-xs text-gray-600">
                              Caption (Optional)
                            </Label>
                            <Input
                              value={image.caption || ""}
                              onChange={(e) =>
                                updateImage(index, { caption: e.target.value })
                              }
                              placeholder="Image caption"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default MediaGallerySettings;
