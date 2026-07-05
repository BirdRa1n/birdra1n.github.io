// contexts/admin-auth.tsx
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
  ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";

import supabase from "@/utils/supabase/client";
import type { Administrator } from "@/utils/supabase/typed-client";

interface AdminAuthContextType {
  user: User | null;
  admin: Administrator | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

async function fetchAdminRecord(userId: string): Promise<Administrator | null> {
  try {
    const { data, error } = await supabase
      .schema("admin")
      .from("administrators")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) return null;
    return data as Administrator;
  } catch {
    return null;
  }
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Administrator | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ref para evitar setState em componente desmontado
  const mountedRef = useRef(true);
  // Ref para evitar fetch duplo quando o listener dispara logo após getSession
  const initDoneRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!mountedRef.current) return;

        if (session?.user) {
          setUser(session.user);
          const adminRecord = await fetchAdminRecord(session.user.id);
          if (mountedRef.current) setAdmin(adminRecord);
        }
      } catch (err) {
        console.error("[AdminAuth] init error:", err);
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
          initDoneRef.current = true;
        }
      }
    };

    init();

    // O listener NÃO deve fazer fetch async pesado.
    // Ele só atualiza o user e dispara um fetch leve de admin.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mountedRef.current) return;

        // Ignora o INITIAL_SESSION — já tratado no init() acima
        if (event === "INITIAL_SESSION") return;

        if (session?.user) {
          setUser(session.user);

          // Só faz o fetch de admin se o user mudou de fato
          const adminRecord = await fetchAdminRecord(session.user.id);
          if (mountedRef.current) {
            setAdmin(adminRecord);
            setIsLoading(false);
          }
        } else {
          setUser(null);
          setAdmin(null);
          setIsLoading(false);
        }
      }
    );

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ error: string | null }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { error: error.message };

      if (data.user) {
        const adminRecord = await fetchAdminRecord(data.user.id);
        if (!adminRecord) {
          await supabase.auth.signOut();
          return { error: "Acesso não autorizado. Você não é um administrador." };
        }
        // Estado já será atualizado pelo onAuthStateChange
      }

      return { error: null };
    } catch (err: any) {
      return { error: err?.message || "Erro inesperado ao fazer login." };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      setUser(null);
      setAdmin(null);
    }
  };

  // Memoize o value para evitar re-renders desnecessários nos consumers
  const value = useMemo(
    () => ({ user, admin, isAdmin: !!admin, isLoading, signIn, signOut }),
    [user, admin, isLoading] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
