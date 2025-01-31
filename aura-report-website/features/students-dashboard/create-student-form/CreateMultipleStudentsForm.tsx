import MultiTabLayout from "@/components/ui/multi-tab-layout/MultiTabLayout";
import { BaseCourseSchema } from "@/types/data/Course";
import { BaseLevelSchema } from "@/types/data/Level";
import { BaseStudentSchema } from "@/types/data/Student";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { z } from "zod";
import { CreateStudentForm } from "./CreateStudentForm";
export type CreateMultipleStudentsFormProps = {
  onSuccess?: () => void;
  onFailure?: () => void;
  onError?: () => void;
  accountEmail: string;
};

export const CreateStudentFormFieldsSchema = BaseStudentSchema.omit({
  id: true,
}).extend({
  level: BaseLevelSchema.omit({ id: true }),
  courses: BaseCourseSchema.pick({ name: true, start_date: true }).array(), // TODO: change to enrolled course
});

export type CreateStudentFormFields = z.infer<
  typeof CreateStudentFormFieldsSchema
>;

export const MultipleStudentFormFieldsSchema = z.object({
  students: z.array(CreateStudentFormFieldsSchema),
});

export type MultipleStudentFormFields = z.infer<
  typeof MultipleStudentFormFieldsSchema
>;

export function CreateMultipleStudentsForm(
  props: CreateMultipleStudentsFormProps,
) {
  const methods = useForm<MultipleStudentFormFields>({
    defaultValues: {
      students: [
        {
          email: props.accountEmail,
          courses: [
            {
              name: "",
            },
          ],
        },
      ],
    },
    resolver: zodResolver(MultipleStudentFormFieldsSchema),
  });

  const { control, handleSubmit } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "students",
  });

  const onSubmit: SubmitHandler<MultipleStudentFormFields> = (data) => {
    console.log(`submitted form ${JSON.stringify(data)}`);
    if (props.onSuccess) {
      props.onSuccess();
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        className='flex flex-col gap-2 md:min-h-[700px]'
        onSubmit={handleSubmit(onSubmit)}
      >
        <MultiTabLayout
          tabData={fields.map((field, idx) => {
            return {
              value: field.id,
              tabTitle: (
                <DynamicTabTitle
                  formFieldName={`students.${idx}.name`}
                  defaultTitle={`Student #${idx + 1}`.toUpperCase()}
                />
              ),
              content: <CreateStudentForm index={idx} />,
              key: field.id,
              onCrossIconClick: () => {
                remove(idx);
              },
            };
          })}
          maxTabs={5}
          buttonTitle={"Add more students"}
          onClick={() =>
            append({
              email: "",
              level: {
                name: "",
              },
              courses: [],
              name: "",
              dateOfBirth: new Date(),
              currentSchool: "",
            })
          }
        />
        <button className='bg-black text-white p-4 rounded-xl w-full hover:text-gray-300 justify-self-end mt-auto'>
          Register {fields.length} Students
        </button>
      </form>
    </FormProvider>
  );
}

function DynamicTabTitle({
  formFieldName,
  defaultTitle,
}: {
  formFieldName: string;
  defaultTitle: string;
}) {
  const { control } = useFormContext();
  const title = useWatch({ control, name: formFieldName });
  return <p className='font-semibold text-lg'>{title || defaultTitle} </p>;
}
