import React from "react";
import useAutoFocus from "@/components/hooks/useAutoFocus";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/cn";

type TableInputProps = {
  value: string | number;
  onChange: (value: string | number) => void;
  autoFocus?: boolean;
  clearInput?: boolean;
  label?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">;

export const TableInput = ({
  value,
  onChange,
  autoFocus = false,
  clearInput = false,
  label,
  id,
  className,
  ...props
}: TableInputProps) => {
  const inputRef = useAutoFocus();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(props.type === "number" && newValue ? Number(newValue) : newValue);
  };

  const inputElement = (
    <input
      ref={autoFocus ? inputRef : null}
      id={id}
      {...props}
      className={cn("input input-xs w-full", className)}
      value={value}
      onChange={handleChange}
    />
  );

  return (
    <>
      {label ? (
        <label htmlFor={id} className="label w-full">
          <span className="hidden">{label}</span>
          {inputElement}
        </label>
      ) : (
        inputElement
      )}

      {clearInput && (
        <button
          disabled={!value}
          className="btn join-item disabled:bg-base-200/50 md:btn-xs"
          onClick={() => onChange("")}
          aria-label="Clear search input"
        >
          <XIcon size={14} />
        </button>
      )}
    </>
  );
};
