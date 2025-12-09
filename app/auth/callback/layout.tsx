import { Suspense } from "react";

function RootLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={"loading"}>{children}</Suspense>;
}

export default RootLayout;
