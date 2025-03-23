import { PropsWithChildren } from "react";

export function FilterTableContentContainer({ children }: PropsWithChildren) {
  return (
    <table className='w-full my-4 rounded-xl bg-white p-4'>{children}</table>
  );
}
