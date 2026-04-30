import { Suspense } from "react";

export default function HeroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<div />}>{children}</Suspense>;
}
