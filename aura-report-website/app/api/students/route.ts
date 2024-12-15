import { Student } from "@/types/data/Student";
import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  const students: Student[] = [
    {
      name: "kevin",
      email: "kevinliusingapore@gmail.com",
      dateOfBirth: new Date("14/09/1998"),
      currentSchool: "Chung Cheng High Yishun",
      currentLevel: "P6",
      id: "6c4830d5-4281-4895-84a4-ed12d2cb01c5",
    },
    {
      name: "Hong Liang",
      email: "weehongliang@gmail.com",
      dateOfBirth: new Date("14/09/1998"),
      currentSchool: "Chung Cheng High Yishun",
      currentLevel: "P4",
      id: "3e061a61-7ba5-4536-832e-d7c5c756482a",
    },
    {
      name: "kevin",
      email: "kevinliusingapore@gmail.com",
      dateOfBirth: new Date("14/09/1998"),
      currentSchool: "Chung Cheng High Yishun",
      currentLevel: "P6",
      id: "1b8e4fbd-4da0-4f22-86b1-4149fb6d5090",
    },
    {
      name: "Hong Liang",
      email: "weehongliang@gmail.com",
      dateOfBirth: new Date("14/09/1998"),
      currentSchool: "Chung Cheng High Yishun",
      currentLevel: "P4",
      id: "0ca53fca-7089-4b8c-a3e2-2882e8fb19bb",
    },
    {
      name: "kevin",
      email: "kevinliusingapore@gmail.com",
      dateOfBirth: new Date("14/09/1998"),
      currentSchool: "Chung Cheng High Yishun",
      currentLevel: "P6",
      id: "9569138d-8df5-41ff-9eed-f7a6a6698e0f",
    },
    {
      name: "Hong Liang",
      email: "weehongliang@gmail.com",
      dateOfBirth: new Date("14/09/1998"),
      currentSchool: "Chung Cheng High Yishun",
      currentLevel: "P4",
      id: "1f485bce-7564-413a-ae75-f69792e37e6b",
    },
  ];

  return NextResponse.json(students);
}
