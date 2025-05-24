import { Building } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="border-b px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Building className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">
            Not a Candy Shop
          </h1>
        </div>
      </header>
      <main className="flex-1 flex overflow-hidden">{children}</main>
      {/* <footer className="border-t px-4 py-2 text-xs text-muted-foreground shrink-0">
        <div className="flex justify-between">
          <p>© 2025 Not a Candy Shop</p>
          <p>Verzia 1.0.0</p>
        </div>
      </footer> */}
    </div>
  );
}
