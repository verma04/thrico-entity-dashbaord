"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { LogOut } from "lucide-react";

interface LogoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LogoutModal({ open, onOpenChange }: LogoutModalProps) {
  const router = useRouter();

  const handleLogout = () => {
    // Replace with your actual logout logic
    router.push("/logout");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex flex-col items-center gap-2">
            <LogOut className="mx-auto text-destructive" size={64} />
            <span>Oh no! You&apos;re leaving...</span>
          </DialogTitle>
        </DialogHeader>
        <div className="text-center text-muted-foreground mb-4">
          Are you sure you want to logout?
        </div>
        <DialogFooter className="flex justify-center gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
