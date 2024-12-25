import { z } from "zod";
import { courseSchema } from "./Course";
import { educatorSchema } from "./Educator";
import { studentSchema } from "./Student";
import { subjectSchema } from "./Subject";

const levelSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  subjects: z.array(subjectSchema),
  courses: z.array(courseSchema),
  students: z.array(studentSchema),
  educators: z.array(educatorSchema),
});

export type Level = z.infer<typeof levelSchema>;
