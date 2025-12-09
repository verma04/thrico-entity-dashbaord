import React from "react";
import { useKycFormStore } from "@/store/kycStore";
import {
  Smartphone,
  Users,
  TrendingUp,
  Calendar,
  Settings,
} from "lucide-react";

const MobileAppPreview = () => {
  const organization = useKycFormStore((state) => state.organization);
  const logoPreview = useKycFormStore((state) => state.logoPreview);
  const domain = useKycFormStore((state) => state.domain);

  return (
    <div className="relative flex h-full w-full items-center justify-center p-8">
      <div className="relative">
        {/* Phone Frame */}
        <div className="relative w-[320px] h-[640px] bg-black rounded-[3rem] p-2 shadow-2xl">
          {/* Dynamic Island */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-8 bg-black rounded-full z-10"></div>

          {/* Screen */}
          <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-[2.5rem] overflow-hidden flex flex-col">
            {/* Status Bar */}
            <div className="h-14 flex items-center justify-between px-6 pt-4">
              <span className="text-xs font-semibold text-gray-800">9:41</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-3 bg-gray-800 rounded-full"></div>
                <div className="w-1 h-3 bg-gray-800 rounded-full"></div>
                <div className="w-1 h-3 bg-gray-400 rounded-full"></div>
                <div className="w-4 h-3 bg-gray-800 rounded-sm"></div>
              </div>
            </div>

            {/* App Header */}
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Smartphone className="w-7 h-7 text-white" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">
                      {organization?.name || "Your Community"}
                    </h1>
                    <p className="text-xs text-gray-500">
                      {domain
                        ? `${domain}.thrico.network`
                        : "your-community.thrico.network"}
                    </p>
                  </div>
                </div>
                <Settings className="w-5 h-5 text-gray-600" />
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">2.4K</p>
                  <p className="text-xs text-gray-500">Members</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                  <p className="text-xs text-gray-500">Events</p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white rounded-t-3xl px-6 py-5 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-900">
                  Recent Activity
                </h2>
                <button className="text-xs text-blue-500 font-medium">
                  View All
                </button>
              </div>

              {/* Activity List */}
              <div className="space-y-3">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="h-2.5 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                    </div>
                    <div className="text-[10px] text-gray-400 shrink-0">
                      2h
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Tab Bar */}
            <div className="h-16 bg-white border-t border-gray-200 flex items-center justify-around px-8">
              <div className="flex flex-col items-center gap-1">
                <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-sm"></div>
                </div>
                <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
              </div>
              {[1, 2, 3].map((tab) => (
                <div key={tab} className="flex flex-col items-center gap-1">
                  <div className="w-6 h-6 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAppPreview;
