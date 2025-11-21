"use client";

import { useAuthStore } from "@/stores/authStore";
import { NotPermitted } from "./not-permitted";
import { useAppRouter } from "@/hooks/useAppRouter";
import { useEffect } from "react";

export const RoleBaseRoute = ({ children }: { children: React.ReactNode }) => {
  const { authUser } = useAuthStore();

  if (authUser.roleId !== 3) {
    return <>{children}</>;
  } else {
    return (
      <>
        <NotPermitted />
      </>
    );
  }
};

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, authUser } = useAuthStore();
  const { goLogin } = useAppRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      goLogin();
    }
  }, []);

  return <RoleBaseRoute>{children}</RoleBaseRoute>;
};
