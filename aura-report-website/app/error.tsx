"use client";
import ErrorDisplay from "@/components/error/ErrorDisplay";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log the error to an error reporting service
  return (
    <div className='flex justify-center items-center w-screen h-screen'>
      <ErrorDisplay
        onResetButtonClick={reset}
        message={`Oops. Something went wrong. ${error.message}`}
        reloadButtonMessage={"reload"}
      />
    </div>
  );
}
