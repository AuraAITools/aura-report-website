import { BaseEducator } from "@/types/data/Educator";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
export function newEducator(): BaseEducator {
  let educator: BaseEducator = {
    id: uuidv4(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
  };
  return educator;
}

export const educators = [
  ...Array.from({ length: 30 }, (_, i) => newEducator()),
];
