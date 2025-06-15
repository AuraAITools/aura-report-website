import { z } from "zod";
import { BaseSubjectSchema } from "./Subject";

export const BaseTopicSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
});

export const ExpandedTopicSchema = BaseTopicSchema.extend({
  subjects: z.array(BaseSubjectSchema),
});

export type BaseTopic = z.infer<typeof BaseTopicSchema>;
export type ExpandedTopic = z.infer<typeof ExpandedTopicSchema>;
