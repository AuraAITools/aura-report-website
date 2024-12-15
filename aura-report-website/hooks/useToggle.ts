import { useState } from "react";

export function useToggle(initial: boolean) {
  const [on, setOn] = useState(initial);
  return { on, setOn };
}
