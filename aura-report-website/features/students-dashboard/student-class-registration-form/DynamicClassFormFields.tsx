import { AnimatePresence } from "motion/react";
import { nanoid } from "nanoid";
import { useState } from "react";
import { AddClassFormButton } from "./AddClassFormButton";
import { SingleClassFormField } from "./SingleClassFormField";

export type ClassFormFieldProps = {
  labelText: string;
  disabled?: boolean;
  options: string[];
};

type SingleClassFormDetail = {
  id: string;
  class: string;
  startDate?: Date;
  endDate?: Date;
};

function newEmptyClassFormDetail(): SingleClassFormDetail {
  return {
    id: nanoid(),
    class: "",
    startDate: undefined,
    endDate: undefined,
  };
}

export function DynamicClassFormFields(props: ClassFormFieldProps) {
  const [inputClasses, setInputClasses] = useState<SingleClassFormDetail[]>([
    newEmptyClassFormDetail(),
  ]);

  function addClass() {
    setInputClasses((prevClass) => {
      return [...prevClass, newEmptyClassFormDetail()];
    });
  }

  function onClose(id: string) {
    setInputClasses((prevInputClasses) =>
      prevInputClasses.filter((inputClass) => inputClass.id !== id),
    );
  }

  return (
    <div className='flex flex-col ring-black gap-2 rounded-xl'>
      <h1 className='text-center font-medium'>Choose Classes</h1>
      <AnimatePresence>
        {inputClasses.map((clz) => (
          <SingleClassFormField onClose={() => onClose(clz.id)} />
        ))}
      </AnimatePresence>
      <AddClassFormButton onClick={addClass} />
    </div>
  );
}
