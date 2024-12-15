import { DynamicClassFormFields } from "./DynamicClassFormFields";

export default function StudentClassRegistrationForm() {
  return (
    <div>
      <DynamicClassFormFields
        labelText={"Classes"}
        disabled={false}
        options={["class1", "class2"]}
      />
    </div>
  );
}
