import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import instance from "@/libs/instance";
import mapUser from "@/api/services/users";

export const useAuth = ({ enabled = true } = {}) => {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      try {
        const res = await instance.get("/private/user/profile");

        const body = res.data;

        // normalize user object from backend response
        const raw = body?.user ?? body ?? null;

        return mapUser(raw);
      } catch {
        throw new Error("Not authenticated");
      }
    },
    enabled,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logout = useCallback(async () => {
    try {
      const res = await instance.post("/private/auth/logout");

      if (res.status === 200 || res.status === 204) {
        await qc.invalidateQueries({ queryKey: ["auth"] });
      }

      return res;
    } catch (err) {
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
