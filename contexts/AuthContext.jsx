import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem('@auth_user');
        if (json) setUser(JSON.parse(json));
      } catch (e) {
        console.warn('Failed to load user', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (username, password) => {
    const usersJson = await AsyncStorage.getItem('@users');
    const users = usersJson ? JSON.parse(usersJson) : [];
    const found = users.find(u => u.username === username && u.password === password);
    if (!found) throw new Error('Usuário ou senha inválidos');

    const userData = { username: found.username };
    setUser(userData);
    await AsyncStorage.setItem('@auth_user', JSON.stringify(userData));

    router.replace('/agenda');
  };

  const register = async (username, password) => {
    const usersJson = await AsyncStorage.getItem('@users');
    const users = usersJson ? JSON.parse(usersJson) : [];
    if (users.find(u => u.username === username)) throw new Error('Usuário já existe');

    users.push({ username, password });
    await AsyncStorage.setItem('@users', JSON.stringify(users));

    const userData = { username };
    setUser(userData);
    await AsyncStorage.setItem('@auth_user', JSON.stringify(userData));

    router.replace('/agenda');
  };

  const logout = async () => {
    await AsyncStorage.removeItem('@auth_user');
    setUser(null);
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
