"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { clientKey, seedClients, type Client } from "@/data/clients";

type ClientPatch = {
  id: string;
  patch: { email: string; phone: string; address: string };
};

type ClientsContextValue = {
  clients: Client[];
  /** Cadastra um cliente novo (tela de clientes). */
  addClient: (client: Omit<Client, "id">) => void;
  /** Conciliação da integração: cria novos e patch de existentes. */
  applyClientes: (
    incoming: Client[],
    updates?: ClientPatch[],
  ) => { created: number; updated: number };
};

const ClientsContext = createContext<ClientsContextValue | null>(null);

export function ClientsProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(seedClients);

  const addClient = useCallback((client: Omit<Client, "id">) => {
    setClients((prev) => [...prev, { ...client, id: clientKey(client.name) }]);
  }, []);

  const applyClientes = useCallback(
    (incoming: Client[], updates: ClientPatch[] = []) => {
      let created = 0;
      let updated = 0;

      setClients((prev) => {
        const next = [...prev];

        for (const candidate of incoming) {
          const index = next.findIndex(
            (client) =>
              clientKey(client.name) === clientKey(candidate.name) ||
              candidate.email !== "" && client.email === candidate.email,
          );

          if (index === -1) {
            next.push({ ...candidate, id: clientKey(candidate.name) });
            created += 1;
          } else {
            next[index] = {
              ...next[index],
              phone: candidate.phone !== "" ? candidate.phone : next[index].phone,
              email: candidate.email !== "" ? candidate.email : next[index].email,
              address:
                candidate.address !== "" ? candidate.address : next[index].address,
            };
            updated += 1;
          }
        }

        /* Patches da conciliação (linhas que atualizam cadastro). */
        for (const { id, patch } of updates) {
          const index = next.findIndex((client) => client.id === id);

          if (index === -1) continue;

          next[index] = {
            ...next[index],
            phone: patch.phone !== "" ? patch.phone : next[index].phone,
            email: patch.email !== "" ? patch.email : next[index].email,
            address:
              patch.address !== "" ? patch.address : next[index].address,
          };
          updated += 1;
        }

        return next;
      });

      return { created, updated };
    },
    [],
  );

  const value = useMemo<ClientsContextValue>(
    () => ({ clients, addClient, applyClientes }),
    [clients, addClient, applyClientes],
  );

  return (
    <ClientsContext.Provider value={value}>
      {children}
    </ClientsContext.Provider>
  );
}

export function useClients() {
  const context = useContext(ClientsContext);

  if (context === null) {
    throw new Error("useClients deve ser usado dentro de ClientsProvider");
  }

  return context;
}
