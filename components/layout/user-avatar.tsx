import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps {
  src?: string;
  size?: number;
  style?: React.CSSProperties;
  onPress?: () => void;
  className?: string;
}

import { cn } from "@/lib/utils";

const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  size = 20,
  style,
  onPress,
  className,
}) => {
  const avatarSrc = src ? `${process.env.NEXT_PUBLIC_CDN_URL}/${src}` : undefined;

  return (
    <Avatar
      className={cn(className)}
      style={{
        ...style,
        cursor: onPress ? "pointer" : "default",
        width: size,
        height: size,
      }}
      onClick={onPress}
    >
      <AvatarImage src={avatarSrc} alt="User avatar" />
      <AvatarFallback>
        <span className="text-xs">U</span>
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
