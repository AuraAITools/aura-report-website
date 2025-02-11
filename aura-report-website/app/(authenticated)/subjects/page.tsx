"use client";
import SubjectsList from "@/features/subjects-dashboard/subjects-list/SubjectsList";

export default function SubjectsPage() {
  return (
    <div>
      <SubjectsList.Root>
        <SubjectsList.Header name='Subjects'>
          <SubjectsList.CreateSubjectButton />
        </SubjectsList.Header>
        <SubjectsList.Display />
      </SubjectsList.Root>
    </div>
  );
}
