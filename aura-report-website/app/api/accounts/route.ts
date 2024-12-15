import { Account } from "@/types/data/Account";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const account: Omit<Account, "id"> = await req.json();
  console.log(`account requested: ${JSON.stringify(account)}`);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return new NextResponse(null, {
    status: 201,
    headers: {
      Location: `/api/accounts/${crypto.randomUUID()}`,
    },
  });
}
