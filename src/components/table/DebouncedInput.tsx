import React from "react";
import useAutoFocus from "@/components/hooks/useAutoFocus";

type DebouncedInputProps = {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
  autoFocus?: boolean;
  clearInput?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">;
export const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 300,
  autoFocus = false,
  clearInput = false,
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
      <input
        ref={autoFocus ? champSearch : null}
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {clearInput && (
        <button
          disabled={!value}
          className="btn join-item btn-xs rounded border text-gray-400 disabled:bg-gray-900 disabled:text-gray-700"
          onClick={() => setValue("")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M2.293 2.293a1 1 0 011.414 0L10 8.586l6.293-6.293a1 1 0 111.414 1.414L11.414 10l6.293 6.293a1 1 0 11-1.414 1.414L10 11.414l-6.293 6.293a1 1 0 01-1.414-1.414L8.586 10 2.293 3.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </>
  );
};
