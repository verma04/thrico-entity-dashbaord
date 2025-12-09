import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

export default function FormHeader() {
  return (
    <Card className="mb-8 bg-gradient-to-r from-purple-50 to-purple-50 border-purple-200">
      <div className="p-6 text-center">
        <div className="flex justify-center items-center gap-2 mb-2">
          <Star className="w-6 h-6 text-purple-600 fill-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Custom Enterprise Plan Request</h2>
        </div>
        <p className="text-gray-600 text-sm">
          Tell us about your needs and we'll create a tailored solution for your organization
        </p>
      </div>
    </Card>
  )
}
