import DebouncedInput from "@/components/forms/DebouncedInput";
import { useFilterTable } from "./FilterTableRoot";

export default function GlobalFilterInput() {
  const { globalFilter, setGlobalFilter } = useFilterTable();
  return (
    <DebouncedInput
      value={globalFilter ?? ""}
      onChange={(value) => setGlobalFilter(String(value))}
      className='p-2 font-lg shadow border border-block rounded-xl'
      placeholder='Search all'
    />
  );
}
