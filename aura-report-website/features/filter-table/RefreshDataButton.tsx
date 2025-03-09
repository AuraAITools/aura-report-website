import { useToggle } from "@/hooks/useToggle";
import { UpdateIcon } from "@radix-ui/react-icons";
import { useFilterTable } from "./FilterTableRoot";

export default function RefreshDataButton() {
  const { on: loading, setOn: setLoading } = useToggle(false);
  const { refreshData } = useFilterTable();

  async function loadData() {
    setLoading(true);
    await refreshData();
    setLoading(false);
  }

  return (
    <div className='flex justify-center items-center'>
      <button
        className={`flex justify-center items-center w-[50px] h-[50px] rounded-md bg-black text-white hover:text-slate-200`}
        onClick={loadData}
      >
        <UpdateIcon className={`size-5 ${loading && "animate-spin"}`} />
      </button>
    </div>
  );
}
