"use client";
import { getInstitutionById } from "@/lib/requests/institutions";
import { getAllOutletsInInstitution } from "@/lib/requests/outlet";
import { BaseInstitution } from "@/types/data/Institution";
import { BaseOutlet } from "@/types/data/Outlet";
import { useQueries } from "@tanstack/react-query";
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
// type InstitutionAndOutletContext = {
//   institutions: BaseInstitution[];
//   outlets: BaseOutletContext[];
//   currentInstitution: BaseInstitution | undefined;
//   currentOutlets: BaseOutletContext[];
//   currentOutlet: BaseOutletContext | undefined;
//   status: "error" | "success" | "pending";
//   roles: string[];
//   currentRoles: string[];
//   changeCurrentInstitution: (institution: BaseInstitution) => void;
//   setCurrentOutlet: (outlet: BaseOutletContext) => void;
//   refetchContext: () => void;
// };
type InstitutionAndOutletContext = {
  institutions: BaseInstitution[];
  outlets: BaseOutlet[];
  currentInstitution: BaseInstitution | undefined;
  currentOutlets: BaseOutlet[];
  currentOutlet: BaseOutlet | undefined;
  status: "error" | "success" | "pending";
  roles: string[];
  currentRoles: string[];
  changeCurrentInstitution: (institution: BaseInstitution) => void;
  setCurrentOutlet: (outlet: BaseOutlet) => void;
  refetchContext: () => void;
};

// TODO: see if i can write this without much contexts and using tanstack queries for state management instead
const InstitutionAndOutletContext = createContext<
  InstitutionAndOutletContext | undefined
>(undefined);

// export function InstitutionsAndOutletsProvider(props: PropsWithChildren) {
//   const { data: session, status: sessionStatus } = useSession();
//   const [currentInstitution, setCurrentInstitution] = useState<
//     BaseInstitution | undefined
//   >(undefined);
//   const [currentOutlets, setCurrentOutlets] = useState<
//     BaseOutletContext[] | undefined
//   >(undefined);
//   const [currentOutlet, setCurrentOutlet] = useState<
//     BaseOutletContext | undefined
//   >(undefined);
//   const [currentRoles, setCurrentRoles] = useState<string[] | undefined>();

//   // fetch institutions once session is authenticated
//   const {
//     data: institutions,
//     status: institutionsStatus,
//     refetch: refetchInstitutions,
//   } = useGetInstitutionsByIds(
//     session!.user.ext_attrs.tenant_ids,
//     sessionStatus === "authenticated" &&
//       !!session &&
//       session.user.ext_attrs.tenant_ids.length > 0,
//   );

//   // fetch outlets of institutions once institutions are retrieved
//   const { data: outlets = [], status: outletStatus } =
//     useGetAllOutletsOfInstitutions(
//       session!.user.ext_attrs.tenant_ids,
//       sessionStatus === "authenticated" &&
//         !!session &&
//         session.user.ext_attrs.tenant_ids.length > 0,
//     );

//   // useQueries({
//   //   queries: session!.user.ext_attrs.tenant_ids.map((tid) => ({
//   //     queryFn: () => getAllOutletsInInstitution(tid),
//   //     queryKey: ["institutions", tid, "outlets"],
//   //     enabled: !!session,
//   //   })),
//   //   combine: (results) => ({
//   //     data: results.map(res => res.data),

//   //   })
//   // });
//   // when list of all institutions user own changes, set the default current institution as index 0
//   useEffect(() => {
//     console.log(
//       `changes in institutions and current institution :${JSON.stringify(institutions, null, 2)}`,
//     );

//     if (!!institutions && institutions.length > 0 && !currentInstitution) {
//       console.log(
//         `setting current institution to the one at index 0: ${JSON.stringify(institutions[0])}}`,
//       );
//       setCurrentInstitution(institutions[0]);
//     }
//   }, [institutions, setCurrentInstitution]);

//   // set outlets available to current institution when institution changes
//   useEffect(() => {
//     if (!!currentInstitution && !!outlets && outlets.length > 0) {
//       let outletsInCurrentInstitution = outlets.filter(
//         (o) => o.institution_id === currentInstitution.id,
//       );
//       setCurrentOutlets(outletsInCurrentInstitution);
//     }
//   }, [currentInstitution]);

