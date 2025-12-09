import React from "react";

import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { useCheckEntitySubscription } from "@/graphql/actions";
import {
  useUpdateToYearly,
  useVerifyRazorpayPayment,
} from "@/graphql/actions/plan";
import PaymentLoading from "./loading";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

function getYearlySavings(
  monthlyPrice?: number,
  yearlyPrice?: number,
  currency?: string
): string {
  if (
    typeof monthlyPrice !== "number" ||
    typeof yearlyPrice !== "number" ||
    !currency
  ) {
    return "";
  }
  const totalMonthly = monthlyPrice * 12;
  const savings = totalMonthly - yearlyPrice;
  if (savings <= 0) return "0";
  return `${currency} ${savings.toLocaleString()}`;
}

interface PlanOverview {
  package?: {
    monthlyPrice?: number;
    yearlyPrice?: number;
    currency?: string;
    packageId?: string;
  };
}

const YearlyUpgrade = ({ planOverview }: { planOverview: PlanOverview }) => {
  const { refetch, loading: statusLoader } = useCheckEntitySubscription();
  const [verify, { loading: verificationLoader }] = useVerifyRazorpayPayment({
    onCompleted: (data: { verifyRazorpayPayment: boolean }) => {
      if (data?.verifyRazorpayPayment) {
        refetch();
      } else {
        alert("Payment verification failed. Please try again.");
      }
    },
  });

  interface RazorpayData {
    id: string;
    entity: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
    created_at: number;
  }

  const { Razorpay } = useRazorpay();
  const [upgrade, { loading: joinLoading }] = useUpdateToYearly({
    onCompleted: (data: { updateToYearly: RazorpayData }) => {
      if (data?.updateToYearly) {
        const options: RazorpayOrderOptions = {
          key: "rzp_test_AVIthfNy85rAR2",
          amount: data?.updateToYearly.amount,
          currency: data?.updateToYearly
            .currency as RazorpayOrderOptions["currency"],
          name: "Test Company",
          description: "Test Transaction",
          order_id: data?.updateToYearly.id,
          handler: (response) => {
            if (!response.razorpay_payment_id) {
              alert("Payment failed. Please try again.");
              return;
            } else {
              verify({
                variables: {
                  input: {
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpaySignature: response.razorpay_signature,
                  },
                },
              });
            }
          },
          prefill: {
            name: "John Doe",
            email: "john.doe@example.com",
            contact: "9999999999",
          },
          theme: {
            color: "#F37254",
          },
        };

        const razorpayInstance = new Razorpay(options);
        razorpayInstance.open();
      }
    },
  });

  return (
    <>
      {(verificationLoader || statusLoader) && <PaymentLoading />}
      <div className="flex flex-col gap-4">
        <Alert variant="default">
          <AlertDescription>
            Switch to yearly billing and save{" "}
            {getYearlySavings(
              planOverview.package?.monthlyPrice,
              planOverview.package?.yearlyPrice,
              planOverview?.package?.currency
            )}{" "}
            on your subscription.
          </AlertDescription>
        </Alert>
        <Button
          onClick={() => {
            upgrade({
              variables: {
                input: {
                  packageId: planOverview?.package?.packageId,
                },
              },
            });
          }}
          disabled={joinLoading}
        >
          {joinLoading ? "Processing..." : "Switch to Yearly Billing"}
        </Button>
      </div>
    </>
  );
};

export default YearlyUpgrade;
