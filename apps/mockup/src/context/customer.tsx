"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CustomerProfile = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

const INITIAL_PROFILE: CustomerProfile = {
  name: "Fabio Nascimento",
  email: "fabio.nascimento@example.com",
  phone: "(51) 99999-1234",
  address: "Rua das Flores, 123 — Centro",
};

type CustomerContextValue = {
  profile: CustomerProfile;
  updateProfile: (profile: CustomerProfile) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
};

const CustomerContext = createContext<CustomerContextValue | null>(null);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<CustomerProfile>(INITIAL_PROFILE);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const updateProfile = useCallback((next: CustomerProfile) => {
    setProfile(next);
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((favorite) => favorite !== id)
        : [...current, id],
    );
  }, []);

  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  const value = useMemo(
    () => ({
      profile,
      updateProfile,
      favorites,
      toggleFavorite,
      isLoggedIn,
      login,
      logout,
    }),
    [profile, favorites, toggleFavorite, updateProfile, isLoggedIn, login, logout],
  );

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer(): CustomerContextValue {
  const customer = useContext(CustomerContext);

  if (!customer) {
    throw new Error("useCustomer deve ser usado dentro de CustomerProvider");
  }

  return customer;
}
