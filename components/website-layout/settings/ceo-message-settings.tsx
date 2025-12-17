import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";

interface Message {
  name?: string;
  designation?: string;
  message?: string;
  image?: string;
  signature?: string;
}

interface CeoMessageSettingsProps {
  content: {
    messages?: Message[];
    [key: string]: any;
  };
  onChange: (updates: any) => void;
}

const CeoMessageSettings: React.FC<CeoMessageSettingsProps> = ({
  content,
  onChange,
}) => {
  const updateMessages = (messages: Message[]) => {
    onChange({ messages });
  };

  const addMessage = () => {
    const messages = [...(content.messages || [])];
    messages.push({
      name: "",
      designation: "",
      message: "",
      image: "",
      signature: "",
    });
    updateMessages(messages);
  };

  const removeMessage = (index: number) => {
    const messages = [...(content.messages || [])];
    messages.splice(index, 1);
    updateMessages(messages);
  };

  const updateMessage = (index: number, field: string, value: string) => {
    const messages = [...(content.messages || [])];
    messages[index] = {
      ...messages[index],
      [field]: value,
    };
    updateMessages(messages);
  };

  return (
    <div className="space-y-3 border rounded-lg p-3 bg-muted/10">
      <div className="flex justify-between items-center">
        <Label className="text-xs uppercase font-bold text-muted-foreground">
          Messages
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addMessage}
          className="h-7 text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Message
        </Button>
      </div>

      {(content.messages || []).map((message: Message, index: number) => (
        <div key={index} className="space-y-2 p-3 bg-background rounded border">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold">Message {index + 1}</span>
            <button
              onClick={() => removeMessage(index)}
              className="text-red-500 hover:bg-red-50 p-1 rounded"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-2">
            <div>
              <Label className="text-[10px] text-muted-foreground">Name</Label>
              <Input
                value={message.name || ""}
                onChange={(e) => updateMessage(index, "name", e.target.value)}
                placeholder="CEO Name"
                className="h-8 text-xs"
              />
            </div>

            <div>
              <Label className="text-[10px] text-muted-foreground">
                Designation
              </Label>
              <Input
                value={message.designation || ""}
                onChange={(e) =>
                  updateMessage(index, "designation", e.target.value)
                }
                placeholder="Chief Executive Officer"
                className="h-8 text-xs"
              />
            </div>

            <div>
              <Label className="text-[10px] text-muted-foreground">
                Message
              </Label>
              <Textarea
                value={message.message || ""}
                onChange={(e) =>
                  updateMessage(index, "message", e.target.value)
                }
                placeholder="Enter message content..."
                className="text-xs min-h-[80px]"
                rows={4}
              />
            </div>

            <div>
              <ImageUploadWithCrop
                label="CEO Image"
                currentImage={message.image}
                onImageUpdate={(url) => updateMessage(index, "image", url)}
                recommendedWidth={400}
                recommendedHeight={400}
                aspectRatio={1}
                maxFileSize={5}
                showDimensions={true}
              />
            </div>

            <div>
              <ImageUploadWithCrop
                label="Signature (Optional)"
                currentImage={message.signature}
                onImageUpdate={(url) => updateMessage(index, "signature", url)}
                recommendedWidth={600}
                recommendedHeight={200}
                aspectRatio={3}
                maxFileSize={2}
                showDimensions={true}
              />
            </div>
          </div>
        </div>
      ))}

      {(content.messages || []).length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-4">
          No messages yet. Click "Add Message" to create one.
        </p>
      )}
    </div>
  );
};

export default CeoMessageSettings;
