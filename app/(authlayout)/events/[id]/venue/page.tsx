"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function VenuePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  useEffect(() => {
    if (id) {
      router.replace(`/events/${id}/venue/physical`);
    }
  }, [id, router]);

  return null;
}
