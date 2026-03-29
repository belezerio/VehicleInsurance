import { createContext, useContext, useState, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  nameid: string;
  email: string;
  role: string;
  unique_name: string;
}

interface AuthContextType {
  token: string | null;
  userRole: string | null;
  userId: number | null;
  userName: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [userRole, setUserRole] = useState<string | null>(
    localStorage.getItem('userRole')
  );
  const [userId, setUserId] = useState<number | null>(
    localStorage.getItem('userId')
      ? parseInt(localStorage.getItem('userId')!)
      : null
  );
  const [userName, setUserName] = useState<string | null>(
    localStorage.getItem('userName')
  );

  const login = (newToken: string) => {
    const decoded = jwtDecode<JwtPayload>(newToken);
    localStorage.setItem('token', newToken);
    localStorage.setItem('userRole', decoded.role);
    localStorage.setItem('userId', decoded.nameid);
    localStorage.setItem('userName', decoded.unique_name);
    setToken(newToken);
    setUserRole(decoded.role);
    setUserId(parseInt(decoded.nameid));
    setUserName(decoded.unique_name);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUserRole(null);
    setUserId(null);
    setUserName(null);
  };

  return (
    <AuthContext.Provider value={{ token, userRole, userId, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};