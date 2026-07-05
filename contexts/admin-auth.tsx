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

  // Evita setState após desmontar
  const mountedRef = useRef(true);
  // Último user id para o qual já carregamos (ou estamos carregando) o admin.
  // Impede re-fetch a cada TOKEN_REFRESHED (que não muda o usuário).
  const loadedForUserRef = useRef<string | null>(null);

  useEffect(() => {
    mountedRef.current = true;

    /**
     * Carrega o registro de admin FORA do callback do onAuthStateChange.
     * Chamar métodos do supabase (que adquirem o lock interno do GoTrue)
     * de dentro do callback trava o client — todas as queries seguintes
     * ficam penduradas para sempre. Por isso o fetch roda sempre deferido.
     */
    const loadAdmin = async (userId: string) => {
      if (loadedForUserRef.current === userId) return;
      loadedForUserRef.current = userId;

      const record = await fetchAdminRecord(userId);

      // Ignora se o usuário mudou no meio do fetch ou o componente desmontou
      if (!mountedRef.current || loadedForUserRef.current !== userId) return;

      setAdmin(record);
      setIsLoading(false);
    };

    // Sessão inicial (fora de qualquer callback do GoTrue — seguro dar await)
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (!mountedRef.current) return;

        if (session?.user) {
          setUser(session.user);
          void loadAdmin(session.user.id);
        } else {
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("[AdminAuth] getSession error:", err);
        if (mountedRef.current) setIsLoading(false);
      });

    // IMPORTANTE: callback síncrono e sem await de supabase aqui dentro.
    // O fetch do admin é deferido com setTimeout para rodar fora do lock.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mountedRef.current) return;

        // INITIAL_SESSION já é tratado pelo getSession acima
        if (event === "INITIAL_SESSION") return;

        if (session?.user) {
          setUser(session.user);

          // Só recarrega o admin quando o usuário de fato muda.
          // TOKEN_REFRESHED / USER_UPDATED mantêm o admin atual.
          if (loadedForUserRef.current !== session.user.id) {
            setTimeout(() => {
              if (mountedRef.current) void loadAdmin(session.user!.id);
            }, 0);
          }
        } else {
          loadedForUserRef.current = null;
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
        // Marca antes para o onAuthStateChange não disparar um fetch duplicado
        loadedForUserRef.current = data.user.id;
        const adminRecord = await fetchAdminRecord(data.user.id);

        if (!adminRecord) {
          loadedForUserRef.current = null;
          await supabase.auth.signOut();

          return { error: "Acesso não autorizado. Você não é um administrador." };
        }

        if (mountedRef.current) {
          setUser(data.user);
          setAdmin(adminRecord);
          setIsLoading(false);
        }
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
      loadedForUserRef.current = null;
      setUser(null);
      setAdmin(null);
    }
  };

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
