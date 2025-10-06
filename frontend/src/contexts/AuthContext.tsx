import axios from "axios";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginManual: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (token: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auto-fetch user from localStorage on reload
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    // If admin token
    if (token === "admin-token") {
      setUser({ id: "0", name: "Admin", email: "admin@gmail.com" });
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    // Fetch normal user
    axios
      .get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data.user);
        setIsAuthenticated(true);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const loginManual = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Hardcoded admin
      if (email === "admin@gmail.com" && password === "admin123") {
        localStorage.setItem("token", "admin-token");
        setUser({ id: "0", name: "Admin", email: "admin@gmail.com" });
        setIsAuthenticated(true);
        setError(null);
        return;
      }

      // Normal user
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      setError(null);
    } catch (err) {
      setError("Invalid email or password");
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (token: string) => {
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/google", {
        token,
      });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      setError(null);
    } catch {
      setError("Google login failed");
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      setIsAuthenticated(true);
      setError(null);
    } catch {
      setError("Registration failed");
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        isLoading,
        error,
        loginManual,
        loginWithGoogle,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
