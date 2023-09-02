import React, { useRef, useState } from "react";
import useAutoFocus from "@/components/hooks/useAutoFocus";

type Props = {
  items: string[];
  value: string;
  debounce?: number;
  autoFocus?: boolean;
  clearInput?: boolean;
  onChange(val: string): void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">;

//we are using dropdown, input and menu component from daisyui
const Autocomplete = ({
  items,
  value: initialValue,
  debounce = 300,
  onChange,
  autoFocus = false,
  clearInput = false,
  ...props
}: Props) => {
  const [value, setValue] = React.useState(initialValue);
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const champSearch = useAutoFocus();

  React.useEffect(() => {
    setValue(value);
  }, [value]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <>
      <div
        // use classnames here to easily toggle dropdown open
        className={` dropdown w-full ${
          open && "dropdown-open"
        } join-item w-full bg-gray-900 font-normal text-gray-400`}
        ref={ref}
      >
        <input
          {...props}
          type="text"
          className={`input input-xs rounded-none`}
          ref={autoFocus ? champSearch : null}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          tabIndex={0}
        />
        {/* add this part */}
        <div className="dropdown-content top-14 z-50 max-h-96 flex-col overflow-auto rounded-md bg-base-200">
          <ul
            className="menu-compact menu"
            // use ref to calculate the width of parent
            style={{ width: ref.current?.clientWidth }}
          >
            {items.map((item, index) => {
              return (
                <li
                  key={index}
                  tabIndex={index + 1}
                  onClick={() => {
                    setValue(item);
                    setOpen(false);
                  }}
                  className="w-full border-b border-b-base-content/10"
                >
                  <button>{item}</button>
                </li>
              );
            })}
          </ul>
          {/* add this part */}
        </div>
      </div>
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

export default Autocomplete;
