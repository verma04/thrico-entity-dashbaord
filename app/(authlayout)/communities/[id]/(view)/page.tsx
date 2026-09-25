"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CommunityIndexPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  useEffect(() => {
    if (id) {
      router.replace(`/communities/${id}/about`);
    }
  }, [id, router]);

  return null;
}
