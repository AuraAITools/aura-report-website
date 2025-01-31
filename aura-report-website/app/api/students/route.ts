import { accounts } from "@/constants/account";
import { courses } from "@/constants/courses";
import { randomNumber } from "@/constants/helper";
import { levels } from "@/constants/levels";
import { outlets } from "@/constants/outlets";
import { students } from "@/constants/students";
import { StudentWithAssociations } from "@/types/data/Student";
import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  let expandedStudents = students.map((s) => {
    let level = levels[randomNumber(levels.length)];
    let maximumAttendedCourses = courses.filter(
      (c) => c.level.name === level.name,
    );
    let attendedCourses = maximumAttendedCourses.splice(
      randomNumber(maximumAttendedCourses.length),
      randomNumber(maximumAttendedCourses.length),
    );
    let student: StudentWithAssociations = {
      ...s,
      level,
      courses: attendedCourses,
      outlet: outlets[randomNumber(outlets.length)],
      account: accounts[randomNumber(accounts.length)],
    };
    return student;
  });
  return NextResponse.json(expandedStudents);
}
