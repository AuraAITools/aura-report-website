"use client";
import { ExclamationTriangleIcon, LockClosedIcon } from "@radix-ui/react-icons";
import { signIn, useSession } from "next-auth/react";
import { PropsWithChildren } from "react";
import LoadingComponent from "../ui/loading/LoadingComponent";

export type AuthorizationProps = {
  allowedRoles?: string[];
  hideContent?: boolean;
} & PropsWithChildren;

/**
 * Authentication and Authorization by RBAC enforcement is done in this JSX component
 * if undefined or an empty array of allwoedRoles is passed, authorisation is not enforced
 * @param allowedRoles
 * @returns
 */
export default function Authorization({
  hideContent,
  children,
  allowedRoles,
}: AuthorizationProps) {
  // get user from session
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <LoadingComponent
        image={{
          src: "/Logo.png",
          alt: "Aura logo",
          className: "animate-spin-slow",
          width: 40,
          height: 40,
        }}
        className='w-screen h-screen'
        loadingMessage={"Fetching User Session"}
      />
    );
  }

  if (
    status === "unauthenticated" ||
    !session ||
    session.error === "RefreshAccessTokenError"
  ) {
    return <UnauthenticatedScreen />;
  }

  if (!allowedRoles || allowedRoles.length == 0) {
    return <>{children}</>;
  }
  let allowedTenantAwareRoles = allowedRoles.map(
    (r) => `${session.user.ext_attrs.tenant_ids[0]}_${r}`,
  );

  let canAccess = false;
  if (allowedTenantAwareRoles) {
    canAccess =
      allowedTenantAwareRoles.filter((allowedRole) =>
        session.user.roles.includes(allowedRole),
      ).length > 0;
  }

  // hide content mode
  if (!canAccess && hideContent) {
    return <></>;
  }

  // do a role check
  if (!canAccess) {
    return <UnauthorisedScreen allowedRoles={allowedRoles} />;
  }

  // return children if authorised
  return <>{children}</>;
}

export function UnauthenticatedScreen() {
  return (
    <div className='flex flex-col gap-4 h-screen w-screen items-center justify-center'>
      <LockClosedIcon className='size-28 text-orange-300' />
      <p>Unauthenticated</p>
      <button
        className='p-2 flex justify-center items-center bg-orange-300 rounded-lg text-white hover:bg-orange-400'
        onClick={() => signIn("keycloak")}
      >
        login
      </button>
    </div>
  );
}

type UnauthorisedScreenProps = {
  allowedRoles: string[];
};
export function UnauthorisedScreen({ allowedRoles }: UnauthorisedScreenProps) {
  return (
    <div className='flex flex-col h-screen w-screen items-center justify-center'>
      <ExclamationTriangleIcon className='size-28 text-orange-300' />
      <p>Unauthorized. Get below roles to access </p>
      <ul>
        {allowedRoles.map((role, idx) => {
          return (
            <li className='list-disc' key={idx}>
              {role}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
