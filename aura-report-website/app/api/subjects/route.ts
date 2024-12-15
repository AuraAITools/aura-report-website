import { Subject } from "@/types/data/Subject";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const subjects: Subject[] = [
  {
    id: nanoid(),
    name: "E Mathematics",
  },
  {
    id: nanoid(),
    name: "A Mathematics",
  },
  {
    id: nanoid(),
    name: "English",
  },
  {
    id: nanoid(),
    name: "Chinese",
  },
  {
    id: nanoid(),
    name: "Chemistry",
  },
  {
    id: nanoid(),
    name: "Physics",
  },
  {
    id: nanoid(),
    name: "Social Studies",
  },
];

export async function GET(req: NextRequest) {
  return NextResponse.json(subjects);
}

export async function POST(req: NextRequest) {
  let subject: Omit<Subject, "id">;
  await new Promise((resolve) => setTimeout(resolve, 2000));
  try {
    subject = await req.json();
    // let validation = subjectSchema.safeParse(subject);
    // console.log(`validation: ${JSON.stringify(validation)}`);
  } catch (error) {
    return new NextResponse(null, {
      status: 404,
    });
  }

  let createdSubject = {
    id: nanoid(),
    ...subject,
  };
  subjects.push(createdSubject);
  return NextResponse.json(createdSubject, { status: 201 });
}