//   // set the current outlet when current outlets change
//   useEffect(() => {
//     if (!!currentOutlets && currentOutlets.length > 0) {
//       setCurrentOutlet(currentOutlets[0]);
//     }
//   }, [currentOutlets]);

//   // Update roles when institution changes
//   useEffect(() => {
//     if (currentInstitution && session) {
//       const newRoles = session.user.roles
//         .filter((role) => role.startsWith(currentInstitution.id))
//         .map((role) => role.substring(currentInstitution.id.length + 1));
//       console.log(`roles updated to ${JSON.stringify(newRoles, null, 2)}`);
//       setCurrentRoles(newRoles);
//     }
//   }, [currentInstitution, session]);

//   // when user sets a new institution context
//   function changeCurrentInstitution(institution: BaseInstitution) {
//     setCurrentInstitution(institution);
//     console.log(
//       `change institution context to ${JSON.stringify(institution, null, 2)}`,
//     );
//   }
//   // Loading states
//   if (sessionStatus === "loading" || institutionsStatus === "pending") {
//     return <ProgressBar />;
//   }

//   // Authentication check
//   if (sessionStatus !== "authenticated") {
//     return <UnauthenticatedScreen />;
//   }

//   // Validation checks
//   if (!session.user.ext_attrs.tenant_ids.length) {
//     throw new Error("No institutions assigned to user");
//   }

//   if (institutionsStatus === "error") {
//     throw new Error("Failed to fetch institutions");
//   }

//   const status = outletStatus === "pending" ? "pending" : "success";

//   return (
//     <InstitutionAndOutletContext.Provider
//       value={{
//         institutions: institutions,
//         outlets,
//         currentInstitution: currentInstitution,
//         currentOutlets: currentOutlets ?? [],
//         status,
//         roles: session.user.roles,
//         currentRoles: currentRoles ?? [],
//         changeCurrentInstitution,
//         setCurrentOutlet,
//         currentOutlet,
//         refetchContext: refetchInstitutions,
//       }}
//     >
//       {props.children}
//     </InstitutionAndOutletContext.Provider>
//   );
// }

