import React from "react";
import {
  FileText,
  Users,
  ShoppingCart,
  MessageSquare,
  Heart,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";

const StartCommunity = () => {
  return (
    <div
      className="absolute h-[1000px] w-[1000px] z-300"
      style={{ top: "74%", left: "10%" }}
    >
      <div className="relative flex h-full w-full items-center justify-center">
        {/* Center Icon */}

        {/* Outermost Circle - Slowest, largest icons with user avatars */}
        <OrbitingCircles radius={500} duration={40} iconSize={80}>
          <Avatar className="h-20 w-20 border-2 shadow-lg">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>U1</AvatarFallback>
          </Avatar>
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
            <FileText className="h-10 w-10 text-white" />
          </div>
          <Avatar className="h-20 w-20 border-2 shadow-lg">
            <AvatarImage src="https://i.pravatar.cc/150?img=1" />
            <AvatarFallback>U2</AvatarFallback>
          </Avatar>
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
            <Users className="h-10 w-10 text-white" />
          </div>
          <Avatar className="h-20 w-20 border-2 shadow-lg">
            <AvatarImage src="https://i.pravatar.cc/150?img=2" />
            <AvatarFallback>U3</AvatarFallback>
          </Avatar>
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
            <ShoppingCart className="h-10 w-10 text-white" />
          </div>
        </OrbitingCircles>

        {/* Second Circle - Medium-slow speed, reverse direction */}
        <OrbitingCircles radius={430} duration={35} reverse iconSize={70}>
          <div className="flex h-18 w-18 items-center justify-center rounded-full border-2 bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
            <TrendingUp className="h-9 w-9 text-white" />
          </div>
          <Avatar className="h-18 w-18 border-2 shadow-lg">
            <AvatarImage src="https://i.pravatar.cc/150?img=3" />
            <AvatarFallback>U4</AvatarFallback>
          </Avatar>
          <div className="flex h-18 w-18 items-center justify-center rounded-full border-2 bg-gradient-to-br from-pink-500 to-pink-600 shadow-lg">
            <Heart className="h-9 w-9 text-white" />
          </div>
          <Avatar className="h-18 w-18 border-2 shadow-lg">
            <AvatarImage src="https://i.pravatar.cc/150?img=4" />
            <AvatarFallback>U5</AvatarFallback>
          </Avatar>
          <div className="flex h-18 w-18 items-center justify-center rounded-full border-2 bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg">
            <Star className="h-9 w-9 text-white" />
          </div>
          <Avatar className="h-18 w-18 border-2 shadow-lg">
            <AvatarImage src="https://i.pravatar.cc/150?img=5" />
            <AvatarFallback>U6</AvatarFallback>
          </Avatar>
        </OrbitingCircles>

        {/* Third Circle - Medium speed */}
        <OrbitingCircles radius={360} duration={30} iconSize={60}>
          <Avatar className="h-16 w-16 border-2 shadow-lg">
            <AvatarImage src="https://i.pravatar.cc/150?img=6" />
            <AvatarFallback>U7</AvatarFallback>
          </Avatar>
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-lg">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <Avatar className="h-16 w-16 border-2 shadow-lg">
            <AvatarImage src="https://i.pravatar.cc/150?img=7" />
            <AvatarFallback>U8</AvatarFallback>
          </Avatar>
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <Avatar className="h-16 w-16 border-2 shadow-lg">
            <AvatarImage src="https://i.pravatar.cc/150?img=8" />
            <AvatarFallback>U9</AvatarFallback>
          </Avatar>
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
            <FileText className="h-8 w-8 text-white" />
          </div>
        </OrbitingCircles>

        {/* Fourth Circle - Faster, reverse */}
        <OrbitingCircles radius={290} duration={25} reverse iconSize={50}>
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg">
            <Users className="h-7 w-7 text-white" />
          </div>
          <Avatar className="h-14 w-14 border-2 shadow-lg">
            <AvatarImage src="https://i.pravatar.cc/150?img=9" />
            <AvatarFallback>U10</AvatarFallback>
          </Avatar>
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg">
            <ShoppingCart className="h-7 w-7 text-white" />
          </div>
          <Avatar className="h-14 w-14 border-2 shadow-lg">
            <AvatarImage src="https://i.pravatar.cc/150?img=10" />
            <AvatarFallback>U11</AvatarFallback>
          </Avatar>
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 bg-gradient-to-br from-rose-500 to-rose-600 shadow-lg">
            <Heart className="h-7 w-7 text-white" />
          </div>
          <Avatar className="h-14 w-14 border-2 shadow-lg">
            <AvatarImage src="https://i.pravatar.cc/150?img=11" />
            <AvatarFallback>U12</AvatarFallback>
          </Avatar>
        </OrbitingCircles>

        {/* Close inner circle */}
        <OrbitingCircles radius={150} duration={20} iconSize={50}>
          <Avatar className="h-14 w-14 border-2 shadow-lg">
            <AvatarImage src="https://i.pravatar.cc/150?img=23" />
            <AvatarFallback>U13</AvatarFallback>
          </Avatar>
          <Avatar className="h-14 w-14 border-2 shadow-lg">
            <AvatarImage src="https://i.pravatar.cc/150?img=30" />
            <AvatarFallback>U14</AvatarFallback>
          </Avatar>
        </OrbitingCircles>

        {/* Innermost circle - Fastest */}
        <OrbitingCircles radius={80} duration={15} reverse iconSize={50}>
          <Avatar className="h-20 w-20 border-2 shadow-lg">
            <AvatarImage src="https://i.pravatar.cc/150?img=50" />
            <AvatarFallback>U15</AvatarFallback>
          </Avatar>
        </OrbitingCircles>
      </div>
    </div>
  );
};

export default StartCommunity;
