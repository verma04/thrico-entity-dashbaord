"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface link {
  to: string;
}
const Redirect = ({ to }: link) => {
  const { push } = useRouter();

  useEffect(() => {
    push(to);
  }, []);
  return <p></p>;
};

export { Redirect };
