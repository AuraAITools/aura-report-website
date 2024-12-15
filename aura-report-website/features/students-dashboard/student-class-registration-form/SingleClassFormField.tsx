import { motion } from "motion/react";
import { FormField } from "../../../components/forms/FormField";
import SelectFormField from "../../../components/forms/SelectFormField";
import { RemoveSingleClassFormFieldButton } from "./RemoveSingleClassFormFieldButton";
export type SingleClassFormField = {
  onClose: () => void;
};
export function SingleClassFormField(props: SingleClassFormField) {
  return (
    <motion.div className='grid grid-cols-10 gap-6 my-2'>
      <SelectFormField
        id='class'
        labelText='Class'
        placeholder=''
        type='select'
        options={["p1", "p2", "p3", "p4"]}
        className='col-span-2'
      />
      <FormField
        id={"start_date"}
        labelText='Start Date'
        placeholder={""}
        type='date'
        className='col-start-3 col-span-2'
      />
      <FormField
        id={"end_date"}
        labelText='End Date'
        placeholder={""}
        type='date'
        className='col-start-6 col-span-4'
      />
      <motion.div className='col-span-1 flex flex-col'>
        <RemoveSingleClassFormFieldButton
          className='ml-auto m-1'
          onClick={props.onClose}
        />
        <motion.button className='inline-flex flex-1 justify-center rounded-lg items-center bg-orange-300 hover:bg-orange-400 text-white'>
          register
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
