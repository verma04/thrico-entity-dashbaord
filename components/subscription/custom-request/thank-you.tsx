import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"

export default function ThankYou() {
  return (
    <Card className="p-8 bg-gradient-to-br from-green-50 to-green-50 border-green-200">
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-green-900 mb-2">Thank You!</h1>
        <p className="text-lg text-green-700 max-w-2xl mx-auto">
          We've received your request for a custom enterprise plan. Our sales team will review your requirements and
          contact you within 24 hours.
        </p>
      </div>

      <Card className="bg-card mb-8 p-6">
        <h3 className="text-xl font-bold mb-4">What happens next:</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold">•</span>
            <span>Our enterprise specialist will review your requirements</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold">•</span>
            <span>We'll prepare a custom proposal tailored to your needs</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold">•</span>
            <span>Schedule a demo and technical discussion</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold">•</span>
            <span>Provide detailed pricing and implementation timeline</span>
          </li>
        </ul>
      </Card>

      <Alert className="bg-blue-50 border-blue-200">
        <AlertDescription className="text-blue-900">
          <span className="font-bold">Need help?</span> Our sales team is available to assist you. Call us at +1 (555)
          123-4567 or email enterprise@thrico.com
        </AlertDescription>
      </Alert>
    </Card>
  )
}
