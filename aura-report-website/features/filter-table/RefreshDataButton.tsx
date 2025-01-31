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
    <button
      className={`flex rounded p-1 bg-orange-300 text-white size-8 items-center justify-center hover:bg-orange-400`}
      onClick={loadData}
    >
      <UpdateIcon className={`${loading && "animate-spin"}`} />
    </button>
  );
}
