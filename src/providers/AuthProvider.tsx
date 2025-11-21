"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import { useAppRouter } from "@/hooks/useAppRouter";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { fetchAccountAction, resetAuthAction, isRefreshToken, errorRefreshToken, setRefreshTokenAction, setLoading } =
    useAuthStore();
  const { goLogin, goAdmin } = useAppRouter();
  useEffect(() => {
    fetchAccount();
  }, []);

  useEffect(() => {
    if (isRefreshToken) {
      toast.error(errorRefreshToken);
      setRefreshTokenAction(false, "");
    }
  }, [isRefreshToken]);
  const fetchAccount = async () => {
    console.log("check fetch accouht");
    try {
      const accessToken = useAuthStore.getState().access_token;
      setLoading(false);
      if (accessToken) {
        const res = await authService.callFetchAccount();
        if (res && res.data) {
          fetchAccountAction(res.data.user);
          setLoading(false);
          goAdmin();
        } else {
          resetAuthAction();
          goLogin();
        }
        setLoading(false);
      }
    } catch (errr) {
      console.log(errr);
      setLoading(false);
    }
  };

  return <>{children}</>;
}
