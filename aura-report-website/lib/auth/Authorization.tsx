"use client";
import { PropsWithChildren } from "react";
import useAuthorization from "./useAuthorization";

export enum ROLES {
  INSTITUTION_ADMIN = "INSTITUTION_ADMIN",
  INSTITUTION_READ_ONLY = "INSTITUTION_READ_ONLY",
}
export type RoleTypes = keyof typeof ROLES;

export type AuthorizationProps = {
  allowedRoles: RoleTypes[];
} & PropsWithChildren;

/**
 * Wrapper Component that checks for authorization for child component
 * @param param0
 * @returns
 */
export default function Authorization({
  children,
  allowedRoles,
}: AuthorizationProps) {
  // get user from session
  const { checkAccess } = useAuthorization();

  let canAccess = false;

  if (allowedRoles) {
    canAccess = checkAccess({ allowedRoles });
  }

  // do a role check
  if (!canAccess) {
    throw new Error("Forbidden to enter");
  }

  // return children if authorised
  return <>{children}</>;
}
