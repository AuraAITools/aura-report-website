"use client";
import { useInstitutionContext } from "@/components/providers/InstitutionProvider";
import LoadingComponent from "@/components/ui/loading/LoadingComponent";
import SubjectsList from "@/features/subjects-dashboard/subjects-list/SubjectsList";
import { PropsWithChildren } from "react";

export default function SubjectsPage() {
  const { institution, status } = useInstitutionContext();

  if (status === "pending") {
    return (
      <LoadingComponent
        image={{
          src: "/Logo.png",
          alt: "Aura logo",
          className: "animate-spin-slow",
          width: 40,
          height: 40,
        }}
        loadingMessage={"Loading Subjects Dashboard"}
      />
    );
  }

  if (status == "error") {
    throw new Error("fetching of institution failed");
  }

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
