import { FormField } from "@/components/forms/FormField";
import SelectFormField from "@/components/forms/SelectFormField";
import SelectMultipleFormField from "@/components/forms/SelectMultipleFormField";
import SubmitButton from "@/components/forms/SubmitButton";
import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import { EducatorsApis } from "@/lib/hooks/educators-queries";
import { LessonsApis } from "@/lib/hooks/lessons-queries";
import { StudentsApis } from "@/lib/hooks/students-queries";
import { ExpandedLesson } from "@/types/data/Lesson";
import React from "react";
import classNames from "classnames";
import { useForm, SubmitHandler } from "react-hook-form";
import { Accordion, Dialog } from "radix-ui";
import { ChevronDownIcon, Cross1Icon } from "@radix-ui/react-icons";
import { CreateLessonFormParams } from "../create-lesson-form/CreateLessonForm";
import { convertTimestampToDateTime } from "@/utils/time-utils";
interface AccordionItemProps
  extends React.ComponentPropsWithoutRef<typeof Accordion.Item> {
  className?: string;
  children: React.ReactNode;
}

interface AccordionTriggerProps
  extends React.ComponentPropsWithoutRef<typeof Accordion.Trigger> {
  className?: string;
  children: React.ReactNode;
}

interface AccordionContentProps
  extends React.ComponentPropsWithoutRef<typeof Accordion.Content> {
  className?: string;
  children: React.ReactNode;
}
export type EditLessonDetailsFormProps = {
  lesson: ExpandedLesson;
};
export default function EditLessonDetailsForm({
  lesson,
}: EditLessonDetailsFormProps) {
  const { currentInstitution, currentOutlet } =
    useInstitutionAndOutletsContext();
  // get all educators
  const { data: educators } = EducatorsApis.useGetAllEducatorsFromInstitution(
    currentInstitution?.id,
    currentOutlet?.id,
  );
  // get all students
  const { data: students } = StudentsApis.useGetAllStudentsFromInstitution(
    currentInstitution?.id,
  );
  const { mutate: updateLesson } = LessonsApis.useUpdateLessonInOutlet();
  const onSubmit: SubmitHandler<CreateLessonFormParams> = (params) => {
    console.log(JSON.stringify(params));
    updateLesson({ lesson_id: lesson.id, ...params });
  };

  const { date: start_date, time: start_time } = convertTimestampToDateTime(
    lesson.lesson_start_timestamptz,
  );
  const { date: end_date, time: end_time } = convertTimestampToDateTime(
    lesson.lesson_end_timestamptz,
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<CreateLessonFormParams>({
    defaultValues: {
      name: lesson.name,
      description: lesson.description,
      start_date: new Date(start_date), // FIXME: the default start_date and end_date are not showing up in the edit page
      start_time: start_time,
      end_date: new Date(end_date),
      end_time: end_time,
      student_ids: lesson.students.map((student) => student.id),
      educator_ids: lesson.educators.map((edu) => edu.id),
      institution_id: currentInstitution?.id,
      outlet_id: currentOutlet?.id,
      course_id: lesson.course.id,
    },
  });

  // Define which fields should trigger the save button to appear
  // Add your important fields here
  const importantFields = [
    "name",
    "description",
    "status",
    "date",
    "start_time",
    "end_time",
    "student_ids",
    "educator_ids",
  ];

  // Check if any important fields have changed
  const hasImportantChanges = Object.keys(dirtyFields).some((field) =>
    importantFields.includes(field),
  );

  const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
    ({ children, className, ...props }, forwardedRef) => (
      <Accordion.Item
        className={classNames("overflow-auto", className)}
        {...props}
        ref={forwardedRef}
      >
        {children}
      </Accordion.Item>
    ),
  );

  const AccordionTrigger = React.forwardRef<
    HTMLButtonElement,
    AccordionTriggerProps
  >(({ children, className, ...props }, forwardedRef) => (
    <Accordion.Header className='flex'>
      <Accordion.Trigger
        className={classNames(
          "group flex h-[45px] flex-1 cursor-default items-center justify-between hover:bg-orange-300 data-[state=open]:bg-orange-300 data-[state=open]:text-white px-5 text-[15px] leading-none shadow-[0_1px_0] outline-none",
          className,
        )}
        {...props}
        ref={forwardedRef}
      >
        {children}
        <ChevronDownIcon
          className='text-black size-6 transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180'
          aria-hidden
        />
      </Accordion.Trigger>
    </Accordion.Header>
  ));

  const AccordionContent = React.forwardRef<
    HTMLDivElement,
    AccordionContentProps
  >(({ children, className, ...props }, forwardedRef) => (
    <Accordion.Content
      className={classNames(
        "overflow-auto text-[15px] data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown",
        className,
      )}
      {...props}
      ref={forwardedRef}
    >
      <div className='px-5 py-[15px]'>{children}</div>
    </Accordion.Content>
  ));

  return (
    <div className='flex flex-col h-full gap-2'>
      {/* Edit Form Header */}
      <div className='flex items-center border-b-black border-b-2 p-4'>
        <h1 className='text-2xl font-bold'>Edit Lesson</h1>
        <Dialog.Close asChild>
          <Cross1Icon className='ml-auto' />
        </Dialog.Close>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col h-full'>
        {/* Part of form without accordion */}
        <div className='flex flex-col p-4 gap-4 flex-grow'>
          <SelectFormField
            {...register("institution_id")}
            options={[
              {
                value: currentInstitution?.id ?? "loading",
                display: currentInstitution?.name ?? "loading",
              },
            ]}
            labelText='Institution'
            disabled
            type='text'
          />
          <SelectFormField
            {...register("outlet_id")}
            options={[
              {
                value: currentOutlet?.id ?? "loading",
                display: currentOutlet?.name ?? "loading",
              },
            ]}
            labelText='Outlet'
            disabled
            type='text'
          />
          <SelectFormField
            {...register("course_id")}
            options={[
              {
                value: lesson.course.id,
                display: lesson.course.name,
              },
            ]}
            labelText='Class'
            disabled
            type='text'
          />

          <FormField
            {...register("name")}
            labelText='Lesson Name'
            placeholder={"i.e. lesson name"}
            type='text'
            defaultValue={lesson.name}
          />
          <FormField
            {...register("description")}
            labelText='Description'
            defaultValue={lesson.description}
            placeholder={"i.e. description"}
            type='text'
          />
          {hasImportantChanges && (
            <SubmitButton
              className='ml-auto'
              disabled={isSubmitting}
              buttonTitle={"Save"}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
        <div className='mt-auto'>
          <Accordion.Root
            className='w-full'
            type='single'
            defaultValue='accordion-form'
            collapsible
          >
            <AccordionItem
              value='date-and-time'
              className='border-gray-300 border-t-2'
            >
              <AccordionTrigger>
                <p className='text-2xl'>Date & Time</p>
              </AccordionTrigger>
              <AccordionContent>
                <FormField
                  {...register("start_date")}
                  labelText='lesson start date'
                  defaultValue={new Date(start_date).toString()}
                  type='date'
                  errorMessage={errors.start_date?.message}
                />
                <FormField
                  {...register("end_date")}
                  labelText='lesson end date'
                  defaultValue={end_date}
                  type='date'
                  errorMessage={errors.end_date?.message}
                />
                <FormField
                  {...register("start_time")}
                  labelText='lesson start time'
                  type='time'
                  defaultValue={start_time}
                  errorMessage={errors.start_time?.message}
                />
                <FormField
                  {...register("end_time")}
                  labelText='lesson end time'
                  type='time'
                  defaultValue={end_time}
                  errorMessage={errors.end_time?.message}
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value='students'
              className='border-gray-300 border-t-2'
            >
              <AccordionTrigger>
                <p className='text-2xl'>Students</p>
              </AccordionTrigger>
              <AccordionContent>
                <SelectMultipleFormField
                  {...register("student_ids")}
                  labelText={"Student(s)"}
                  options={
                    students?.map((student) => ({
                      value: student.id,
                      display: student.name,
                    })) ?? []
                  }
                  defaultValue={lesson.students.map((student) => student.id)}
                  formFieldName={""}
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value='educators'
              className='border-gray-300 border-t-2'
            >
              <AccordionTrigger>
                <p className='text-2xl'>Educators</p>
              </AccordionTrigger>
              <AccordionContent>
                <SelectMultipleFormField
                  {...register("educator_ids")}
                  labelText={"Educator(s)"}
                  options={
                    educators?.map((edu) => ({
                      value: edu.id,
                      display: edu.name,
                    })) ?? []
                  }
                  defaultValue={lesson.educators.map((edu) => edu.id)}
                  formFieldName={""}
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value='documents-and-announcements'
              className='border-gray-300 border-t-2'
            >
              <AccordionTrigger>
                <p className='text-2xl'>Documents & Announcements</p>
              </AccordionTrigger>
              <AccordionContent>Documents & Announcements</AccordionContent>
            </AccordionItem>
            <AccordionItem
              value='lesson-plan'
              className='border-gray-300 border-t-2'
            >
              <AccordionTrigger>
                <p className='text-2xl'>Lesson Plan</p>
              </AccordionTrigger>
              <AccordionContent>Lesson Plan</AccordionContent>
            </AccordionItem>
            <AccordionItem
              value='lesson-review'
              className='border-gray-300 border-t-2'
            >
              <AccordionTrigger>
                <p className='text-2xl'>Lesson Review</p>
              </AccordionTrigger>
              <AccordionContent>Lesson Review</AccordionContent>
            </AccordionItem>
            <AccordionItem
              value='changes-made'
              className='border-gray-300 border-t-2'
            >
              <AccordionTrigger>
                <p className='text-2xl'>Changes made</p>
              </AccordionTrigger>
              <AccordionContent>Changes made</AccordionContent>
            </AccordionItem>
          </Accordion.Root>
        </div>
      </form>
    </div>
  );
}
