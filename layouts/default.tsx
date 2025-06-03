import { Navbar } from "@/components/navbar";
import { Link } from "@heroui/link";
import { Head } from "./head";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Head />
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://birdra1n.github.io"
          title="github homepage"
        >
          <span className="text-default-600">Powered by</span>
          <p className={'font-bold text-inherit text-gradient from-[#6FEE8D] to-[#17c964]'}>{"BirdRa1n"}</p>
        </Link>
      </footer>
    </div>
  );
}
