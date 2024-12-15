import { FormField } from "../../../components/forms/FormField";
import SelectFormField from "../../../components/forms/SelectFormField";
import { SubmitFormButton } from "../create-client-account-form/SubmitFormButton";
import StudentClassRegistrationForm from "../student-class-registration-form/StudentClassRegistrationForm";

export type FormCallbacks = {
  onSuccess?: () => void;
  onFailure?: () => void;
  onError?: () => void;
};

export function CreateStudentsForm(props: FormCallbacks) {
  return (
    // <Tabs.Root defaultValue='student1'>
    //   <Tabs.List className='flex h-[45px] items-center flex-1 cursor-default select-none border-b-2 border-b-bl'>
    //     <TabTrigger value='student1'>Student1</TabTrigger>
    //     <TabTrigger value='student2'>Student2</TabTrigger>
    //   </Tabs.List>

    //   <Tabs.Content value='student1'>
    <SingleCreateStudentForm />
    //   </Tabs.Content>
    //   <Tabs.Content value='student2'>
    //     <SingleCreateStudentForm />
    //   </Tabs.Content>
    // </Tabs.Root>
  );
}

export function SingleCreateStudentForm() {
  return (
    <form className='grid grid-cols-2 gap-6 py-4'>
      <FormField
        id={"account"}
        labelText={"Account Email"}
        placeholder='email@gmail.com'
        type={"text"}
        disabled={true}
      />
      <FormField
        id={"name"}
        labelText={"Full Name"}
        placeholder={"i.e Edward Lee"}
        type={"text"}
        disabled={false}
      />
      <FormField
        id={"dob"}
        labelText={"Date of Birth"}
        placeholder={"14/09/1998"}
        type={"date"}
        disabled={false}
      />
      <FormField
        id={"email"}
        labelText={"Email Address of Parent/Student"}
        placeholder={"example@gmail.com"}
        type={"text"}
      />
      <SelectFormField
        id={"curr_school"}
        labelText={"Current School"}
        placeholder={""}
        type={"select"}
        options={["Chung Cheng High (Yishun)", "Orchid Park Secondary"]}
      />
      <SelectFormField
        id={"curr_level"}
        labelText={"Current Level"}
        placeholder={""}
        type={"select"}
        options={["sec 1", "sec 2", "sec 3", "sec 4"]}
      />
      <div className='col-span-2'>
        <StudentClassRegistrationForm />
      </div>
      <SubmitFormButton className='col-span-2'>Add Student</SubmitFormButton>
    </form>
  );
}

// export type TabTriggerProps = {
//   value: string;
// } & PropsWithChildren;
// export default function TabTrigger(props: TabTriggerProps) {
//   return (
//     <Tabs.Trigger
//       className='p-2 hover:border-b-orange-300 hover:border-b-4 hover:text-white hover:bg-orange-200 rounded-t-lg data-[state=active]:text-white data-[state=active]:bg-orange-300'
//       value={props.value}
//       defaultChecked
//     >
//       {props.children}
//     </Tabs.Trigger>
//   );
// }
