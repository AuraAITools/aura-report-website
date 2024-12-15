import { ExclamationTriangleIcon, UpdateIcon } from "@radix-ui/react-icons";

export type ErrorDisplayProps = {
  onResetButtonClick: () => void;
  message: string;
  reloadButtonMessage: string;
};
export default function ErrorDisplay(props: ErrorDisplayProps) {
  return (
    <div className='flex flex-col justify-center items-center h-full w-full'>
      <div>
        <ExclamationTriangleIcon className='text-yellow-400 md:size-24' />
      </div>
      <h2 className='text-lg'> {props.message} </h2>
      <div className='mt-2' />
      <button
        className='group flex justify-center items-center gap-2 text-lg text-white bg-orange-300 rounded-lg p-2 px-4 hover:bg-orange-400'
        onClick={
          // Attempt to recover by trying to re-render the segment
          props.onResetButtonClick
        }
      >
        <UpdateIcon className='group-hover:animate-spin md:size-5' />
        {props.reloadButtonMessage}
      </button>
    </div>
  );
}
