import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string;
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
  const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  const userId = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
  const userName = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];

  localStorage.setItem('token', newToken);
  localStorage.setItem('userRole', role);
  localStorage.setItem('userId', userId);
  localStorage.setItem('userName', userName);

  setToken(newToken);
  setUserRole(role);
  setUserId(parseInt(userId));
  setUserName(userName);
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