import Cookies from 'js-cookie';
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';

interface AuthContextProps {
  children: ReactNode;
}

interface AuthState {
  token: string | null;
  loading: boolean;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
  const fetchAuthTokenFromServer = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return Cookies.get('authToken') || null;
  };
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const authenticate = async () => {
      try {
        const authToken = await fetchAuthTokenFromServer();
        setToken(authToken || null);
      } catch (_error) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    authenticate();
  }, []);
  return (
    <AuthContext.Provider value={{ token, setToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
