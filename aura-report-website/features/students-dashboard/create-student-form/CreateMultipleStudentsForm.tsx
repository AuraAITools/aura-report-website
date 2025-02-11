import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import MultiTabLayout from "@/components/ui/multi-tab-layout/MultiTabLayout";
import { CoursesApis } from "@/lib/hooks/courses-queries";
import { LevelsApis } from "@/lib/hooks/levels-queries";
import { StudentsApis } from "@/lib/hooks/students-queries";
import { CreateStudentRequestBodySchema } from "@/lib/requests/students";
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
  accountId: string;
};

export const MultipleStudentFormFieldsSchema = z.object({
  students: CreateStudentRequestBodySchema.extend({
    institution_id: z.string().uuid(),
    account_id: z.string().uuid(),
  }).array(),
});

export type MultipleStudentFormFields = z.infer<
  typeof MultipleStudentFormFieldsSchema
>;

export function CreateMultipleStudentsForm(
  props: CreateMultipleStudentsFormProps,
) {
  const { currentInstitution, currentOutlet } =
    useInstitutionAndOutletsContext();
  const { data: levels = [] } = LevelsApis.useGetAllLevelsOfInstitution(
    currentInstitution?.id,
  );
  const { data: availableCourses = [] } =
    CoursesApis.useGetAllCoursesFromOutlet(
      currentInstitution?.id,
      currentOutlet?.id,
    );

  const { mutate: mutateStudent } =
    StudentsApis.useCreateStudentInStudentClientAccount();

  const methods = useForm<MultipleStudentFormFields>({
    defaultValues: {
      students: [
        {
          institution_id: currentInstitution?.id,
          account_id: props.accountId,
          course_ids: [],
          level_id: "",
        },
      ],
    },
    // resolver: zodResolver(MultipleStudentFormFieldsSchema),
  });

  const { control, handleSubmit } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "students",
  });

  const onSubmit: SubmitHandler<MultipleStudentFormFields> = (data) => {
    console.log(`submitted form ${JSON.stringify(data)}`);
    data.students.map((student) => {
      mutateStudent({
        ...student,
      });
    });
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
              content: (
                <CreateStudentForm
                  accountEmail={props.accountEmail}
                  index={idx}
                  levelOptions={levels.map((lvl) => ({
                    id: lvl.id,
                    value: lvl.name,
                  }))}
                  courseOptions={availableCourses.map((c) => ({
                    id: c.id,
                    value: c.name,
                  }))}
                />
              ),
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
              email: props.accountEmail,
              level_id: "",
              course_ids: [],
              name: "",
              date_of_birth: new Date(),
              current_school: "",
              institution_id: currentInstitution?.id || "",
              account_id: props.accountId,
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