type InstitutionAndOutlet = BaseInstitution & {
  outlets: BaseOutlet[];
};
export function InstitutionsAndOutletsProvider(props: PropsWithChildren) {
  const { data: session, status: sessionStatus } = useSession();
  const [currentInstitution, setCurrentInstitution] = useState<
    BaseInstitution | undefined
  >(undefined);
  const [currentOutlet, setCurrentOutlet] = useState<BaseOutlet | undefined>(
    undefined,
  );
  const [currentRoles, setCurrentRoles] = useState<string[] | undefined>();

  // fetch institutions once session is authenticated
  // const {
  //   data: institutions,
  //   status: institutionsStatus,
  //   refetch: refetchInstitutions,
  // } = useGetInstitutionsByIds(
  //   session!.user.ext_attrs.tenant_ids,
  //   sessionStatus === "authenticated" &&
  //     !!session &&
  //     session.user.ext_attrs.tenant_ids.length > 0,
  // );

  if (!session) {
    console.error("no session");
    return <UnauthenticatedScreen />;
  }

  // get institutions
  const {
    data: institutionAndOutlets,
    isError,
    isPending: fetchinginstitutionAndOutlets,
    refetch: refetchInstitutions,
  } = useQueries({
    queries: session.user.ext_attrs.tenant_ids.map((institutionId) => ({
      queryFn: async () => {
        let institution = await getInstitutionById(institutionId);
        let outlets = await getAllOutletsInInstitution(institution.id);
        return {
          ...institution,
          outlets: outlets,
        };
      },
      queryKey: ["institutions", institutionId],
      enabled: !!session && session.user.ext_attrs.tenant_ids.length > 0,
    })),
    combine: (results) => ({
      data: results.map((res) => res.data) as InstitutionAndOutlet[],
      isPending: results.some((res) => res.isPending),
      isError: results.some((res) => res.isError),
      refetch: () => {
        results.forEach((res) => res.refetch());
      },
    }),
  });

  // get outlets

  // if (fetchingInstitutions || !institutions) {
  //   return <ProgressBar />;
  // }

  useEffect(() => {
    if (
      !currentInstitution &&
      !!institutionAndOutlets &&
      institutionAndOutlets.length > 0 &&
      !fetchinginstitutionAndOutlets
    ) {
      setCurrentInstitution(institutionAndOutlets[0]);
      console.log(`${JSON.stringify(institutionAndOutlets, null, 2)}`);
      setCurrentOutlet(institutionAndOutlets[0].outlets[0]);
    }
  }, [institutionAndOutlets, fetchinginstitutionAndOutlets]);

  // fetch outlets of institutions once institutions are retrieved
  // const { data: outlets = [], status: outletStatus } =
  //   useGetAllOutletsOfInstitutions(
  //     session!.user.ext_attrs.tenant_ids,
  //     sessionStatus === "authenticated" &&
  //       !!session &&
  //       session.user.ext_attrs.tenant_ids.length > 0,
  //   );

  // useQueries({
  //   queries: session!.user.ext_attrs.tenant_ids.map((tid) => ({
  //     queryFn: () => getAllOutletsInInstitution(tid),
  //     queryKey: ["institutions", tid, "outlets"],
  //     enabled: !!session,
  //   })),
  //   combine: (results) => ({
  //     data: results.map(res => res.data),

  //   })
  // });
  // when list of all institutions user own changes, set the default current institution as index 0
  // useEffect(() => {
  //   console.log(
  //     `changes in institutions and current institution :${JSON.stringify(institutions, null, 2)}`,
  //   );

  //   if (!!institutions && institutions.length > 0 && !currentInstitution) {
  //     console.log(
  //       `setting current institution to the one at index 0: ${JSON.stringify(institutions[0])}}`,
  //     );
  //     setCurrentInstitution(institutions[0]);
  //   }
  // }, [institutions, setCurrentInstitution]);

  // set outlets available to current institution when institution changes
  // useEffect(() => {
  //   if (!!currentInstitution && !!outlets && outlets.length > 0) {
  //     let outletsInCurrentInstitution = outlets.filter(
  //       (o) => o.institution_id === currentInstitution.id,
  //     );
  //     setCurrentOutlets(outletsInCurrentInstitution);
  //   }
  // }, [currentInstitution]);

  // set the current outlet when current outlets change
  // useEffect(() => {
  //   if (!!currentOutlets && currentOutlets.length > 0) {
  //     setCurrentOutlet(currentOutlets[0]);
  //   }
  // }, [currentOutlets]);

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
  // if (sessionStatus === "loading" || institutionsStatus === "pending") {
  //   return <ProgressBar />;
  // }

  // Authentication check
  if (sessionStatus !== "authenticated") {
    return <UnauthenticatedScreen />;
  }

  // Validation checks
  if (!session.user.ext_attrs.tenant_ids.length) {
    throw new Error("No institutions assigned to user");
  }

  // if (institutionsStatus === "error") {
  //   throw new Error("Failed to fetch institutions");
  // }

  const status = fetchinginstitutionAndOutlets ? "pending" : "success";

  if (status === "pending" || !currentInstitution) {
    return <ProgressBar />;
  }

  return (
    <InstitutionAndOutletContext.Provider
      value={{
        institutions: institutionAndOutlets,
        outlets: institutionAndOutlets.filter(
          (iao) => iao.id === currentInstitution.id,
        )[0].outlets,
        currentInstitution: {
          ...institutionAndOutlets.filter(
            (iao) => iao.id === currentInstitution.id,
          )[0],
        },
        currentOutlets:
          institutionAndOutlets.filter(
            (iao) => iao.id === currentInstitution.id,
          )[0].outlets ?? [],
        status,
        roles: session.user.roles,
        currentRoles: currentRoles ?? [],
        changeCurrentInstitution,
        setCurrentOutlet,
        currentOutlet,
        refetchContext: refetchInstitutions,
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
