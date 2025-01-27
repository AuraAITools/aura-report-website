"use client";
import { useGetInstitutionsByIds } from "@/lib/hooks/useInstitutions";
import { BaseInstitution } from "@/types/data/Institution";
import { BaseOutlet } from "@/types/data/Outlet";
import { useSession } from "next-auth/react";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import ProgressBar from "../ui/progress-bar/ProgressBar";
import { UnauthenticatedScreen } from "./Authorization";

type InstitutionAndOutletContext = {
  institutions: BaseInstitution[];
  outlets: BaseOutlet[];
  currentInstitutionContext: BaseInstitution;
  currentOutletContext: BaseOutlet;
  status: "error" | "success" | "pending";
  roles: String[];
  currentRolesContext: String[];
};

const InstitutionAndOutletContext = createContext<
  InstitutionAndOutletContext | undefined
>(undefined);

/**
 * InstitutionsAndOutletsProvider is responsible for managing the current user's institutions and outlets context
 * Reads the session's institution
 * fetches institution and outlets details
 * fetches user's institutions and outlets and stores it in the context
 * @param props
 * @returns
 */
export function InstitutionsAndOutletsProvider(props: PropsWithChildren) {
  // fetch role context
  const {
    roleCtx,
    currRoleContext,
    setCurrRoleCtx,
    status: fetchRoleStatus,
  } = useRoles();
  const { data: session, status: sessionStatus } = useSession();
  if (sessionStatus === "loading" || fetchRoleStatus === "loading") {
    return <ProgressBar />;
  }

  if (
    sessionStatus !== "authenticated" ||
    fetchRoleStatus !== "authenticated"
  ) {
    return <UnauthenticatedScreen />;
  }

  if (session.user.ext_attrs.tenant_ids.length < 1) {
    throw new Error("no institutions for user yet");
  }

  // fetch institutions details from the session details
  const { data: institutions, status: fetchInstitutionsStatus } =
    useGetInstitutionsByIds(session.user.ext_attrs.tenant_ids);

  if (fetchInstitutionsStatus === "pending" || institutions === undefined) {
    return <ProgressBar />;
  }

  if (fetchInstitutionsStatus === "error") {
    throw new Error("cannot fetch institutions of user from server");
  }
  // if institution-admin role fetch all outlets from server

  const [currInstitution, setCurrInstitution] = useState<
    BaseInstitution | undefined
  >(institutions.at(0));
  // if outlet-admin role get outlet-ids from session and only fetch those

  if (!currInstitution) {
    return <ProgressBar />;
  }
  // fetch outlets of institution
  useEffect(() => {}, [institutions]);

  // when currInstitution context is changed, switch the role context too
  useEffect(() => {
    if (currInstitution) {
      let currRoles = session.user.roles
        .filter((role) => role.startsWith(currInstitution.id!))
        .map((role) => {
          return role.substring(currInstitution.id!.length + 1);
        });
      setCurrentRoles(currRoles);
    }
  }, [currInstitution]);

  return (
    <InstitutionAndOutletContext.Provider
      value={{
        institutions: fetchedinstitutions,
        outlets: fetchedOutlets,
        currentInstitutionContext: currInstitution,
        currentOutletContext: currOutlet,
        roles: session.user.roles,
        currentRolesContext: ["institution-admin"],
      }}
    >
      {props.children}
    </InstitutionAndOutletContext.Provider>
  );
}

/**
 * useInstitutionContext hook allows children classes of InstitutionsAndOutletsProvider to get institution stored in context
 * @returns
 */
export function useInstitutionContext() {
  const institutionContext = useContext(InstitutionAndOutletContext);
  if (!institutionContext) {
    throw new Error(
      "useInstitutionContext hook must be used within a InstitutionsAndOutletsProvider",
    );
  }
  return institutionContext;
}

export function useRoles() {
  const { data: session, status: sessionStatus } = useSession();
  if (sessionStatus !== "authenticated") {
    return {
      roleCtx: undefined,
      currRoleContext: undefined,
      setCurrRoleCtx: undefined,
      status: sessionStatus,
    };
  }

  const [institutionRoleMap, setInstitutionRoleMap] = useState<
    Map<string, string[]> | undefined
  >(undefined);
  const [currRoleContext, setCurrentRoleContext] = useState<string | undefined>(
    session.user.ext_attrs.tenant_ids.at(0),
  );

  useEffect(() => {
    let roleMap = new Map<string, string[]>();
    session.user.ext_attrs.tenant_ids.forEach((tenantId) => {
      let roles = session.user.roles
        .filter((role) => role.startsWith(tenantId))
        .map((tr) => tr.substring(tenantId.length + 1));
      roleMap.set(tenantId, roles);
    });

    setInstitutionRoleMap(roleMap);
  }, [session.user.roles]);

  return {
    roleCtx: institutionRoleMap,
    currRoleCtx: currRoleContext,
    setCurrRoleCtx: setCurrentRoleContext,
    status: "success",
  };
}
