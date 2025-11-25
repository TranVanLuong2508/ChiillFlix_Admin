"use client";

import { useAuthStore } from "@/stores/authStore";
import { NotPermitted } from "./not-permitted";
import { useAppRouter } from "@/hooks/useAppRouter";
import { useEffect } from "react";
import { Loading } from "../shared/loading";

export const RoleBaseRoute = ({ children }: { children: React.ReactNode }) => {
  const { authUser } = useAuthStore();

  if (authUser.roleId !== 3 && authUser.roleName !== "NORMAL_USER") {
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
  const { isAuthenticated, authUser, isLoading } = useAuthStore();
  const { goLogin } = useAppRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      goLogin();
    }
  }, [isLoading]);

  return (
    <>
      {isLoading === true ? (
        <>
          <Loading />
        </>
      ) : (
        <>
          {isAuthenticated === true ? (
            <>
              <RoleBaseRoute>{children}</RoleBaseRoute>
            </>
          ) : null}
        </>
      )}
    </>
  );
};
// return <RoleBaseRoute>{children}</RoleBaseRoute>;
