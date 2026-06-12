// src/hooks/useAuth.ts
import { useEffect, useState } from "react";

interface User {
  id: string;
  role: "admin" | "user";
  name?: string;
  email?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Replace with your actual auth logic
    // Example: get user from localStorage or context
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return { user };
};
