import { BackDrop } from "@/components/ui/Backdrop";
import { Student } from "@/types/data/Student";

type SideModalProps = {
  show: boolean;
  onClick: () => void;
} & Student;

export function SideModal(props: SideModalProps) {
  return (
    <>
      {props.show && (
        <>
          <BackDrop onClick={props.onClick} />
          <div className='absolute top-0 left-1/2 w-1/2 z-1 bg-white h-screen'>
            Side modal
          </div>
        </>
      )}
    </>
  );
}
