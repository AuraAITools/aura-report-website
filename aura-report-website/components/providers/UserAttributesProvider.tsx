import { useSession } from "next-auth/react";
import ProgressBar from "../ui/progress-bar/ProgressBar";
import { UnauthenticatedScreen } from "./Authorization";

// TODO: relook
export default function UserAttributesProvider() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <ProgressBar />;
  }

  if (status !== "authenticated") {
    return <UnauthenticatedScreen />;
  }

  return <div>UserAttributesProvider</div>;
}
