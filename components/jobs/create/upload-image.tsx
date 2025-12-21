"use client";

import React, { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Trash2, GripVertical } from "lucide-react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PhotoUploadFile } from "../ts-types";
import { useToast } from "@/hooks/use-toast";

const MAX_IMAGES = 4;

function getBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

const SortableImage = ({
  file,
  onRemove,
}: {
  file: PhotoUploadFile;
  onRemove: (uid: string) => void;
}) => {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id: file.uid });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative inline-block mr-2 mb-2 w-24 h-24 border rounded overflow-hidden"
    >
      <img
        src={file.thumbUrl}
        alt={file.name}
        className="w-full h-full object-cover"
      />

      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 bg-white rounded-full p-1 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Delete button */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-1 right-1 h-7 w-7"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onRemove(file.uid)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

interface PhotoUploadProps {
  fileList: PhotoUploadFile[] | null;
  setFileList: Dispatch<SetStateAction<PhotoUploadFile[] | null>>;
}

const PhotoUpload = ({ fileList, setFileList }: PhotoUploadProps) => {
  const sensors = useSensors(useSensor(PointerSensor));
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if ((fileList?.length ?? 0) + files.length > MAX_IMAGES) {
      toast({
        title: "Too many images",
        description: `You can only upload up to ${MAX_IMAGES} images.`,
        variant: "destructive",
      });
      return;
    }

    const newFiles = await Promise.all(
      files.map(async (file) => {
        const preview = await getBase64(file);
        return {
          uid: `${Date.now()}-${Math.random()}`,
          name: file.name,
          thumbUrl: preview,
          originFileObj: file,
        } as PhotoUploadFile;
      })
    );

    setFileList((prev) => [...(prev || []), ...newFiles]);
  };

  const handleRemove = (uid: string) => {
    setFileList((prev) => (prev || []).filter((file) => file.uid !== uid));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const safeFileList = fileList ?? [];
      const oldIndex = safeFileList.findIndex((f) => f.uid === active.id);
      const newIndex = safeFileList.findIndex((f) => f.uid === over?.id);
      setFileList((prev) => arrayMove(prev || [], oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      {(fileList?.length ?? 0) < MAX_IMAGES && (
        <label className="inline-flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent transition-colors">
          <Plus className="h-6 w-6 mb-1 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Upload</span>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
        </label>
      )}

      {fileList && fileList.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={(fileList ?? []).map((file) => file.uid)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex flex-wrap">
              {fileList.map((file) => (
                <SortableImage
                  key={file.uid}
                  file={file}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default PhotoUpload;
