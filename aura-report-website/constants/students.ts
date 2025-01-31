import { BaseStudent } from "@/types/data/Student";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { randomNumber } from "./helper";
import { BaseLevelWithSubjects, levels } from "./levels";

type BaseStudentWithLevels = BaseStudent & {
  level: BaseLevelWithSubjects;
};
export function newStudent(): BaseStudentWithLevels {
  let student: BaseStudentWithLevels = {
    id: uuidv4(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    dateOfBirth: faker.date.birthdate(),
    currentSchool: faker.company.name(),
    level: levels[randomNumber(levels.length)],
  };
  return student;
}

export const students = [...Array.from({ length: 30 }, (_, i) => newStudent())];
