import { FormField } from "@/components/forms/FormField";
import SelectFormField from "@/components/forms/SelectFormField";
import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import { DAYS, LESSON_FREQUENCY } from "@/types/data/Course";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { generateKey } from "@/utils/id";
import { Checkbox } from "radix-ui";
import { CheckIcon } from "@radix-ui/react-icons";
import { useToggle } from "@/hooks/useToggle";
import {
  CreateCourseFormParams,
  CreateLessonParamsInForm,
} from "./CreateCourseMultistepForm";
import HorizontalMultiSelect from "@/components/forms/HorizontalMultiSelect";
import { CreateLessonParams } from "@/lib/requests/lesson";

function generateLessons(
  startDate: Date,
  endDate: Date,
  startTime: string,
  endTime: string,
  frequency: (typeof LESSON_FREQUENCY)[number],
  selectedDays: (typeof DAYS)[number][],
  className: string,
) {
  // If no days are selected, return empty array
  if (!selectedDays || selectedDays.length === 0) {
    return [];
  }

  // Calculate frequency in days
  let frequencyInDays;
  switch (frequency) {
    case "WEEKLY":
      frequencyInDays = 7;
      break;
    case "FORTNIGHTLY":
      frequencyInDays = 14;
      break;
    case "MONTHLY":
      frequencyInDays = 28; // Approx 4 weeks
      break;
    default:
      frequencyInDays = 7; // Default to weekly
  }

  type LessonData = {
    class_name: string;
    date: Date;
    day: (typeof DAYS)[number];
    startTime: string;
    endTime: string;
    fullDateStart: Date;
    fullDateEnd: Date;
  };

  const lessonsData: LessonData[] = [];
  let lessonCounter = 1;

  // Create a loop for each selected day
  for (const selectedDay of selectedDays) {
    // Find the first occurrence of this day from the start date
    const dayIndex = DAYS.indexOf(selectedDay);
    const currentDayIndex = startDate.getDay();
    const daysToAdd = (dayIndex - currentDayIndex + 7) % 7;

    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + daysToAdd + 1);

    // Generate lessons for this day until we reach the end date
    while (currentDate <= endDate) {
      if (currentDate >= startDate) {
        lessonsData.push({
          class_name: `${className} Lesson #${lessonCounter}`,
          date: new Date(currentDate),
          day: selectedDay,
          startTime,
          endTime,
          fullDateStart: new Date(
            `${currentDate.toISOString().split("T")[0]}T${startTime}`,
          ),
          fullDateEnd: new Date(
            `${currentDate.toISOString().split("T")[0]}T${endTime}`,
          ),
        });
      }

      // Move to the next occurrence based on frequency
      currentDate.setDate(currentDate.getDate() + frequencyInDays);
    }
  }

  // Sort lessons by date
  lessonsData.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Renumber lessonsData after sorting
  lessonsData.forEach((lesson, index) => {
    lesson.class_name = `${className} Lesson #${index + 1}`;
  });

  return lessonsData;
}

export default function CreateCourseFrequencyForm() {
  const { currentInstitution, currentOutlets, currentOutlet } =
    useInstitutionAndOutletsContext();

  const { on: checked, setOn: setChecked } = useToggle(false);

  const {
    register,
    watch,
    formState: { errors, isSubmitting },
  } = useFormContext<CreateCourseFormParams>();

  const start_date = watch("start_date");
  const end_date = watch("end_date");
  const start_time = watch("start_time");
  const end_time = watch("end_time");
  const class_name = watch("name");
  const lesson_repeat_days = watch("lesson_repeat_days");

  const unfocusedOutlets = currentOutlets.filter(
    (outlet) => outlet.id !== currentOutlet!.id,
  );
  const outletOptions = [currentOutlet!, ...unfocusedOutlets];
  return (
    <div className='flex h-[70vh]'>
      <div className='flex flex-col gap-4 h-[70vh] overflow-auto w-full'>
        <div className='flex gap-4 px-4'>
          <FormField
            {...register("start_date")}
            labelText='Start Date'
            type='date'
            min={new Date().toISOString().split("T").at(0)}
            className='w-1/2'
            errorMessage={errors.start_date?.message}
          />
          <FormField
            {...register("end_date")}
            labelText='End Date (Optional)'
            type='date'
            min={new Date().toISOString().split("T").at(0)}
            className='w-1/2'
            errorMessage={errors.end_date?.message}
          />
        </div>
        <div className='flex px-4 gap-4'>
          <Checkbox.Root
            className='border-[2px] flex size-[25px] appearance-none items-center justify-center rounded bg-white outline-none focus:shadow-[0_0_0_2px_black]'
            checked={checked}
            onClick={() => setChecked((prev) => !prev)}
            id='generate-lessons-checkbox'
          >
            <Checkbox.Indicator className='text-black'>
              <CheckIcon className='text-green-500' />
            </Checkbox.Indicator>
          </Checkbox.Root>
          <label
            className='row-start-2 text-[15px] whitespace-nowrap'
            htmlFor='generate-lessons-checkbox'
          >
            generate lessons
          </label>
        </div>
        {checked && (
          <>
            <div className='flex gap-4 px-4'>
              <FormField
                {...register("start_time")}
                labelText='Start Time'
                type='time'
                className='w-1/2'
                errorMessage={errors.start_time?.message}
              />
              <FormField
                {...register("end_time")}
                labelText='End Time'
                type='time'
                className='w-1/2'
                errorMessage={errors.end_time?.message}
              />
            </div>
            {/* TODO: make this into a multiselect */}
            <HorizontalMultiSelect
              className='px-4'
              labelText={"Lesson Repeats on"}
              options={DAYS.map((day) => ({
                display:
                  day.charAt(0).toUpperCase() +
                  day.slice(1).toLocaleLowerCase(),
                value: day,
              }))}
              formFieldName={""}
              {...register("lesson_repeat_days")}
            />
            <SelectFormField
              options={LESSON_FREQUENCY.map((freq) => ({
                display: freq.toLowerCase(),
                value: freq,
              }))}
              {...register("lesson_frequency")}
              labelText='lesson frequency'
              type='text'
              defaultValue={LESSON_FREQUENCY[0]}
              className='row-start-5 col-span-1 px-4'
              errorMessage={errors.lesson_frequency?.message}
            />
          </>
        )}
      </div>
      {checked && (
        <LessonGeneratedSidebar
          class_name={class_name ?? "class"}
          start_date={start_date}
          start_time={start_time}
          end_date={end_date}
          end_time={end_time}
          lesson_frequency={watch("lesson_frequency")}
          lesson_repeat_days={lesson_repeat_days}
        />
      )}
    </div>
  );
}

