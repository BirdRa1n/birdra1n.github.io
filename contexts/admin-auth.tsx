// contexts/admin-auth.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User } from "@supabase/supabase-js";

import supabase from "@/utils/supabase/client";
import { Administrator } from "@/utils/supabase/typed-client";

interface AdminAuthContextType {
  user: User | null;
  admin: Administrator | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Administrator | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAdminRecord = async (userId: string): Promise<Administrator | null> => {
    try {
      const { data, error } = await supabase
        .schema("admin" as any)
        .from("administrators")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("[AdminAuth] fetchAdminRecord error:", error.message);
        return null;
      }

      return data as Administrator | null;
    } catch (err) {
      console.error("[AdminAuth] fetchAdminRecord exception:", err);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("[AdminAuth] getSession error:", sessionError.message);
        }

        if (mounted && session?.user) {
          setUser(session.user);
          const adminRecord = await fetchAdminRecord(session.user.id);
          if (mounted) setAdmin(adminRecord);
        }
      } catch (err) {
        console.error("[AdminAuth] init exception:", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        try {
          if (session?.user) {
            setUser(session.user);
            const adminRecord = await fetchAdminRecord(session.user.id);
            if (mounted) setAdmin(adminRecord);
          } else {
            setUser(null);
            setAdmin(null);
          }
        } catch (err) {
          console.error("[AdminAuth] onAuthStateChange exception:", err);
          if (mounted) {
            setUser(null);
            setAdmin(null);
          }
        } finally {
          // Garante que isLoading resolve mesmo em eventos do listener
          if (mounted) setIsLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) return { error: error.message };

      if (data.user) {
        const adminRecord = await fetchAdminRecord(data.user.id);

        if (!adminRecord) {
          await supabase.auth.signOut();
          return { error: "Acesso não autorizado. Você não é um administrador." };
        }
      }

      return { error: null };
    } catch (err: any) {
      console.error("[AdminAuth] signIn exception:", err);
      return { error: err?.message || "Erro inesperado ao fazer login." };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("[AdminAuth] signOut exception:", err);
    } finally {
      setUser(null);
      setAdmin(null);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{ user, admin, isAdmin: !!admin, isLoading, signIn, signOut }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);

  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");

  return ctx;
}