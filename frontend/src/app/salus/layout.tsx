import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Salus",
};

export default function SalusLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="salus-theme min-h-screen bg-background text-foreground">
      {children}
    </div>
  );
}
