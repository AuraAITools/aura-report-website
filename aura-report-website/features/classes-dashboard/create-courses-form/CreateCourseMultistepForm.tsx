import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import { useMultiStepLayout } from "@/hooks/useMultiStepLayout";
import React, { useState } from "react";
import CreateCoursesForm from "./CreateCoursesForm";
import CreateCourseFrequencyForm from "./CreateCourseFrequencyForm";
import { CloseDialogButton } from "@/features/students-dashboard/create-client-account-form/CloseDialogButton";
import MultiStepLayout from "@/components/ui/multi-step-layout/MultiStepLayout";
import SubmitButton from "@/components/forms/SubmitButton";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { CreateCourseParamsSchema } from "@/lib/requests/courses";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useCreateCourseInOutlet } from "@/lib/hooks/courses-queries";
import { CreateLessonParamsSchema } from "@/lib/requests/lesson";
import { DAYS } from "@/types/data/Course";
export const CreateLessonParamsInFormSchema = CreateLessonParamsSchema.omit({
  course_id: true,
  institution_id: true,
  outlet_id: true,
});

export type CreateLessonParamsInForm = z.infer<
  typeof CreateLessonParamsInFormSchema
>;

export const CreateCourseFormParamsSchema = CreateCourseParamsSchema.extend({
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  student_ids: z.string().uuid().array(),
  educator_ids: z.string().uuid().array(),
  outlet_room_id: z.string().uuid().optional(),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Please enter a valid time in 24-hour format (HH:MM)",
  }),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Please enter a valid time in 24-hour format (HH:MM)",
  }),
  lesson_repeat_days: z.enum(DAYS).array(),
  lessons: CreateLessonParamsInFormSchema.array(),
})
  .omit({
    course_end_timestamptz: true,
    course_start_timestamptz: true,
  })
  .transform((data) => {
    const startDateTime = new Date(
      `${data.start_date.toISOString().split("T")[0]}T${data.start_time}:00`,
    );

    // Combine date and time for end
    const endDateTime = new Date(
      `${data.end_date.toISOString().split("T")[0]}T${data.end_time}:00`,
    );

    // Convert to timestamptz using browser's local timezone
    return {
      ...data,
      course_start_timestamptz: startDateTime.toISOString(),
      course_end_timestamptz: endDateTime.toISOString(),
    };
  });

export type CreateCourseFormParams = z.infer<
  typeof CreateCourseFormParamsSchema
>;

type CreateCourseMultistepFormProps = {
  onSuccess: () => void;
};
export default function CreateCourseMultistepForm(
  props: CreateCourseMultistepFormProps,
) {
  const [stepIsCompleted, setFormIsCompleted] = useState<boolean[]>([
    false,
    false,
  ]);

  const { step, prev, next, currentIndex, steps, isFirstStep, isLastStep } =
    useMultiStepLayout([
      <CreateCoursesForm
        onSuccess={function (): void {
          throw new Error("Function not implemented.");
        }}
      />,
      <CreateCourseFrequencyForm />,
    ]);
  const { mutate: createCourse } = useCreateCourseInOutlet();

  const control = useForm<CreateCourseFormParams>({
    resolver: zodResolver(CreateCourseFormParamsSchema),
    // TODO: turn on
  });

  const onSubmit: SubmitHandler<CreateCourseFormParams> = async (data) => {
    console.log(`submitted data ${JSON.stringify(data, null, 2)}`);
    createCourse(data, { onSuccess: props.onSuccess });
  };

  return (
    <div>
      <CloseDialogButton />
      <MultiStepLayout
        title='Add Class'
        currentStep={currentIndex + 1}
        totalStep={steps.length}
        titles={["Core details", "Frequencies & Timings"]}
        completionStatuses={stepIsCompleted} // to maintain with state
      />
      <FormProvider {...control}>
        <form onSubmit={control.handleSubmit(onSubmit)}>
          {step}
          <div className='m-4' />
          {isFirstStep() && (
            <div
              className='w-1/5 mt-auto mx-4 h-[60px] bg-black text-white flex justify-center p-4 items-center rounded-md hover:text-slate-400'
              onClick={next}
            >
              Next: Lesson Timings
            </div>
          )}
          {isLastStep() && (
            <div className='flex mb-4'>
              <div
                className='w-1/5 mt-auto mx-4 h-[60px] bg-black text-white flex justify-center p-4 items-center rounded-md hover:text-slate-400'
                onClick={prev}
              >
                <ChevronLeftIcon className='size-5' />
                <p>Previous</p>
              </div>

              <SubmitButton
                className='mt-auto px-4'
                disabled={false}
                buttonTitle={"complete class registration"}
                isSubmitting={false}
              />
            </div>
          )}
        </form>
      </FormProvider>
    </div>
  );
}
