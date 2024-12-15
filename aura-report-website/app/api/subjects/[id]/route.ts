import { subjects } from "@/constants/subjects";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
const idParamsSchema = z.object({
  id: z.string(),
});

export type IdParams = z.infer<typeof idParamsSchema>;
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<IdParams> },
) {
  const newParams = await params;
  let { data, error } = idParamsSchema.safeParse(newParams);
  if (error) {
    return new NextResponse(JSON.stringify(error), { status: 400 });
  }

  let idx = subjects.findIndex((subject) => subject.id === newParams.id);
  if (idx === -1) {
    return new NextResponse(null, { status: 404 });
  }
  subjects.splice(idx, 1);

  return new NextResponse(null, { status: 204 });
}
