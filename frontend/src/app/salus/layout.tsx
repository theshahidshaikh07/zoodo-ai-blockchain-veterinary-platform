import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Salus",
};

export default function SalusLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
