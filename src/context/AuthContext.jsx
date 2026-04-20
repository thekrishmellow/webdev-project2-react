import React, { useEffect, useState } from 'react';
import { AuthContext } from './auth-context';
import { isSupabaseConfigured, supabase } from '../supabase';

const LOCAL_USER_KEY = 'student-finance-user';

const buildLocalUser = (email, name = 'Guest Student') => ({
  id: 'local-student-user',
  email,
  app_metadata: { provider: 'local-demo' },
  user_metadata: { name },
  name,
});

const getStoredLocalUser = () => {
  const savedUser = localStorage.getItem(LOCAL_USER_KEY);
  return savedUser ? JSON.parse(savedUser) : null;
};

const ensureGuestUser = () => {
  const existingUser = getStoredLocalUser();
  if (existingUser) return existingUser;

  const guestUser = buildLocalUser('guest@gmail.com', 'Guest Student');
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(guestUser));
  return guestUser;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (!isSupabaseConfigured) {
      return ensureGuestUser();
    }

    return null;
  });
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [isDemoMode, setIsDemoMode] = useState(!isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      return undefined;
    }

    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        setIsDemoMode(false);
      } else {
        setUser(null);
        setIsDemoMode(false);
      }

      setLoading(false);
    };

    getSession().catch(() => {
      setUser(null);
      setIsDemoMode(false);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setIsDemoMode(false);
      } else {
        setUser(null);
        setIsDemoMode(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async ({ email, password, name }) => {
    if (isSupabaseConfigured && supabase) {
      const response = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      if (!response.error && response.data?.user) {
        localStorage.removeItem(LOCAL_USER_KEY);
        setIsDemoMode(false);
      }
      return response;
    }

    const localUser = buildLocalUser(email, name);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUser));
    setUser(localUser);
    setIsDemoMode(true);
    return { data: { user: localUser }, error: null };
  };

  const signIn = async ({ email, password, name }) => {
    if (isSupabaseConfigured && supabase) {
      const response = await supabase.auth.signInWithPassword({ email, password });
      if (!response.error && response.data?.user) {
        localStorage.removeItem(LOCAL_USER_KEY);
        setIsDemoMode(false);
      }
      return response;
    }

    const localUser = buildLocalUser(email, name);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(localUser));
    setUser(localUser);
    setIsDemoMode(true);
    return { data: { user: localUser }, error: null };
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      const response = await supabase.auth.signOut();
      setUser(null);
      setIsDemoMode(false);
      return response;
    }

    const guestUser = ensureGuestUser();
    setUser(guestUser);
    setIsDemoMode(true);
    return { error: null };
  };

  const value = {
    signUp,
    signIn,
    signOut,
    user,
    loading,
    isDemoMode,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
