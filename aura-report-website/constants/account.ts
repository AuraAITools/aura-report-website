import { ACCOUNT_RELATIONSHIP, BaseAccount } from "@/types/data/Account";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";
import { randomNumber } from "./helper";
// accounts are basically the same as Accounts/Clients
export function newAccount(): BaseAccount {
  let account: BaseAccount = {
    id: uuidv4(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    contact: faker.phone.number(),
    relationship:
      ACCOUNT_RELATIONSHIP[randomNumber(ACCOUNT_RELATIONSHIP.length)],
  };
  return account;
}

export const accounts = [...Array.from({ length: 30 }, (_, i) => newAccount())];
