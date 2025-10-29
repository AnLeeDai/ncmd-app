import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Hook: useAuth
 * - Fetches current user from `/api/private/auth/me` (server proxy)
 * - Exposes: user, isLoading, isError, error, refresh, logout
 * - Uses credentials: 'include' so HttpOnly cookie is sent by browser
 */
export const useAuth = ({ enabled = true } = {}) => {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const res = await fetch("/api/me", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        // Let callers know; react-query will set isError
        throw new Error("Not authenticated");
      }

      const body = await res.json().catch(() => null);

      return body?.user ?? null;
    },
    enabled,
    // don't aggressively refetch by default; caller can call refresh()
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logout = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        // invalidate auth query so UI updates to unauthenticated
        await qc.invalidateQueries({ queryKey: ["auth"] });
      }

      return res;
    } catch (err) {
      // bubble up to caller
      throw err;
    }
  }, [qc]);

  return {
    user: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refresh: query.refetch,
    logout,
  } as const;
};

export default useAuth;
