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

  const fetchAdminRecord = async (userId: string) => {
    const { data } = await supabase
      .schema("admin" as any)
      .from("administrators")
      .select("*")
      .eq("user_id", userId)
      .single();
    return data as Administrator | null;
  };

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const adminRecord = await fetchAdminRecord(session.user.id);
        setAdmin(adminRecord);
      }
      setIsLoading(false);
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          const adminRecord = await fetchAdminRecord(session.user.id);
          setAdmin(adminRecord);
        } else {
          setUser(null);
          setAdmin(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
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
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAdmin(null);
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
