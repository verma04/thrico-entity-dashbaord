import React from "react";
import { useKycFormStore } from "@/store/kycStore";
import { Smartphone, MessageCircle, Users, Bell, Home } from "lucide-react";
import { Iphone } from "@/components/ui/iphone";

const PhonePreview = () => {
  const organization = useKycFormStore((state) => state.organization);
  const logoPreview = useKycFormStore((state) => state.logoPreview);
  const domain = useKycFormStore((state) => state.domain);

  return (
    <div className="w-[full] flex items-center justify-center ">
      <div className="w-[250px] mt-20 flex justify-center align-middle">
        <Iphone src="https://cdn.thrico.network/mobile-preview.png"></Iphone>
      </div>
    </div>
  );
};

export default PhonePreview;
