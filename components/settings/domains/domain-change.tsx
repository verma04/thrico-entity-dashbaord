"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DomainChange() {
  const [isOpen, setIsOpen] = useState(false)
  const [domain, setDomain] = useState("")

  const handleSubmit = () => {
    console.log("Domain changed to:", domain)
    setIsOpen(false)
    setDomain("")
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        Change Domain
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change to a new domain</DialogTitle>
            <DialogDescription>
              You can only change this domain name once. Your original thrico.community domain will still be visible in
              your admin.
            </DialogDescription>
          </DialogHeader>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>There is no cost to make this change.</AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium text-muted-foreground">https://</div>
              <Input
                placeholder="mydomain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="flex-1"
              />
              <div className="text-sm font-medium text-muted-foreground">.thrico.community</div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!domain}>
              Update Domain
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
