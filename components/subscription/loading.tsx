import { Loader2 } from "lucide-react";

export default function PaymentLoading() {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-white/95 backdrop-blur-sm">
      <div className="flex flex-col items-center p-8 text-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <div>
          <h2 className="text-2xl font-semibold text-foreground mt-6 mb-2">
            Verify Your Payment
          </h2>
          <p className="text-lg text-muted-foreground m-0">Please wait...</p>
        </div>
      </div>
    </div>
  );
}
