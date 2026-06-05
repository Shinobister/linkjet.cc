"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { HistoryItem } from "@/types";

const STORAGE_KEY = "linkjet-history";

interface HistoryContextValue {
  items: HistoryItem[];
  addItem: (item: Omit<HistoryItem, "id" | "createdAt">) => void;
  removeItem: (id: string) => void;
  clearAll: () => void;
  hasSlug: (slug: string) => boolean;
}

const HistoryContext = createContext<HistoryContextValue | null>(null);

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<HistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore parse errors
    }
    return [];
  });

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage errors
    }
  }, [items]);

  const addItem = useCallback(
    (data: Omit<HistoryItem, "id" | "createdAt">) => {
      const newItem: HistoryItem = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };
      setItems((prev) => [newItem, ...prev]);
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
  }, []);

  const hasSlug = useCallback(
    (slug: string) => {
      return items.some((item) => item.slug === slug);
    },
    [items]
  );

  return (
    <HistoryContext.Provider value={{ items, addItem, removeItem, clearAll, hasSlug }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory(): HistoryContextValue {
  const ctx = useContext(HistoryContext);
  if (!ctx) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }
  return ctx;
}
