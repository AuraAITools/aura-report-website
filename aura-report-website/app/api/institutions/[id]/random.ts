import { BaseInstitution } from "@/types/data/Institution";
import { RouteIdParam } from "@/types/RouteIdParam";
import { NextRequest, NextResponse } from "next/server";

function GET(req: NextRequest, { params }: RouteIdParam) {
  console.log(`params id ${params.id}`);
  const dummyData: BaseInstitution = {
    id: "1",
    name: "Ministry of Tuition",
    email: "kevinliusingapore@gmail.com",
    uen: "212314",
    address: "Yishun Avenue 4",
    contact_number: "96228693",
  };

  return NextResponse.json(dummyData);
}
