import { ScrollShadow } from "@heroui/scroll-shadow";

import Header from "@/components/header";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative flex flex-col min-h-screen mx-auto max-w-7xl pb-4">
      <Header />

      <ScrollShadow hideScrollBar>
        <main className="flex-grow py-4 px-2">{children}</main>
      </ScrollShadow>
    </div>
  );
}
