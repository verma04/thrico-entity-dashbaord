import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps {
  src?: string;
  size?: number;
  style?: React.CSSProperties;
  onPress?: () => void;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  size = 20,
  style,
  onPress,
}) => {
  const avatarSrc = src ? `https://cdn.thrico.network/${src}` : undefined;

  return (
    <Avatar
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
