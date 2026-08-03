import { useGetEntity } from "@/graphql/actions";
import React from "react";
import Image from "next/image";

const Logo = () => {
  const { data } = useGetEntity();
  const src = data?.getEntity?.logo
    ? `${process.env.NEXT_PUBLIC_CDN_URL}/${data.getEntity.logo}`
    : undefined;
  const name = data?.getEntity?.name || "Thrico";

  if (src) {
    return (
      <div className="relative w-[100px] h-[40px]">
        <Image
          alt={`Logo for ${name}`}
          src={src || "/placeholder.svg"}
          fill
          className="object-contain"
          priority
        />
      </div>
    );
  }

  return (
    <span className="text-2xl font-black text-foreground tracking-tighter">
      {name.toLowerCase()}
    </span>
  );
};

export default Logo;
