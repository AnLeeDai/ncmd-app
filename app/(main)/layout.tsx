import Header from "@/components/header";
import Navigate from "@/components/navigate";
import { ScrollShadow } from "@heroui/scroll-shadow";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative flex flex-col h-screen mx-auto max-w-7xl pb-4">
      <Header />

      <ScrollShadow hideScrollBar>
        <main className="flex-grow py-4 px-2">{children}</main>
      </ScrollShadow>

      <Navigate />
    </div>
  );
}
