import {
  CourseWithAssociations,
  DAYS,
  LESSON_FREQ_UNIT,
  PRICE_FREQUENCIES,
} from "@/types/data/Course";
import { BaseLevel } from "@/types/data/Level";
import { BaseOutlet } from "@/types/data/Outlet";
import { BaseSubject } from "@/types/data/Subject";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { randomNumber } from "./helper";
import { levels } from "./levels";
import { outlets } from "./outlets";

export function newCourse(
  level: BaseLevel,
  subject: BaseSubject,
  outlet: BaseOutlet,
  indicator: string,
): CourseWithAssociations {
  let start_date = faker.date.anytime();
  let end_date = faker.date.future({ years: 2, refDate: start_date });
  let course: CourseWithAssociations = {
    id: uuidv4(),
    name: `${level.name} ${subject.name} #${indicator}`,
    size: randomNumber(20),
    price: randomNumber(100),
    price_frequency: PRICE_FREQUENCIES[randomNumber(PRICE_FREQUENCIES.length)],
    start_date: start_date.toLocaleDateString(),
    end_date: end_date.toLocaleDateString(),
    start_time: new Date().toISOString().split("T").at(0)!,
    end_time: new Date().toISOString().split("T").at(0)!,
    // to generate lessons from classes
    lesson_freq: randomNumber(7),
    lesson_freq_day: DAYS[randomNumber(DAYS.length)],
    lesson_freq_unit: LESSON_FREQ_UNIT[randomNumber(LESSON_FREQ_UNIT.length)],
    outlet,
    level,
    subject,
  };
  return course;
}

// export const courses = levels.map(lvl => lvl.subjects.map(sub => [...Array(randomNumber(5))]).map(i => newCourse(lvl,sub,outlets[randomNumber(outlets.length)],i.toString())) ))
export const courses: CourseWithAssociations[] = levels.flatMap((lvl) =>
  lvl.subjects.flatMap((sub) =>
    Array.from({ length: randomNumber(5) }, (_, i) =>
      newCourse(
        lvl,
        sub,
        outlets[randomNumber(outlets.length)],
        (i + 1).toString(),
      ),
    ),
  ),
);
