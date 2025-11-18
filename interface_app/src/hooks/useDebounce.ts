import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 300) {
  const [debound, setDebound] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebound(value), delay);

    return () => clearTimeout(id);
  }, [value, delay]);
  return debound;
}
