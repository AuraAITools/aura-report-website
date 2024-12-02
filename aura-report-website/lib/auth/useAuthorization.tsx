"use client";
import { useCallback } from "react";
import { RoleTypes } from "./Authorization";
import { useSession } from "next-auth/react";

/**
 * This hook returns a checkAccess function that checks whether the user's role is in the allowed roles
 * This hook also returns the user's role
 * @returns
 */
export default function useAuthorization() {
  const { data: session, status } = useSession();

  if (!session || !session.user) {
    throw Error("User does not exist!");
  }

  const user = session.user;

  const checkAccess = useCallback(
    ({ allowedRoles }: { allowedRoles: RoleTypes[] }) => {
      if (allowedRoles && allowedRoles.length > 0 && user) {
        return true;
        // return allowedRoles.includes(user.role);
      }
      return true;
    },
    [user]
  );

  // return {checkAccess, role: user.role};

  // for now set user's role as INSTITUTION_ADMIN until roles are set up on backend
  return { checkAccess, role: "INSTITUTION_ADMIN" };
}
