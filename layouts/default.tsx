import { Link } from "@heroui/link";
import { Head } from "./head";
import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col min-h-screen">
      <Head />
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
      <footer className="w-full border-t border-default-200 mt-16">
        <div className="container mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link
              isExternal
              className="flex items-center gap-2 text-default-600 hover:text-success transition-colors"
              href="https://birdra1n.github.io"
              title="github homepage"
            >
              <span>Powered by</span>
              <span className="font-bold bg-gradient-to-r from-[#6FEE8D] to-[#17c964] bg-clip-text text-transparent">
                BirdRa1n
              </span>
            </Link>
            <p className="text-sm text-default-500">
              © {new Date().getFullYear()} Dário Jr. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