type LessonGeneratedSidebarProps = {
  start_date: Date;
  start_time: string;
  end_date: Date;
  end_time: string;
  class_name: string;
  lesson_frequency: (typeof LESSON_FREQUENCY)[number];
  lesson_repeat_days: (typeof DAYS)[number][];
};
export function LessonGeneratedSidebar({
  start_date,
  start_time,
  end_date,
  end_time,
  class_name,
  lesson_frequency,
  lesson_repeat_days,
}: LessonGeneratedSidebarProps) {
  // Get access to the form methods
  const { setValue, watch } = useFormContext<CreateCourseFormParams>();

  // Generate lessons and update form when dependencies change
  useEffect(() => {
    if (
      start_date &&
      start_time &&
      end_date &&
      end_time &&
      lesson_repeat_days?.length > 0
    ) {
      const generatedLessons = generateLessons(
        new Date(`${start_date}T${start_time}`),
        new Date(`${end_date}T${end_time}`),
        start_time,
        end_time,
        lesson_frequency,
        lesson_repeat_days,
        class_name,
      );

      // Format lessons for the form
      const formattedLessons: CreateLessonParamsInForm[] = generatedLessons.map(
        (lesson) => ({
          name: lesson.class_name,
          outlet_room_id: watch("outlet_room_id"),
          lesson_start_timestamptz: lesson.fullDateStart.toISOString(),
          lesson_end_timestamptz: lesson.fullDateEnd.toISOString(),
          educator_ids: watch("educator_ids"),
          student_ids: watch("student_ids"),
          description: "",
        }),
      );
      setValue("lessons", formattedLessons);
    }
  }, [
    start_date,
    start_time,
    end_date,
    end_time,
    lesson_frequency,
    lesson_repeat_days,
    class_name,
    setValue,
  ]);

  // Rest of your component remains the same
  return (
    <div className='col-span-2 p-2 flex-col min-w-[300px] overflow-auto border-l-[2px]'>
      {!start_date || !start_time || !end_date || !end_time ? (
        <div>No Generated Lessons</div>
      ) : (
        <div className='flex flex-col overflow-hidden'>
          {generateLessons(
            new Date(`${start_date}T${start_time}`),
            new Date(`${end_date}T${end_time}`),
            start_time,
            end_time,
            lesson_frequency,
            lesson_repeat_days || [],
            class_name,
          ).map((lesson, idx) => {
            return (
              <LessonCell
                key={generateKey(
                  "_lesson_cell",
                  idx.toString(),
                  idx.toString(),
                )}
                title={lesson.class_name}
                date={lesson.date.toLocaleDateString()}
                time={`${start_time} to ${end_time}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

type LessonCellProp = {
  title: string;
  date: string;
  time: string;
};
export function LessonCell({ title, date, time }: LessonCellProp) {
  return (
    <div className='flex flex-col p-4 ring-black md:min-h-[100px] border-[1px] border-black'>
      <div>{title}</div>
      <div>{date}</div>
      <div>{time}</div>
    </div>
  );
}

export function GenerateLessonFormSection() {
  return <div>GenerateLessonFormSection</div>;
}
