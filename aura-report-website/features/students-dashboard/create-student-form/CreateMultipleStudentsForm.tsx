import SelectFormField from "@/components/forms/SelectFormField";
import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import MultiTabLayout from "@/components/ui/multi-tab-layout/MultiTabLayout";
import { CoursesApis } from "@/lib/hooks/courses-queries";
import { LevelsApis } from "@/lib/hooks/levels-queries";
import { SchoolsApis } from "@/lib/hooks/schools-queries";
import { StudentsApis } from "@/lib/hooks/students-queries";
import {
  CreateStudentsInAccountParams,
  CreateStudentsInAccountParamsSchema,
} from "@/lib/requests/students";
import { ACCOUNT_RELATIONSHIP } from "@/types/data/Account";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { CreateStudentForm } from "./CreateStudentForm";
export type CreateMultipleStudentsFormProps = {
  onSuccess?: () => void;
  onFailure?: () => void;
  onError?: () => void;
  accountEmail: string;
  accountId: string;
};

export function CreateMultipleStudentsForm(
  props: CreateMultipleStudentsFormProps,
) {
  const { currentInstitution, currentOutlet } =
    useInstitutionAndOutletsContext();
  const { data: levels = [] } = LevelsApis.useGetAllLevelsOfInstitution(
    currentInstitution?.id,
  );
  const { data: schools = [] } = SchoolsApis.useGetAllSchoolsInInstitution(
    currentInstitution?.id,
  );
  const { data: availableCourses = [] } =
    CoursesApis.useGetAllCoursesFromOutlet(
      currentInstitution?.id,
      currentOutlet?.id,
    );

  const { mutate: createStudentsInAccount } =
    StudentsApis.useCreateStudentsInAccount();

  const methods = useForm<CreateStudentsInAccountParams>({
    defaultValues: {
      students: [{}],
    },
    resolver: zodResolver(CreateStudentsInAccountParamsSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "students",
  });

  const onSubmit: SubmitHandler<CreateStudentsInAccountParams> = (data) => {
    console.log(`submitted form ${JSON.stringify(data)}`);
    createStudentsInAccount(
      { ...data },
      {
        onSuccess: () => props.onSuccess && props.onSuccess(),
      },
    );
  };

  return (
    <FormProvider {...methods}>
      <form
        className='flex flex-col gap-2 md:min-h-[700px]'
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className='flex gap-4'>
          <SelectFormField
            options={ACCOUNT_RELATIONSHIP.map((relationship) => ({
              value: relationship,
              display: relationship.toLocaleLowerCase(),
            }))}
            labelText='Relationship'
            className='w-1/3'
            errorMessage={errors.relationship?.message}
            {...control.register("relationship")}
          />
          <SelectFormField
            {...methods.register("institution_id")}
            options={[
              {
                value: currentInstitution?.id ?? "none",
                display: currentInstitution?.name ?? "no institution",
              },
            ]}
            labelText='Institution'
            className='w-1/3 text-gray-300 pointer-events-none'
            disabled
            type='text'
            errorMessage={errors.institution_id?.message}
          />
          <SelectFormField
            {...methods.register("account_id")}
            options={[
              {
                value: props.accountId,
                display: props.accountEmail,
              },
            ]}
            labelText='Account Email'
            className='w-1/3 text-gray-300 pointer-events-none'
            disabled
            type='text'
            errorMessage={errors.account_id?.message}
          />
        </div>

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
                  schoolOptions={schools.map((s) => ({
                    id: s.id,
                    value: s.name.replaceAll("_", " ").toLowerCase(),
                  }))}
                  outletOptions={
                    !!currentOutlet
                      ? [{ id: currentOutlet.id, value: currentOutlet.name }]
                      : []
                  }
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
              school_id: "",
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
