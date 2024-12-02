import { Institution } from "@/types/data/Institution";
import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  const dummyData: Institution[] = [
    {
      id: "1",
      name: "Ministry of Tuition",
      email: "kevinliusingapore@gmail.com",
      uen: "212314",
      address: "Yishun Avenue 4",
      contactNumber: "96228693",
    },
    {
      id: "2",
      name: "Ministry of Tuition2",
      email: "kevinliusingapore12@gmail.com",
      uen: "212314",
      address: "Yishun Avenue 4",
      contactNumber: "96228693",
    },
  ];
  return NextResponse.json(dummyData)
}
