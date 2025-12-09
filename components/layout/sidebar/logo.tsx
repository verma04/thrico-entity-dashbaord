import { useGetEntity } from "@/graphql/actions";
import React from "react";
import Image from "next/image";

const Logo = () => {
  const { data } = useGetEntity();
  const src = data?.getEntity?.logo
    ? `https://cdn.thrico.network/${data.getEntity.logo}`
    : undefined;
  const name = data?.getEntity?.name || "Thrico";

  if (src) {
    return (
      <div className="relative w-[60px] h-[30px]">
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

  return <span className="text-lg font-bold text-foreground">{name}</span>;
};

export default Logo;
