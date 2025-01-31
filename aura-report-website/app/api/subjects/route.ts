import { subjects } from "@/constants/subjects";
import { BaseSubject } from "@/types/data/Subject";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json(subjects);
}

export async function POST(req: NextRequest) {
  let subject: Omit<BaseSubject, "id">;
  try {
    subject = await req.json();
    // let validation = BaseSubjectSchema.safeParse(subject);
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
