import { courses } from "@/constants/courses";
import { BaseCourse } from "@/types/data/Course";
import { BaseLevel } from "@/types/data/Level";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
export async function GET(req: NextRequest) {
  return NextResponse.json(courses);
}

export async function POST(req: NextRequest) {
  let course: Omit<BaseCourse & { level: BaseLevel }, "id">;
  try {
    course = await req.json();
    // let validation = BaseSubjectSchema.safeParse(subject);
    // console.log(`validation: ${JSON.stringify(validation)}`);
  } catch (error) {
    return new NextResponse(null, {
      status: 404,
    });
  }

  let createdCourse = {
    id: uuidv4(),
    ...course,
  };
  courses.push(createdCourse);
  return NextResponse.json(createdCourse, { status: 201 });
}
