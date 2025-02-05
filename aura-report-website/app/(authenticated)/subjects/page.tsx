"use client";
import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import SubjectsList from "@/features/subjects-dashboard/subjects-list/SubjectsList";
import { PropsWithChildren } from "react";

export default function SubjectsPage() {
  const { institutions } = useInstitutionAndOutletsContext();

  // if (status === "pending") {
  //   return (
  //     <LoadingComponent
  //       image={{
  //         src: "/Logo.png",
  //         alt: "Aura logo",
  //         className: "animate-spin-slow",
  //         width: 40,
  //         height: 40,
  //       }}
  //       loadingMessage={"Loading Subjects Dashboard"}
  //     />
  //   );
  // }

  // if (status == "error") {
  //   throw new Error("fetching of institution failed");
  // }

  return (
    <div>
      <Filterbar />
      <SubjectsList.Root>
        <SubjectsList.Header name='Subjects'>
          <SubjectsList.CreateSubjectButton />
        </SubjectsList.Header>
        <SubjectsList.Display />
      </SubjectsList.Root>
    </div>
  );
}

function Filterbar(props: PropsWithChildren) {
  return <div>{props.children}</div>;
}
