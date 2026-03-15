// layouts/admin.tsx
import { useEffect, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome, FiFolder, FiFileText, FiPackage, FiMail,
  FiAward, FiLogOut, FiMenu, FiX, FiUser, FiChevronRight,
  FiSmartphone, FiTag, FiAlertTriangle,
} from "react-icons/fi";

import { useAdminAuth } from "@/contexts/admin-auth";
import { ThemeSwitch } from "@/components/theme-switch";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: FiHome },
  { label: "Projetos", href: "/admin/projects", icon: FiFolder },
  { label: "Blog", href: "/admin/blog", icon: FiFileText },
  { label: "Certificados", href: "/admin/certificates", icon: FiAward },
  { label: "Apps", href: "/admin/apps", icon: FiSmartphone },
  { label: "Contato", href: "/admin/contact", icon: FiMail },
  { label: "Tags", href: "/admin/tags", icon: FiTag },
];

const Sidebar = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const router = useRouter();
  const { admin, signOut } = useAdminAuth();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-30 bg-black/60 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed top-0 left-0 h-full w-64 z-40 flex flex-col
          lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{
          background: "var(--bg-card)",
          borderRight: "1px solid var(--border)",
          transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
          <NextLink href="/admin" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-sm flex items-center justify-center text-xs font-bold"
              style={{ background: "var(--neon)", color: "#05080F", fontFamily: "var(--font-mono)", boxShadow: "0 0 16px var(--neon-glow)" }}
            >
              BR
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xs font-bold tracking-widest" style={{ fontFamily: "var(--font-mono)", color: "var(--neon)" }}>ADMIN</span>
              <span className="text-[9px] tracking-widest opacity-40" style={{ fontFamily: "var(--font-mono)" }}>PANEL</span>
            </div>
          </NextLink>
          <button className="lg:hidden opacity-50 hover:opacity-100" onClick={onClose}>
            <FiX size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive = router.pathname === href || (href !== "/admin" && router.pathname.startsWith(href));

            return (
              <NextLink
                key={href}
                href={href}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all group"
                style={{
                  fontFamily: "var(--font-mono)",
                  background: isActive ? "rgba(0,255,135,0.1)" : "transparent",
                  borderLeft: isActive ? "2px solid var(--neon)" : "2px solid transparent",
                  color: isActive ? "var(--neon)" : "inherit",
                  opacity: isActive ? 1 : 0.5,
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.opacity = "0.85"; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.opacity = "0.5"; }}
              >
                <Icon size={15} />
                <span className="tracking-wider text-xs">{label}</span>
                {isActive && <FiChevronRight size={12} className="ml-auto" />}
              </NextLink>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="p-4 space-y-3" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-7 h-7 rounded-sm flex items-center justify-center" style={{ background: "rgba(0,255,135,0.1)", border: "1px solid rgba(0,255,135,0.2)" }}>
              <FiUser size={13} style={{ color: "var(--neon)" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ fontFamily: "var(--font-mono)" }}>{admin?.name || admin?.email}</p>
              <p className="text-[10px] opacity-40 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>{admin?.role}</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-sm text-xs tracking-wider opacity-50 hover:opacity-100 transition-opacity"
            style={{ fontFamily: "var(--font-mono)", color: "#ff5555" }}
          >
            <FiLogOut size={13} />
            SIGN_OUT
          </button>
        </div>
      </motion.aside>
    </>
  );
};

// Loading screen com timeout de segurança
const LoadingScreen = ({ onTimeout }: { onTimeout: () => void }) => {
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimedOut(true);
      onTimeout();
    }, 8000); // 8 segundos de timeout

    return () => clearTimeout(timer);
  }, [onTimeout]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
      <div className="flex flex-col items-center gap-4 text-center px-4">
        {timedOut ? (
          <>
            <FiAlertTriangle size={28} style={{ color: "#FF9500" }} />
            <p className="text-sm opacity-60" style={{ fontFamily: "var(--font-mono)" }}>
              Tempo limite excedido.<br />Verifique sua conexão ou o Supabase.
            </p>
            <a
              href="/admin/login"
              className="text-xs px-4 py-2 rounded-sm mt-2"
              style={{ background: "rgba(0,255,135,0.1)", border: "1px solid var(--neon)", color: "var(--neon)", fontFamily: "var(--font-mono)" }}
            >
              TENTAR NOVAMENTE →
            </a>
          </>
        ) : (
          <>
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--neon)", borderTopColor: "transparent" }} />
            <span className="text-xs opacity-40 tracking-widest" style={{ fontFamily: "var(--font-mono)" }}>LOADING...</span>
          </>
        )}
      </div>
    </div>
  );
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, isLoading } = useAdminAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [forceRedirect, setForceRedirect] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAdmin && router.pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [isAdmin, isLoading, router]);

  // Callback do timeout do LoadingScreen
  const handleLoadingTimeout = () => {
    setForceRedirect(true);
    if (router.pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  };

  if (router.pathname === "/admin/login") return <>{children}</>;

  if (isLoading && !forceRedirect) {
    return <LoadingScreen onTimeout={handleLoadingTimeout} />;
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg-primary)" }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header
          className="sticky top-0 z-20 flex items-center justify-between px-6 py-4"
          style={{ background: "color-mix(in srgb, var(--bg-primary) 90%, transparent)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--border)" }}
        >
          <button className="lg:hidden opacity-50 hover:opacity-100" onClick={() => setSidebarOpen(true)}>
            <FiMenu size={20} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" className="text-[10px] tracking-widest opacity-30 hover:opacity-60 transition-opacity" style={{ fontFamily: "var(--font-mono)", color: "var(--neon)" }}>
              VIEW_SITE ↗
            </a>
            <ThemeSwitch />
          </div>
        </header>

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          <motion.div
            key={router.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}