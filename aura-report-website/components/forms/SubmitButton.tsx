import { UpdateIcon } from "@radix-ui/react-icons";

export type SubmitButtonProps = {
  className?: string;
  disabled: boolean;
  buttonTitle: string;
  isSubmitting: boolean;
};
export default function SubmitButton(props: SubmitButtonProps) {
  const { disabled, className, buttonTitle, isSubmitting } = props;
  return (
    <button
      type='submit'
      className={`w-[200px] min-h-[60px] bg-black text-white rounded-lg hover:text-slate-200 ${className}`}
      disabled={disabled}
    >
      {isSubmitting ? (
        <SubmittingAnimation />
      ) : (
        <p className='text-md'>{buttonTitle}</p>
      )}
    </button>
  );
}

function SubmittingAnimation() {
  return (
    <div className='flex justify-center items-center gap-2'>
      <UpdateIcon className='animate-spin size-6' />
      <p>Submitting</p>
    </div>
  );
}
