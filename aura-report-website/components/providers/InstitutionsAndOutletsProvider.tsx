"use client";
import { useGetInstitutionsByIds } from "@/lib/hooks/useInstitutions";
import { useGetAllOutletsOfInstitutions } from "@/lib/hooks/useOutlets";
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
type BaseOutletContext = BaseOutlet & { institution_id: string };
type InstitutionAndOutletContext = {
  institutions: BaseInstitution[];
  outlets: BaseOutletContext[];
  currentInstitution: BaseInstitution;
  currentOutlets: BaseOutletContext[];
  currentOutlet: BaseOutletContext | undefined;
  status: "error" | "success" | "pending";
  roles: string[];
  currentRoles: string[];
  changeCurrentInstitution: (institution: BaseInstitution) => void;
  setCurrentOutlet: (outlet: BaseOutletContext) => void;
};

const InstitutionAndOutletContext = createContext<
  InstitutionAndOutletContext | undefined
>(undefined);

export function InstitutionsAndOutletsProvider(props: PropsWithChildren) {
  const { data: session, status: sessionStatus } = useSession();
  const [currentInstitution, setCurrentInstitution] =
    useState<BaseInstitution | null>(null);
  const [currentOutlets, setCurrentOutlets] = useState<
    BaseOutletContext[] | undefined
  >(undefined);
  const [currentOutlet, setCurrentOutlet] = useState<
    BaseOutletContext | undefined
  >(undefined);
  const [currentRoles, setCurrentRoles] = useState<string[] | undefined>();

  // fetch institutions once session is authenticated
  const { data: institutions, status: institutionsStatus } =
    useGetInstitutionsByIds(
      session!.user.ext_attrs.tenant_ids,
      sessionStatus === "authenticated" &&
        !!session &&
        session.user.ext_attrs.tenant_ids.length > 0,
    );

  // fetch outlets of institutions once institutions are retrieved
  const { data: outlets = [], status: outletStatus } =
    useGetAllOutletsOfInstitutions(
      session!.user.ext_attrs.tenant_ids,
      sessionStatus === "authenticated" &&
        !!session &&
        session.user.ext_attrs.tenant_ids.length > 0,
    );

  // when list of all institutions user own changes, set the default current institution as index 0
  useEffect(() => {
    console.log(
      `changes in institutions and current institution :${JSON.stringify(institutions, null, 2)}`,
    );

    if (!!institutions && institutions.length > 0 && !currentInstitution) {
      console.log(
        `setting current institution to the one at index 0: ${JSON.stringify(institutions[0])}}`,
      );
      setCurrentInstitution(institutions[0]);
    }
  }, [institutions, setCurrentInstitution]);

  // set outlets available to current institution when institution changes
  useEffect(() => {
    if (!!currentInstitution && !!outlets && outlets.length > 0) {
      let outletsInCurrentInstitution = outlets.filter(
        (o) => o.institution_id === currentInstitution.id,
      );
      setCurrentOutlets(outletsInCurrentInstitution);
    }
  }, [currentInstitution]);

  // set the current outlet when current outlets change
  useEffect(() => {
    if (!!currentOutlets && currentOutlets.length > 0) {
      setCurrentOutlet(currentOutlets[0]);
    }
  }, [currentOutlets]);

  // Update roles when institution changes
  useEffect(() => {
    if (currentInstitution && session) {
      const newRoles = session.user.roles
        .filter((role) => role.startsWith(currentInstitution.id))
        .map((role) => role.substring(currentInstitution.id.length + 1));
      console.log(`roles updated to ${JSON.stringify(newRoles, null, 2)}`);
      setCurrentRoles(newRoles);
    }
  }, [currentInstitution, session]);

  // when user sets a new institution context
  function changeCurrentInstitution(institution: BaseInstitution) {
    setCurrentInstitution(institution);
    console.log(
      `change institution context to ${JSON.stringify(institution, null, 2)}`,
    );
  }
  // Loading states
  if (sessionStatus === "loading" || institutionsStatus === "pending") {
    return <ProgressBar />;
  }

  // Authentication check
  if (sessionStatus !== "authenticated") {
    return <UnauthenticatedScreen />;
  }

  // Validation checks
  if (!session.user.ext_attrs.tenant_ids.length) {
    throw new Error("No institutions assigned to user");
  }

  if (institutionsStatus === "error") {
    throw new Error("Failed to fetch institutions");
  }

  const status =
    outletStatus === "pending" ||
    currentOutlet === undefined ||
    currentOutlets === undefined ||
    currentRoles === undefined
      ? "pending"
      : "success";

  return (
    <InstitutionAndOutletContext.Provider
      value={{
        institutions: institutions,
        outlets,
        currentInstitution: currentInstitution!,
        currentOutlets: currentOutlets ?? [],
        status,
        roles: session.user.roles,
        currentRoles: currentRoles ?? [],
        changeCurrentInstitution,
        setCurrentOutlet,
        currentOutlet,
      }}
    >
      {props.children}
    </InstitutionAndOutletContext.Provider>
  );
}

export function useInstitutionAndOutletsContext() {
  const context = useContext(InstitutionAndOutletContext);
  if (!context) {
    throw new Error(
      "useInstitutionContext must be used within InstitutionsAndOutletsProvider",
    );
  }
  return context;
}
