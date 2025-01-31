"use client";
import LoadingComponent from "@/components/ui/loading/LoadingComponent";
import {
  useCreateSubject,
  useDeleteSubject,
  useGetAllSubjects,
} from "@/lib/hooks/useSubjects";
import { BaseSubject } from "@/types/data/Subject";
import { generateKey } from "@/utils/id";
import { Cross1Icon } from "@radix-ui/react-icons";
import { createContext, PropsWithChildren, useContext, useState } from "react";

type SubjectListContext = {
  subjects: BaseSubject[];
};

const SubjectListContext = createContext<SubjectListContext | undefined>(
  undefined,
);

function useSubjectsList() {
  let subjects = useContext(SubjectListContext);
  if (!subjects) {
    throw new Error(
      "useSubjectsList hook is only usable within the SubjectsList component",
    );
  }
  return subjects;
}

function SubjectsList(props: PropsWithChildren) {
  const { data: subjects, status } = useGetAllSubjects();

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
        loadingMessage={"Fetching Subjects"}
      />
    );
  }

  if (status === "error") {
    throw new Error("Failed to load subjects list");
  }

  return (
    <SubjectListContext.Provider value={{ subjects }}>
      <Container>{props.children}</Container>;
    </SubjectListContext.Provider>
  );
}

function Container({ children }: PropsWithChildren) {
  return (
    <div className='flex flex-col p-4 bg-white rounded-lg'>{children}</div>
  );
}

type SubjectsListHeaderProps = {
  name: string;
} & PropsWithChildren;

function SubjectsListHeader(props: SubjectsListHeaderProps) {
  return (
    <div className='flex flex-col'>
      <div className='self-center text-xl'>{props.name}</div>
      <div className='flex py-2'>{props.children}</div>
    </div>
  );
}

function SubjectsListDisplay() {
  let { subjects } = useSubjectsList();

  if (subjects.length === 0) {
    return <div>No Subjects created yet</div>;
  }
  return (
    <li className='list-none flex flex-col gap-2 md:h-[1000px] overflow-scroll'>
      {subjects.map((subject, idx) => {
        return (
          <SubjectsListItem
            subject={subject}
            key={generateKey("subject_list_item", subject.id, idx.toString())}
          />
        );
      })}
    </li>
  );
}

type SubjectsListItemProps = {
  subject: BaseSubject;
};

function SubjectsListItem(props: SubjectsListItemProps) {
  return (
    <ul className='flex w-full bg-orange-300 rounded-lg p-4'>
      <p className='text-white'>{props.subject.name}</p>
      <div className='mr-auto' />
      <DeleteListButton id={props.subject.id} />
    </ul>
  );
}

function SubjectsListButton() {
  const { mutate } = useCreateSubject();
  const [subjectName, setSubjectName] = useState<string>("");
  function addSubject() {
    let subject: Omit<BaseSubject, "id"> = {
      name: subjectName,
    };
    mutate(subject);
    setSubjectName("");
  }
  return (
    <div className='flex gap-2'>
      <input
        className='rounded-lg ring-1 ring-black'
        onChange={(e) => setSubjectName(e.target.value)}
        type='text'
      />
      <button
        className='bg-orange-300 rounded-lg p-2 text-white'
        onClick={addSubject}
      >
        Add Subject
      </button>
    </div>
  );
}

type DeleteListButtonProps = {
  id: string;
};
function DeleteListButton(props: DeleteListButtonProps) {
  const { mutate } = useDeleteSubject();

  function deleteSubject(id: string) {
    mutate(id);
  }
  return (
    <button className='text-white' onClick={() => deleteSubject(props.id)}>
      <Cross1Icon />
    </button>
  );
}

SubjectsList.Root = SubjectsList;
SubjectsList.Header = SubjectsListHeader;
SubjectsList.Display = SubjectsListDisplay;
SubjectsList.CreateSubjectButton = SubjectsListButton;
export default SubjectsList;
