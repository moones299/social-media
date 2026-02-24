import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

const STORAGE_KEY = "socially_user";

export type User = {
  id?: string;
  email: string;
  name?: string;
  token?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isInitializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
};

function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as User;
    return data && typeof data.email === "string" ? data : null;
  } catch {
    return null;
  }
}

function saveUser(user: User | null) {
  if (user && typeof user.email === "string") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch {
      // e.g. quota exceeded or private mode
    }
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  // On mount: restore from localStorage first, then optionally validate session.
  // If getSession() returns a user, use it. If it returns null, only clear when we have no stored user
  // (so refresh keeps login when backend doesn't return session / uses cookies differently).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { getSession } = await import("../api/auth");
        const sessionUser = await getSession();
        if (!cancelled) {
          if (sessionUser) {
            setUser(sessionUser);
            saveUser(sessionUser);
          } else {
            const stored = getStoredUser();
            if (!stored) {
              setUser(null);
              saveUser(null);
            }
            // else: keep current user from localStorage so refresh doesn't log out
          }
        }
      } catch {
        if (!cancelled) {
          // Network or server error: keep current user from localStorage
        }
      } finally {
        if (!cancelled) setIsInitializing(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const { login: apiLogin } = await import("../api/auth");
      const userData = await apiLogin(email, password);
      const toSave: User = userData?.email ? userData : { ...userData, email };
      setUser(toSave);
      saveUser(toSave);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Login failed";
      setError(message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      setError(null);
      setIsLoading(true);
      try {
        const { register: apiRegister } = await import("../api/auth");
        const userData = await apiRegister(name, email, password);
        const toSave: User = userData?.email ? userData : { ...userData, email };
        setUser(toSave);
        saveUser(toSave);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Registration failed";
        setError(message);
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      const { logout: apiLogout } = await import("../api/auth");
      await apiLogout();
    } catch {
      // still clear local state
    } finally {
      setUser(null);
      saveUser(null);
      setError(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isInitializing,
        login,
        register,
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
