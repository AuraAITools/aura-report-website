import { courses } from "@/constants/courses";
import { educators } from "@/constants/educators";
import { randomNumber } from "@/constants/helper";
import { levels } from "@/constants/levels";
import { students } from "@/constants/students";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  let expandedLevels = levels.map((lvl) => {
    return {
      ...lvl,
      courses: courses.filter((c) => c.level.name === lvl.name),
      educators: educators.slice(
        randomNumber(educators.length),
        randomNumber(educators.length),
      ),
      students: students.slice(
        randomNumber(students.length),
        randomNumber(students.length),
      ),
    };
  });
  return NextResponse.json(expandedLevels);
}
