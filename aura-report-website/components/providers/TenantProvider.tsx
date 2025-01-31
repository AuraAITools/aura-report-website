"use client";

import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";
import ProgressBar from "../ui/progress-bar/ProgressBar";

const TenantContext = createContext<{ tenant: string | undefined }>({
  tenant: undefined,
});

// TODO: can be replaced by InstitutionsAndOutletsProvider?
export default function TenantProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [tenant, setTenant] = useState<string | undefined>(undefined);

  useEffect(() => {
    console.log(`session: ${JSON.stringify(session, null, 2)}`);
    let tenantId = session?.user.ext_attrs.tenant_ids.at(0);
    console.log(`set tenant id in TenantProvider: ${tenantId}`);
    setTenant(tenantId);
  }, [session]);
  if (status === "loading") {
    return <ProgressBar />;
  }

  return (
    <TenantContext.Provider value={{ tenant: tenant }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const { tenant } = useContext(TenantContext);
  if (!tenant) {
    return { loading: true, tenant };
  }
  return { loading: false, tenant };
}
