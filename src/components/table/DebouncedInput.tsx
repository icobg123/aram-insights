import React from "react";
import useAutoFocus from "@/components/hooks/useAutoFocus";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/cn";

type DebouncedInputProps = {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
  autoFocus?: boolean;
  clearInput?: boolean;
  label?: string; // Add a label prop
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">;

export const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 300,
  autoFocus = false,
  clearInput = false,
  label, // Destructure the label prop
  id,
  className,
  ...props
}: DebouncedInputProps) => {
  const [value, setValue] = React.useState(initialValue);
  const champSearch = useAutoFocus();
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <>
      {label && (
        <label htmlFor={id} className="label w-full">
          <span className="hidden">{label}</span>
          <input
            ref={autoFocus ? champSearch : null}
            id={id} // Add id to the input
            {...props}
            className={cn("input input-xs w-full", className)}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </label>
      )}

      {clearInput && (
        <button
          disabled={!value}
          className="btn join-item disabled:bg-base-200/50 md:btn-xs"
          onClick={() => setValue("")}
          aria-label="Clear search input"
        >
          <XIcon size={14} />
        </button>
      )}
    </>
  );
};
