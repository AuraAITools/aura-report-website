"use client";
import { useGetInstitutionsForSessionUser } from "@/lib/hooks/useInstitutions";
import { Institution } from "@/types/data/Institution";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type InstitutionContext = {
  institution: Institution;
  status: "error" | "success" | "pending";
};

const InstitutionContext = createContext<InstitutionContext | undefined>(
  undefined,
);

/**
 * InstitutionProvider fetches user's institution and stores it in the context
 * @param props
 * @returns
 */
export function InstitutionProvider(props: PropsWithChildren) {
  const { data: fetchedInstitutions, status } =
    useGetInstitutionsForSessionUser();

  const [institution, setInstitution] = useState<Institution | undefined>(
    undefined,
  );

  useEffect(() => {
    // the backend supports a user account having multiple institutions for future extensibility
    // but for now, we will only limit to 1 institution per user
    setInstitution(fetchedInstitutions?.at(0));
  }, [fetchedInstitutions, institution, setInstitution]);

  return (
    <InstitutionContext.Provider value={{ institution: institution!, status }}>
      {props.children}
    </InstitutionContext.Provider>
  );
}

/**
 * useInstitutionContext hook allows children classes of InstitutionProvider to get institution stored in context
 * @returns
 */
export function useInstitutionContext() {
  const institutionContext = useContext(InstitutionContext);
  if (!institutionContext) {
    throw new Error(
      "useInstitutionContext hook must be used within a InstitutionProvider",
    );
  }
  return institutionContext;
}
