import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          monis<span className="text-primary">.rent</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
