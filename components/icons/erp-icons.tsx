import React from "react";

export const FedenaIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* Fedena stylized graduation cap & modern leaf emblem */}
    <path
      d="M12 3L2 8L12 13L22 8L12 3Z"
      fill="currentColor"
    />
    <path
      d="M5 10.5V16C5 18.209 8.134 20 12 20C15.866 20 19 18.209 19 16V10.5L12 14.5L5 10.5Z"
      fill="currentColor"
      fillOpacity="0.85"
    />
    <path
      d="M21 9V15.5C21 16.05 21.45 16.5 22 16.5C22.55 16.5 23 16.05 23 15.5V9H21Z"
      fill="currentColor"
    />
    <circle cx="22" cy="17.5" r="1.5" fill="currentColor" />
  </svg>
);

export const CampusCareIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* Entab CampusCare Shield & Book emblem */}
    <path
      d="M12 2L4 5.5V11.5C4 16.5 7.4 21.1 12 22.5C16.6 21.1 20 16.5 20 11.5V5.5L12 2Z"
      fill="currentColor"
      fillOpacity="0.2"
    />
    <path
      d="M12 2L4 5.5V11.5C4 16.5 7.4 21.1 12 22.5C16.6 21.1 20 16.5 20 11.5V5.5L12 2Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.5 11.5C8.5 9.5 10 8 12 8C14 8 15.5 9.5 15.5 11.5C15.5 13.5 14 15 12 15C10 15 8.5 13.5 8.5 11.5Z"
      fill="currentColor"
    />
    <path
      d="M8 17.5C9.2 16.8 10.5 16.5 12 16.5C13.5 16.5 14.8 16.8 16 17.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

export const MyClassCampusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* MyClassCampus dynamic connected nodes & institute emblem */}
    <rect x="3" y="3" width="8" height="8" rx="2" fill="currentColor" />
    <rect x="13" y="3" width="8" height="8" rx="2" fill="currentColor" fillOpacity="0.75" />
    <rect x="3" y="13" width="8" height="8" rx="2" fill="currentColor" fillOpacity="0.75" />
    <rect x="13" y="13" width="8" height="8" rx="2" fill="currentColor" />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
    <path
      d="M12 6V18M6 12H18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const MasterSoftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {/* MasterSoft ERP CCMS central cube & geometric M emblem */}
    <path
      d="M12 2L3 7V17L12 22L21 17V7L12 2Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M12 22V12"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M21 7L12 12L3 7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.5 9.5L12 12L16.5 9.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);
