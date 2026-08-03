"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Upload, Loader2 } from "lucide-react"
import Image from "next/image"

interface CoverUploadProps {
  imageUrl?: string
  setImageUrl: (url: string) => void
  setCover: (file: File) => void
  buttonText?: string
}

const getBase64 = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.addEventListener("load", () => resolve(reader.result as string))
    reader.readAsDataURL(file)
  })
}

const CoverUpload: React.FC<CoverUploadProps> = ({ imageUrl, setImageUrl, setCover, buttonText = "Update Cover" }) => {
  const [loading, setLoading] = useState(false)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const isValidType = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/webp"

    if (!isValidType) {
      alert("You can only upload JPG/PNG/WEBP file!")
      return
    }

    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      alert("Image must be smaller than 2MB!")
      return
    }

    setLoading(true)
    try {
      setCover(file)
      const url = await getBase64(file)
      setImageUrl(url)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full mb-6">
      <div className="p-6">
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No custom cover image selected. The default image will be displayed until you upload a new one.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center w-full">
            <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
              {imageUrl ? (
                <Image src={imageUrl || "/placeholder.svg"} alt="cover" fill className="object-contain" />
              ) : (
                <Image
                  src={`${process.env.NEXT_PUBLIC_CDN_URL}/defaultEventCover.png`}
                  alt="default cover"
                  fill
                  className="object-contain"
                />
              )}
            </div>
          </div>

          <div className="relative">
            <input
              type="file"
              id="cover-upload"
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              disabled={loading}
            />
            <label htmlFor="cover-upload">
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <span role="button">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      {buttonText}
                    </>
                  )}
                </span>
              </Button>
            </label>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default CoverUpload
