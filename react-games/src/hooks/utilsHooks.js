import { useEffect, useState } from "react";

export const useDebounce = (value) => {
  const [debouncedValue, setDebouncedValue] = useState("");
  useEffect(() => {
    const filter = setTimeout(() => {
      setDebouncedValue(value);
    }, 700);
    return () => {
      clearTimeout(filter);
    };
  }, [value]);

  return debouncedValue;
};
